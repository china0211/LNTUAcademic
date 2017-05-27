var app = getApp();
var util = require('../../../../utils/util.js');
Page({
    data: {
        announcements: null
    },
    onLoad: function(options) {
        app.mta.Page.init();
        var that = this;
        var toastMsg = '';
        var failed = true;
        app.showLoading();
        wx.request({
            url: app.globalData.getAnnouncementUrl,
            data: {},
            method: 'GET',
            header: {
                Authorization: app.globalData.wxGlobalToken
            },
            success: function(res) {
                if (res.data.status == "success") {
                    failed = false;
                    that.handlerData(res.data.result);
                } else {
                    toastMsg = "获取教务公告失败，请稍后重试";
                }
            },
            fail: function(res) {
                toastMsg = "请求失败，请稍后重试";
            },
            complete: function(res) {
                app.hideLoading();
                if (failed) {
                    app.showToast(toastMsg, false);
                    app.navigateBack();
                }
            }
        })
    },
    viewAnnouncementDetail: function(e) {
        app.announcementDetail = e.currentTarget.dataset.announcementDetail;
        app.navigateToPage("/pages/module/announcement/announcementDetail/announcementDetail");
    },
    //处理数据
    handlerData:function(annoucements){
      var that = this;
      for(var i = 0; i < annoucements.length; i++){
        annoucements[i].date = util.formatDate(new Date(annoucements[i].date));
      }
      that.setData({
        announcements: annoucements
      })
    }
})