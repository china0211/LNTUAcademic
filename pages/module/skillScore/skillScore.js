var app = getApp();
Page({
    data: {
        skillScores: []
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
            url: app.globalData.skillInfoUrl,
            data: {},
            method: 'GET',
            header: {
                Authorization: app.globalData.authorization,
                username: app.globalData.stuId
            },
            success: function (res) {
                if (res.data.message == "请求成功") {
                    failed = false;
                    navigateBack = false;
                    that.setData({
                        skillScores: res.data.info
                    })
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
    }
})