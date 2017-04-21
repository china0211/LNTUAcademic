var app = getApp();
Page({
    data: {
        announcements: null
    },
    onLoad: function(options) {
        var that = this;
        wx.request({
            url: app.globalData.getAnnouncementUrl,
            data: {},
            method: 'GET',
            header: {},
            success: function(res) {
                if (res.data.status == "success") {
                    that.setData({
                        announcements: res.data.result
                    })
                } else {
                    app.showToast("获取教务公告失败，请稍后重试", false)
                }
            },
            fail: function(res) {
                app.showToast("请求失败，请稍后重试", false)
            }
        })
    },
    viewAnnouncementDetail: function(e) {
        app.announcementDetail = e.currentTarget.dataset.announcementDetail;
        app.navigateToPage("/pages/module/announcement/announcementDetail/announcementDetail");
    }
})