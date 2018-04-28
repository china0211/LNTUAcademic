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
        this.getAnnouncementFromStorage();
    },
    getAnnouncementFromStorage: function () {
        var that = this;
        wx.getStorage({
            key: 'announcementDetail',
            success: function (res) {
                that.setData({
                    lastDeliverDate: res.data.lastDeliverDate,
                    announcements: res.data.announcements
                });
            },
            fail: function (res) {
                that.setData({
                    lastDeliverDate: 0,
                    announcements: []
                });
            },
            complete: function (res) {
                app.getSystemInfo();
                that.getAnnouncement();
            }
        });
    },
    getAnnouncement: function () {
        var that = this;
        var toastMsg = '';
        var failed = true;
        app.showLoading();
        wx.request({
            url: app.globalData.announcementUrl,
            data: {
                lastDeliverDate: that.data.lastDeliverDate
            },
            method: 'GET',
            header: {
                Authorization: app.globalData.authorization
            },
            success: function (res) {
                if (res.data.message == "success") {
                    failed = false;
                    if (util.isEmpty(that.data.announcements) && util.isEmpty(res.data.result)) {
                        that.setData({
                            noData: true
                        })
                    } else {
                        var announcements = that.data.announcements;

                        for (var i = res.data.result.length; i > 0; i--) {
                            announcements.splice(0, 0, res.data.result[i - 1]);
                        }
                        // 当数组长度超过10时截断，防止数据过长无法set
                        announcements = announcements.splice(0, 10);
                        that.setData({
                            announcements: announcements,
                            noData: false
                        });
                        var announcementDetail = {};
                        announcementDetail.lastDeliverDate = util.formatDataToTimestamp(that.data.announcements[0].deliverDate, app.globalData.systemInfo);
                        announcementDetail.announcements = that.data.announcements;
                        app.saveStorage("announcementDetail", announcementDetail);
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
});