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