var app = getApp();
Page({
    data: {
        exams: []
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
            url: app.globalData.examPlanUrl.concat(app.globalData.studentNo),
            method: 'GET',
            header: {
                Authorization: app.globalData.authorization,
                username: app.globalData.studentNo
            },
            success: function (res) {
                if (res.data.message == "success") {
                    failed = false;
                    navigateBack = false;
                    that.handlerData(res.data.result);
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
    handlerData: function (examData) {
        var that = this;
        if (examData != undefined) {
            for (var i = 0; i < examData.length; i++) {
                if (examData[i].remainDays == 999) {
                    examData[i].remainDays = "已结束";
                    examData[i].color = "gray";
                } else if (examData[i].remainDays >= 0 && examData[i].remainDays <= 3) {
                    examData[i].color = "red";
                } else if (examData[i].remainDays > 3 && examData[i].remainDays <= 7) {
                    examData[i].color = "orange";
                } else {
                    examData[i].color = "green";
                }
            }
            that.setData({
                exams: examData
            })
        }
    }
});