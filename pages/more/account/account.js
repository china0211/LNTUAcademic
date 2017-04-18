var app = getApp();
var util = require('../../../utils/util.js')
Page({
    data: {
        stuDetail: null,
        stuId: '',
        weChatId: app.globalData.weChatId,
        bindingTime: '',
        isBind: null,
        disabled: false,
        loading: false,
    },
    onLoad: function (options) {
        wx.showNavigationBarLoading();
        var that = this;
        //读取本地保存的用户信息
        wx.getStorage({
            key: 'isBind',
            success: function (res) {
                that.setData({
                    isBind: res
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
        wx.getStorage({
            key: 'stuDetail',
            success: function (response) {
                console.log(response)
                that.setData({
                    stuDetail: response,
                    stuId: response.data.userId,
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
        wx.navigateBack({
            delta: 1
        })
    },
    //绑定微信账号
    bindStuIdWithWeChatId: function () {
        var that = this;
        var msg = "";
        var isSuccessed = false;
        wx.showModal({
            title: '绑定微信账号',
            content: '是否将学号和该微信账号绑定，若已有其他绑定关系将会被解除',
            success: function (res) {
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
                        success: function (response) {
                            if (response.data == "success") {
                                msg = "绑定成功";
                                isSuccessed = true;
                                app.globalData.isBind = true
                            } else {
                                msg = "绑定失败，请稍后重试";
                            }
                        },
                        fail: function () {
                            msg = "请求失败，请稍后重试";
                        },
                        complete: function () {
                            app.showToast(msg, isSuccessed);
                        }
                    })
                }
            }
        })
    },
    //解除绑定
    unboundAccount: function () {
        var that = this;
        var msg = "";
        var isSuccessed = false;

        wx.showModal({
            title: '解除绑定',
            content: '是否确定要将该微信账号和学号解除绑定',
            success: function (res) {
                if (res.confirm) {
                    that.clearStorage()
                    that.loadding();
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
                                that.redirectToLoginPage();
                            } else {
                                msg = "解除绑定失败，请稍后重试";
                            }
                        },
                        fail: function () {
                            msg = "请求失败，请稍后重试";
                        },
                        complete: function () {
                            app.showToast(msg, isSuccessed);
                            that.loadding();
                        }
                    })
                }
            },
        })
    },
    switchAccount: function () {
        var that = this;
        var msg = "";
        var isSuccessed = false;
        wx.showModal({
            title: '切换账号',
            content: '是否确定要切换账号',
            success: function (res) {
                if (res.confirm) {
                    that.redirectToLoginPage();
                }
            }
        })
    },
    redirectToLoginPage: function () {
        wx.redirectTo({
            url: '/pages/more/login/login'
        })
    },
    clearStorage: function () {
        try {
            wx.clearStorageSync()
        } catch (e) {
            console.log("清除缓存失败")
        }
    }
})