var app = getApp();
var util = require('../../../../utils/util.js');
Page({
    data: {
        announcements: null,
        loading: true,
        noData: false
    },
    onLoad: function (options) {
        app.mta.Page.init();
        var that = this;
        var toastMsg = '';
        var failed = true;
        app.showLoading();
        wx.request({
            url: app.globalData.announcementUrl,
            data: {},
            method: 'GET',
            header: {
                Authorization: app.globalData.wxGlobalToken
            },
            success: function (res) {
                if (res.data.message == "success") {
                    failed = false;
                    if(util.isEmpty(res.data.result)) {
                        that.setData({
                            noData: true
                        })
                    }else{
                        that.setData({
                            announcements: res.data.result,
                            noData: false
                        })
                    }
                } else {
                    that.setData({
                        noData: true
                    });
                    toastMsg = "获取教务公告失败，请稍后重试";
                }
            },
            fail: function (res) {
                toastMsg = "请求失败，请稍后重试";
            },
            complete: function (res) {
                that.setData({
                    loading: false
                });
                app.hideLoading();
                if (failed) {
                    app.showToast(toastMsg, false);
                    app.navigateBack();
                }
            }
        })
    },
    viewAnnouncementDetail: function (e) {
        app.announcementDetail = e.currentTarget.dataset.announcementDetail;
        app.navigateToPage("/pages/module/announcement/announcementDetail/announcementDetail");
    }
})