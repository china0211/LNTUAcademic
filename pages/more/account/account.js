var app = getApp();
var util = require('../../../utils/util.js')
Page({
    data: {
        stuDetail: null,
        stuId: '',
        weChatId: app.globalData.weChatId,
        bindingTime: '',

        disabled: false,
        loading: false,
    },
    onLoad: function (options) {
        wx.showNavigationBarLoading();
        var that = this;
        //读取本地保存的用户信息
        wx.getStorage({
            key: 'stuDetail',
            success: function (response) {
                console.log(response)
                that.setData({
                    stuDetail: response,
                    stuId: response.data.userId
                })
                //查询绑定信息
                wx.request({
                    url: app.globalData.queryBindStatusUrl,
                    data: {
                        stuId: that.data.stuId
                    },
                    method: 'POST',
                    // header: {},
                    success: function (res) {
                        if (res.data != null) {
                            that.setData({
                                bindingTime: util.formatDate(new Date(res.data.bindingTime))
                            })
                        } else {
                            app.showToast("未查询到数据，请稍后重试", false);
                            that.backToMinePage();
                        }
                    },
                    fail: function (res) {
                        app.showToast("请求失败，请稍后重试", false);
                        that.backToMinePage();
                    },
                })
            },
            fail: function (response) {
                app.showToast("读取用户信息失败，请重新登录", false)
                that.redirectToLoginPage()
            },
            complete: function (res) {
                wx.hideNavigationBarLoading();
            }
        })
    },
    loadding: function (e) {
        this.setData({
            disabled: !this.data.disabled,
            loading: !this.data.loading
        })
    },
    backToMinePage: function () {
        setTimeout(function () {
            wx.navigateBack({
                delta: 1
            })
        }, 1500)
    },
    unboundAccount: function () {
        var that = this;
        var msg = "";
        var isSuccessed = false;
        that.loadding();
        wx.showModal({
            title: '解除绑定',
            content: '是否确定要将该微信账号和学号解除绑定',
            success: function (res) {
                if (res.confirm) {
                    that.clearStorage()
                    wx.request({
                        url: app.globalData.bindStuIdWithWeChatIdUrl,
                        data: {
                            stuId: app.globalData.stuId,
                            weChatId: app.globalData.weChatId
                        },
                        method: 'POST',
                        header: {},
                        success: function (response) {
                            if (response.data == "success") {
                                msg = "已成功解除绑定";
                                isSuccessed = true;
                            } else {
                                msg = "解除绑定失败，请稍后重试";
                            }
                        },
                        fail: function () {
                            msg = "请求失败，请稍后重试";
                        },
                        complete: function () {
                            app.showToast(msg, isSuccessed);
                            that.redirectToLoginPage(msg, isSuccessed);
                        }
                    })
                }
            },
            complete: function (res) {
                that.loadding();
            }
        })
    },
    switchAccount: function () {
        var that = this;
        var msg = "";
        var isSuccessed = false;
        that.loadding();
        wx.showModal({
            title: '切换账号',
            content: '是否确定要切换账号',
            success: function (res) {
                if (res.confirm) {
                    that.redirectToLoginPage();
                }
            },
            complete: function (res) {
                that.loadding();
            }
        })
    },
    redirectToLoginPage: function () {
        setTimeout(function () {
            wx.redirectTo({
                url: '/pages/more/login/login'
            })
        }, 1500)
    },
    clearStorage: function () {
        try {
            wx.clearStorageSync()
        } catch (e) {
            console.log("清除缓存失败")
        }
    }
})