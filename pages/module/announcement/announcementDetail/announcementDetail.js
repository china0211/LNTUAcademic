var app = getApp();
Page({
    data: {
        announcementDetail: ''
    },
    onLoad: function (options) {
        app.mta.Page.init()
        var that = this;
        this.setData({
            announcementDetail: app.announcementDetail
        })
    }
})