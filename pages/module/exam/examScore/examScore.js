var app = getApp();
var mta = require('../../../../common/lib/mta.js');
Page({
    data: {
        hasResult: false,
        examScores: [],
        promptMsg: '未查询到结果'
    },
    onLoad: function(options) {
        mta.Page.init();
        var that = this;
        if (app.examScores != "NO_RESULT") {
            that.setData({
                hasResult: true,
                examScores: app.examScores
            })
        } else {
            app.scorePageTitle = that.data.promptMsg;
        }
        wx.setNavigationBarTitle({
            title: app.scorePageTitle
        })
    },
    //查看成绩详情
    viewExamScoreDetail: function(e) {
        app.currentExamScore = e.currentTarget.dataset.examscore;
        app.navigateToPage("/pages/module/exam/examScoreDetail/examScoreDetail")
    }
})