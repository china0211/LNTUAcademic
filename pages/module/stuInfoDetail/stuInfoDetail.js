var app = getApp();
var util = require("../../../utils/util.js");
Page({
    data: {
        stuDetail: null,
        loading: true,
        noData: false
    },
    onLoad: function (options) {
        app.mta.Page.init();
        var that = this;
        wx.getStorage({
            key: 'stuDetail',
            success: function (res) {
                if (util.isEmpty(res.data)) {
                    that.setData({
                        noData: true
                    })
                } else {
                    that.setData({
                        noData: false,
                        stuDetail: res.data
                    })
                }
            },
            fail: function (res) {
                app.showToast("读取用户信息失败，请重新登录", false);
                app.redirectToLoginPage();
            },
            complete: function (res) {
                that.setData({
                    loading: false
                });
            }
        });
    }
})