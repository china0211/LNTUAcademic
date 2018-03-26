var app = getApp();
var util = require("../../../utils/util.js");
Page({
    data: {
        gradeExams: null,
        loading: true,
        noData: false
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
                    if(util.isEmpty(res.data.result)) {
                        that.setData({
                            noData: true
                        })
                    }else{
                        //处理等级考试数据
                        that.handlerData(res.data.result);
                        that.setData({
                            noData: false
                        })
                    }
                } else {
                    that.setData({
                        noData: true
                    });
                    toastMsg = "查询失败，请稍后重试";
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
                }
                if (navigateBack) {
                    app.navigateBack();
                }
            }
        })
    },
    handlerData: function (gradeExams) {
        var that = this;
        if (gradeExams != undefined) {
            for (var i = 0; i < gradeExams.length; i++) {
                if (gradeExams[i].score == "未出") {
                    gradeExams[i].color = "gray";
                } else if (gradeExams[i].score < 425) {
                    gradeExams[i].color = "red";
                } else {
                    gradeExams[i].color = "green";
                }
            }
            that.setData({
                gradeExams: gradeExams
            })
        }
    }
})