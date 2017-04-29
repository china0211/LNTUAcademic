var app = getApp();
var util = require('../../../utils/util.js');
Page({
    data: {
        stuDetail: null,
        stuId: '',
        userInfo: null,
        bindingTime: '',
        isBind: null
    },
    onLoad: function(options) {
        app.mta.Page.init();
        var that = this;
        that.setData({
                userInfo: app.globalData.userInfo
            })
            //读取本地保存的用户信息
        wx.getStorage({
            key: 'isBind',
            success: function(res) {
                that.setData({
                    isBind: res.data
                })
            }
        })
        wx.getStorage({
            key: 'stuDetail',
            success: function(response) {
                that.setData({
                        stuDetail: response.data,
                        stuId: response.data.userId,
                    })
                    //查询绑定信息
                wx.request({
                    url: app.globalData.queryBindStatusUrl,
                    data: {
                        stuId: that.data.stuId
                    },
                    method: 'POST',
                    header: {
                        Authorization: app.globalData.wxGlobalToken
                    },
                    success: function(res) {
                        if (res.data != null) {
                            that.setData({
                                bindingTime: util.formatDate(new Date(res.data.bindingTime))
                            })
                        } else {
                            app.showToast("未查询到数据，请稍后重试", false);
                            app.navigateBack();
                        }
                    },
                    fail: function(res) {
                        app.showToast("请求失败，请稍后重试", false);
                        app.navigateBack();
                    },
                })
            },
            fail: function(response) {
                app.showToast("用户信息已过期，请重新登录", false)
                app.redirectToLoginPage()
            },
        })
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
                    app.showLoading();
                    wx.request({
                        url: app.globalData.bindStuIdWithWeChatIdUrl,
                        data: {
                            stuId: app.globalData.stuId,
                            weChatId: app.globalData.weChatId
                        },
                        method: 'GET',
                        header: {
                            Authorization: app.globalData.wxGlobalToken
                        },
                        success: function(response) {
                            if (response.data == "success") {
                                msg = "绑定成功";
                                isSuccessed = true;
                                app.globalData.isBind = true;
                                app.saveStorage('isBind',true);
                            } else {
                                msg = "绑定失败，请稍后重试";
                            }
                        },
                        fail: function() {
                            msg = "请求失败，请稍后重试";
                        },
                        complete: function() {
                            app.hideLoading();
                            app.showToast(msg, isSuccessed);
                            app.navigateBack();
                        }
                    })
                }
            }
        })
    },
    //解除绑定
    unboundAccount: function() {
        var that = this;
        var msg = "";
        var isSuccessed = false;
        wx.showModal({
            title: '解除绑定',
            content: '是否确定要将该微信账号和学号解除绑定',
            success: function(res) {
                if (res.confirm) {
                    app.showLoading();
                    // app.clearStorage()
                    app.globalData.isBind = false;
                    app.saveStorage("isBind",false);
                    wx.request({
                        url: app.globalData.removeBoundUrl,
                        data: {
                            stuId: app.globalData.stuId,
                            weChatId: app.globalData.weChatId
                        },
                        method: 'GET',
                        header: {
                            Authorization: app.globalData.wxGlobalToken
                        },
                        success: function(response) {
                            if (response.data == "success") {
                                msg = "已成功解除绑定";
                                isSuccessed = true;
                                app.redirectToLoginPage()
                            } else {
                                msg = "解除绑定失败，请稍后重试";
                            }
                        },
                        fail: function() {
                            msg = "请求失败，请稍后重试";
                        },
                        complete: function() {
                            app.hideLoading();
                            app.showToast(msg, isSuccessed);
                            app.navigateBack();
                        }
                    })
                }
            },
        })
    },
    switchAccount: function() {
        var that = this;
        var msg = "";
        var isSuccessed = false;
        wx.showModal({
            title: '切换账号',
            content: '是否确定要切换账号',
            success: function(res) {
                if (res.confirm) {
                    app.redirectToLoginPage()
                }
            }
        })
    }
})