var app = getApp();
var mta = require('../../../../common/lib/mta.js');
Page({
    data: {
        announcementDetail: ''
    },
    onLoad: function(options) {
        mta.Page.init()
        var that = this;
        this.setData({
            announcementDetail: app.announcementDetail
        })
    }
})