var app = getApp();
var util = require('../../../utils/util.js');
Page({
    data: {
        stuDetail: null,
        studentNo: '',
        userInfo: null,
        bindTime: '',
        isBind: null
    },
    onLoad: function (options) {
        app.mta.Page.init();
        var that = this;
        that.setData({
            userInfo: app.globalData.userInfo
        })
        //读取本地保存的用户信息
        wx.getStorage({
            key: 'isBind',
            success: function (res) {
                that.setData({
                    isBind: res.data
                })
            }
        })
        wx.getStorage({
            key: 'stuDetail',
            success: function (response) {
                that.setData({
                    stuDetail: response.data,
                    studentNo: response.data.studentNo,
                })
                //查询绑定信息
                wx.request({
                    url: app.globalData.bindUrl,
                    data: {
                        studentNo: app.globalData.studentNo,
                        weChatOpenId: app.globalData.weChatOpenId
                    },
                    method: 'GET',
                    header: {
                        Authorization: app.globalData.wxGlobalToken
                    },
                    success: function (res) {
                        if (res.data.message == "success") {
                            that.setData({
                                bindTime: res.data.result.bindTime
                            });
                            that.modifyBindStatus(true);
                        } else {
                            that.modifyBindStatus(false);
                            that.bindStuIdWithWeChatId();
                        }
                    },
                    fail: function (res) {
                        app.showToast("请求失败，请稍后重试", false);
                        app.navigateBack();
                    },
                })
            },
            fail: function (response) {
                app.showToast("用户信息已过期，请重新登录", false)
                app.redirectToLoginPage()
            },
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
                    app.showLoading();
                    wx.request({
                        url: app.globalData.bindUrl,
                        data: {
                            studentNo: app.globalData.studentNo,
                            weChatOpenId: app.globalData.weChatOpenId
                        },
                        method: 'POST',
                        header: {
                            Authorization: app.globalData.wxGlobalToken
                        },
                        success: function (response) {
                            if (response.data.message == "success") {
                                msg = "绑定成功";
                                isSuccessed = true;
                                that.modifyBindStatus(true);
                            } else {
                                msg = "绑定失败，请稍后重试";
                            }
                        },
                        fail: function () {
                            msg = "请求失败，请稍后重试";
                        },
                        complete: function () {
                            app.hideLoading();
                            app.showToast(msg, isSuccessed);
                            app.mta.Event.stat('account', {'operation': 'bind'});
                        }
                    })
                } else {
                    that.modifyBindStatus(false);
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
                    app.showLoading();
                    // app.clearStorage()
                    app.globalData.isBind = false;
                    app.saveStorage("isBind", false);
                    wx.request({
                        url: app.globalData.unBindUrl,
                        data: {
                            studentNo: app.globalData.studentNo,
                            weChatOpenId: app.globalData.weChatOpenId
                        },
                        method: 'DELETE',
                        header: {
                            Authorization: app.globalData.wxGlobalToken
                        },
                        success: function (response) {
                            if (response.data.message == "success") {
                                msg = "已成功解除绑定";
                                isSuccessed = true;
                                app.redirectToLoginPage()
                            } else {
                                msg = "解除绑定失败，请稍后重试";
                            }
                        },
                        fail: function () {
                            msg = "请求失败，请稍后重试";
                        },
                        complete: function () {
                            app.hideLoading();
                            app.showToast(msg, isSuccessed);
                            app.navigateBack();
                            app.mta.Event.stat('account', {'operation': 'unbind'});
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
                    app.redirectToLoginPage(true)
                }
            },
            complete: function () {
                app.mta.Event.stat('account', {'operation': 'switch'});
            }
        })
    },
    //修改绑定状态
    modifyBindStatus: function (status) {
        var that = this;
        that.setData({
            isBind: status
        })
        app.saveStorage("isBind", status);
        app.globalData.isBind = status;
    }
})