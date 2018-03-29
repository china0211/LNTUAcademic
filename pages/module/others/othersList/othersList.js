var app = getApp();
Page({
    data: {},
    onLoad: function (options) {
        app.mta.Page.init();
    },
    //教学评价
    evaluateClass: function () {
        var that = this;
        var successed = false;
        wx.showModal({
            title: '教学评价',
            content: '是否评价所有课程为好评',
            success: function (res) {
                if (res.confirm) {
                    var toastMsg = '';
                    app.showLoading();
                    wx.request({
                        url: app.globalData.evaluateCourseUrl,
                        data: {
                            studentNo: app.globalData.studentNo
                        },
                        method: 'GET',
                        header: {
                            Authorization: app.globalData.authorization,
                        },
                        success: function (resp) {
                            if (resp.data.result == "success") {
                                toastMsg = "评价成功";
                                successed = true;
                            } else {
                                toastMsg = "评价失败，请稍后重试";
                            }
                        },
                        fail: function (resp) {
                            toastMsg = "请求失败，请稍后重试";
                        },
                        complete: function (resp) {
                            app.hideLoading();
                            app.showToast(toastMsg, successed);
                        }
                    })
                }
            }
        })
    }
})