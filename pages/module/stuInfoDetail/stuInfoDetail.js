var app = getApp();
Page({
    data: {
        stuDetail: null
    },
    onLoad: function(options) {
        app.mta.Page.init();
        app.validateStuId();
        var that = this;
        wx.getStorage({
            key: 'stuDetail',
            success: function(res) {
                that.setData({
                    stuDetail: res.data
                })
            },
            fail: function(res) {
                app.showToast("读取用户信息失败，请重新登录", false);
                app.redirectToLoginPage();
            },
        })
    }
})