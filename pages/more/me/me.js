var app = getApp()
Page({
    data: {
        stuDetail: null,
        userInfo: null,
        isReadStorage: true,
        isBind:false
    },
    onLoad: function (options) {
        var that = this

        //读取本地保存的用户信息
        wx.getStorage({
            key: 'stuDetail',
            success: function (res) {
                that.setData({
                    stuDetail: res,
                    userInfo: app.globalData.userInfo,
                    isBind:app.globalData.isBind
                })
            },
            fail: function (res) {
                that.setData({
                    isReadStorage: false
                })
                app.showToast("读取用户信息失败，请重新登录", false)
                that.navigateToLoginPage()
            },
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
    navigateToLoginPage() {
        setTimeout(function () {
            wx.navigateTo({
                url: '../login/login'
            })
        }, 1500)
    },
    navigateToAccountPage: function () {
        wx.navigateTo({
            url: '../account/account'
        })
    },
    navigateToFeedbackPage: function () {
        wx.navigateTo({
            url: '../feedback/feedback'
        })
    },
    navigateToAboutPage: function () {
        wx.navigateTo({
            url: '../about/about'
        })
    }
})