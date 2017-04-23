var app = getApp();
var mta = require('../../../../common/lib/mta.js');
Page({
    data: {
        examScoreDetail: null
    },
    onLoad: function(options) {
        mta.Page.init();
        var that = this;
        that.setData({
            examScoreDetail: app.currentExamScore
        })
        wx.setNavigationBarTitle({
            title: that.data.examScoreDetail.courseName
        })
    }
})