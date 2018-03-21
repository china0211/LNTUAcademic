var app = getApp();
var util = require("../../../utils/util.js");
Page({
    data: {
        skillScores: null
    },
    onLoad: function (options) {
        app.mta.Page.init();
        app.validateStuId();
        var that = this;
        var toastMsg = '';
        var failed = true;
        var navigateBack = true;
        app.showLoading();
        wx.request({
            url: app.globalData.gradeExamScoreUrl.concat(app.globalData.studentNo),
            method: 'GET',
            header: {
                Authorization: app.globalData.authorization,
                username: app.globalData.studentNo
            },
            success: function (res) {
                if (res.data.message == "success") {
                    failed = false;
                    navigateBack = false;
                    //处理等级考试数据
                    that.setData({
                        skillScores: res.data.result
                    })
                    // that.handleSkillScoreData(res.data.info);
                } else {
                    toastMsg = "查询失败，请稍后重试";
                }
            },
            fail: function (res) {
                toastMsg = "请求失败，请稍后重试";
            },
            complete: function (res) {
                app.hideLoading();
                if (failed) {
                    app.showToast(toastMsg, false);
                }
                if (navigateBack) {
                    app.navigateBack();
                }
            }
        })
    },
    handleSkillScoreData: function (skillScoreData) {
        var that = this;
        var skillScoreArray = [];

        //将Object转换为Array
        for (var key in skillScoreData) {
            //key是属性,object[key]是值
            skillScoreData[key].timestamp = util.formatDataToTimestamp(skillScoreData[key].date);
            skillScoreArray.push(skillScoreData[key]);
        }
        //排序
        skillScoreArray.sort(function (a, b) {
            return a.timestamp - b.timestamp;
        });
        that.setData({
            skillScores: skillScoreArray
        })
    }
})