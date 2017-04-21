var app = getApp();
Page({
    data: {
        announcementDetail: ''
    },
    onLoad: function(options) {
        var that = this;
        this.setData({
            announcementDetail: app.announcementDetail
        })
    }
})