var app = getApp();
var util = require("../../../../utils/util.js");
Page({
    data: {
        stuId: app.globalData.stuId,
        academicYears: ['2014秋', '2015春', '2015秋', '2016春', '2016秋', '2017春', '2017秋'],
        selectedYearAndSeason: '请选择学年学期'
    },
    onLoad: function (options) {
        app.mta.Page.init();
        app.validateStuId();
        // var that = this;
        // that.setStuId()
    },
    //选择学年学期
    chooseAcademicYear: function (e) {
        var that = this;
        that.setData({
            selectedYearAndSeason: that.data.academicYears[e.detail.value]
        })
    },
    //获取学号
    // setStuId: function () {
    //   var that = this;
    //   if (util.isStuIdValid(app.globalData.stuId)) {
    //     that.setData({
    //       stuId: app.globalData.stuId
    //     })
    //   } else {
    //     wx.getStorage({
    //       key: 'stuId',
    //       success: function (response) {
    //         that.setData({
    //           stuId: response.data
    //         })
    //       },
    //       fail: function (res) {
    //         app.showToast("获取用户信息失败，请重新登录", false);
    //         app.redirectToLoginPage();
    //       }
    //     })
    //   }
    // },
    //查询成绩
    queryExamScore: function (e) {
        var that = this;
        var queryType = null;
        var yearAndSeason = that.data.selectedYearAndSeason;
        if (e.currentTarget.dataset.type == "NOT_PASSED") {
            queryType = "NOT_PASSED";
            app.scorePageTitle = "未通过课程";
        } else {
            queryType = "EXAM_SCORE";
            app.scorePageTitle = yearAndSeason;
        }
        if (yearAndSeason != null && yearAndSeason != "请选择学年学期") {
            var toastMsg = '';
            var failed = true;
            app.showLoading('正在查询', true);
            wx.request({
                url: app.globalData.examUrl.concat(app.globalData.stuId),
                data: {
                    yearAndSeason: yearAndSeason,
                    queryType: queryType
                },
                method: 'GET',
                header: {
                    Authorization: app.globalData.wxGlobalToken,
                    username: that.data.stuId
                },
                success: function (res) {
                    if (res.data.message == "success") {
                        failed = false;
                        //处理数据，显示所选学年成绩
                        app.examScores = res.data.result;
                        // app.examScores = that.handlerData(res.data.info);
                        app.navigateToPage("/pages/module/exam/examScore/examScore")
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
                        app.showToast(toastMsg, false)
                    }

                    //统计查询事件
                    app.mta.Event.stat('exam_score', {'year': that.data.selectedYearAndSeason});
                    app.mta.Event.stat('exam_score', {'querytype': queryType});
                }
            })
        } else {
            app.showMsgModal("请选择学年学期");
        }
    },
    //查询绩点
    queryGradePoint: function () {
        var that = this;
        var toastMsg = '';
        var failed = true;
        app.showLoading('正在查询', true);
        wx.request({
            url: app.globalData.gradePointUrl,
            data: {
                stuId: that.data.stuId
            },
            method: 'GET',
            header: {
                Authorization: app.globalData.wxGlobalToken,
                username: that.data.stuId
            },
            success: function (res) {
                if (res.data.message == "success") {
                    failed = false;
                    app.showMsgModal('你当前的学分绩为:' + res.data.result)
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
                    app.showToast(toastMsg, false)
                }

                //MTA统计事件
                app.mta.Event.stat('exam_score', {'querytype': 'credit'});
            }
        })
    },
    handlerData: function (allExamScores) {

        var that = this;
        var selectedExamScore = [];
        var allExamScoresArray = [];

        //将Object转换为Array
        for (var key in allExamScores) {
            //key是属性,object[key]是值
            allExamScoresArray.push(allExamScores[key]);
        }

        var selectedYearAndSeason = that.data.selectedYearAndSeason;

        for (var i = 0; i < allExamScoresArray.length; i++) {
            var currentExamScore = allExamScores[i];

            //显示所选的学年学期的成绩
            if (currentExamScore.yearAndSeason == that.data.selectedYearAndSeason) {

                //判断是否通过
                if (currentExamScore.score < 60 || currentExamScore.score == "不合格") {
                    currentExamScore.isPassed = false;
                } else {
                    currentExamScore.isPassed = true;
                }
                selectedExamScore.push(currentExamScore);
            }
        }
        return selectedExamScore;
    }
})