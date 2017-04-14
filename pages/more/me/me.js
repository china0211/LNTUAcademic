var app = getApp()
Page({
    data: {
        stuDetail: null,
        userInfo: null,
        isReadStorage: true,
        isBind: false
    },
    onLoad: function(options) {
        var that = this

        //读取本地保存的用户信息
        wx.getStorage({
            key: 'stuDetail',
            success: function(res) {
                that.setData({
                    stuDetail: res,
                    userInfo: app.globalData.userInfo,
                    isBind: app.globalData.isBind
                })
            },
            fail: function(res) {
                that.setData({
                    isReadStorage: false
                })
                app.showToast("读取用户信息失败，请重新登录", false)
                that.navigateToLoginPage()
            },
        })
    },
    navigateToLoginPage() {
        setTimeout(function() {
            wx.navigateTo({
                url: '/pages/more/login/login'
            })
        }, 1500)
    },
    //绑定微信账号
    bindStuIdWithWeChatId: function() {
        var that = this;
        var msg = "";
        var isSuccessed = false;
        wx.showModal({
            title: '绑定微信账号',
            content: '是否将学号和该微信账号绑定，若已有其他绑定关系将会被解除',
            success: function(res) {
                if (res.confirm) {
                    wx.request({
                        url: app.globalData.bindStuIdWithWeChatIdUrl,
                        data: {
                            stuId: app.globalData.stuId,
                            weChatId: app.globalData.weChatId
                        },
                        method: 'POST',
                        header: {
                            Authorization: app.globalData.authorization,
                        },
                        success: function(response) {
                            if (response.data == "success") {
                                msg = "绑定成功";
                                isSuccessed = true;
                                app.globalData.isBind = true

                            } else {
                                msg = "绑定失败，请稍后重试";
                            }
                        },
                        fail: function() {
                            msg = "请求失败，请稍后重试";
                        },
                        complete: function() {
                            app.showToast(msg, isSuccessed);
                        }
                    })
                }
            }
        })
    },
    navigateToAccountPage: function() {
        wx.navigateTo({
            url: '/pages/more/account/account'
        })
    },
    navigateToFeedbackPage: function() {
        wx.navigateTo({
            url: '/pages/more/feedback/feedback'
        })
    },
    navigateToAboutPage: function() {
        wx.navigateTo({
            url: '/pages/more/about/about'
        })
    }
})