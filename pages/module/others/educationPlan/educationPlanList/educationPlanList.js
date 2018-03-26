var app = getApp();
var util = require("../../../../../utils/util.js");
Page({
    data: {
        educationPlanYears: ["第一学年秋季学期", "第一学年春季学期",
            "第二学年秋季学期", "第二学年春季学期",
            "第三学年秋季学期", "第三学年春季学期",
            "第四学年秋季学期", "第四学年春季学期"
        ],
        selectedEducationPlanYear: '请选择学年学期',
        educationPlans: '',
        studentNo: '',
        loading: true,
        noData: false
    },
    onLoad: function (options) {
        var that = this;
        app.mta.Page.init();
        that.queryEducationPlan();
    },
    onReady: function () {
        // 页面渲染完成
    },
    onShow: function () {
        // 页面显示
    },
    onHide: function () {
        // 页面隐藏
    },
    onUnload: function () {
        // 页面关闭
    },
    //选择学年学期
    chooseEducationPlanYear: function (e) {
        var that = this;
        that.setData({
            selectedEducationPlanYear: that.data.educationPlanYears[e.detail.value]
        })
    },
    //查询教学计划
    queryEducationPlan: function (e) {
        var that = this;
        var selectedEducationPlanYear = that.data.selectedEducationPlanYear;

        // if (selectedEducationPlanYear != null && selectedEducationPlanYear != "请选择学年学期") {
        var toastMsg = '';
        var failed = true;
        app.showLoading('正在查询', true);
        wx.request({
            url: app.globalData.courseStudyScheduleUrl.concat(app.globalData.studentNo),
            data: {
                educationPlanYear: selectedEducationPlanYear
            },
            method: 'GET',
            header: {
                Authorization: app.globalData.authorization
            },
            success: function (res) {
                if (res.data.message == "success") {
                    failed = false;
                    if(util.isEmpty(res.data.result)) {
                        that.setData({
                            noData: true
                        })
                    }else{
                        that.setData({
                            noData: false,
                            educationPlans: res.data.result
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
                    app.showToast(toastMsg, false)
                }
            }
        })
        // } else {
        //   app.showMsgModal("请选择学年学期");
        // }
    },
    viewEducationPlanDetail: function (e) {
        app.currentCourse = e.currentTarget.dataset.examscore;
        app.navigateToPage("/pages/module/others/educationPlan/educationPlanDetail/educationPlanDetail")
    }
})