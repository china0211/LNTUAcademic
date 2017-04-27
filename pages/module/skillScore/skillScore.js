var app = getApp();
var mta = require('../../../common/lib/mta.js');
Page({
    data: {
        stuId: null,
        skillScores: []
    },
    onLoad: function(options) {
        mta.Page.init();
        var that = this;
        var toastMsg = '';
        var failed = true;
        var navigateBack = true;
        wx.getStorage({
            key: 'stuId',
            success: function(response) {
                that.setData({
                        stuId: response.data
                    }),
                    app.showLoading();
                wx.request({
                    url: app.globalData.skillInfoUrl,
                    data: {},
                    method: 'GET',
                    header: {
                        Authorization: app.globalData.authorization,
                        username: that.data.stuId
                    },
                    success: function(res) {
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
                    fail: function(res) {
                        toastMsg = "请求失败，请稍后重试";
                    },
                    complete: function(res) {
                        app.hideLoading();
                        app.showToast(toastMsg, !failed);
                        if (navigateBack) {
                            app.navigateBack();
                        }
                    }
                })
            },
            fail: function(res) {
                app.showToast("查询失败，请重新登录", false);
                app.redirectToLoginPage();
            }
        })
    },
})