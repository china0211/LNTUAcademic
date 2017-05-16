var app = getApp();
var util = require("../../../../utils/util.js");
Page({
    data: {
        stuId: null,
        academicYears: ['2013年秋', '2014年春', '2014年秋', '2015年春', '2015年秋', '2016年春', '2016年秋', '2017年春'],
        selectedAcademicYear: '请选择学年学期'
    },
    onLoad: function(options) {
        app.mta.Page.init();
        app.validateStuId();
        var that = this;
        that.setStuId()
    },
    //选择学年学期
    chooseAcademicYear: function(e) {
        var that = this;
        that.setData({
            selectedAcademicYear: that.data.academicYears[e.detail.value]
        })
    },
    //获取学号
    setStuId: function() {
        var that = this;
        if (util.isStuIdValid(app.globalData.stuId)) {
            that.setData({
                stuId: app.globalData.stuId
            })
        } else {
            wx.getStorage({
                key: 'stuId',
                success: function(response) {
                    that.setData({
                        stuId: response.data
                    })
                },
                fail: function(res) {
                    app.showToast("获取用户信息失败，请重新登录", false);
                    app.redirectToLoginPage();
                }
            })
        }
    },
    //查询成绩
    queryExamScore: function(e) {
        var that = this;
        var queryType = null;
        var academicyear = null;
        if (e.currentTarget.dataset.type == "NOT_PASSED") {
            queryType = "NOT_PASSED";
            academicyear = "NOT_PASSED";
            app.scorePageTitle = "未通过课程";
        } else {
            queryType = "EXAM_SCORE";
            academicyear = that.data.selectedAcademicYear;
            app.scorePageTitle = academicyear;
        }
        if (academicyear != null && academicyear != "请选择学年学期") {
            var toastMsg = '';
            var failed = true;
            app.showLoading('正在查询', true);
            wx.request({
                url: app.globalData.queryAchievementUrl,
                data: {
                    academicYear: academicyear,
                    queryType: queryType,
                    stuId: that.data.stuId
                },
                method: 'GET',
                // header: {
                //     Authorization: app.globalData.wxGlobalToken,
                //     username: that.data.stuId
                // },
                header: {
                  Authorization: app.globalData.authorization,
                  username: app.globalData.stuId
                },
                success: function(res) {
                    // if (res.data.status == "success") {
                  if (res.data.message == "请求成功") {
                        failed = false;
                        // app.examScores = res.data.result;
                        app.examScores = res.data.info;
                        app.navigateToPage("/pages/module/exam/examScore/examScore")
                    } else {
                        toastMsg = "查询失败，请稍后重试";
                    }
                },
                fail: function(res) {
                    toastMsg = "请求失败，请稍后重试";
                },
                complete: function(res) {
                    app.hideLoading();
                    if (failed) {
                        app.showToast(toastMsg, false)
                    }
                }
            })
        } else {
            app.showMsgModal("请选择学年学期");
        }
    },
    //查询绩点
    queryGradePoint: function() {
        var that = this;
        var toastMsg = '';
        var failed = true;
        app.showLoading('正在查询', true);
        wx.request({
            url: app.globalData.queryGradePointUrl,
            data: {
                stuId: that.data.stuId
            },
            method: 'GET',
            header: {
                Authorization: app.globalData.wxGlobalToken,
                username: that.data.stuId
            },
            success: function(res) {
                if (res.data.status == "success") {
                    failed = false;
                    app.showMsgModal('你当前的学分绩为:' + res.data.result)
                } else {
                    toastMsg = "查询失败，请稍后重试";
                }
            },
            fail: function(res) {
                toastMsg = "请求失败，请稍后重试";
            },
            complete: function(res) {
                app.hideLoading();
                if (failed) {
                    app.showToast(toastMsg, false)
                }
            }
        })
    }
})