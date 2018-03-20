var app = getApp();
Page({
    data: {
        examScoreDetail: null
    },
    onLoad: function (options) {
        app.mta.Page.init();
        var that = this;
        that.setData({
            examScoreDetail: app.currentExamScore
        })
        wx.setNavigationBarTitle({
            title: that.data.examScoreDetail.courseName
        })
    }
})