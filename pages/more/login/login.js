var app = getApp();
var util = require("../../../utils/util.js");
Page({
    data: {
        loginButtonText: '登录',
        loginButtonDisable: false,
        authorization: false,
        hasUserInfo: false,
        studentNo: null,
        userInfo: null,
        password: null
    },
    onLoad: function (options) {
        var that = this;
        if (options != undefined && !options.parseSuccess) {
            app.saveStorage("parsing", false);
        } else if (app.globalData.parsing) {
            that.setData({
                loginButtonText: '服务端获取数据中...',
                loginButtonDisable: true
            })
        }
        if (!util.isEmpty(app.globalData.userInfo)) {
            that.setData({
                userInfo: app.globalData.userInfo,
                authorization: true
            });
        }
        app.mta.Page.init();
    },
    authorizationUserInfo: function () {
        var that = this;
        that.setData({
            authorization: true
        })
    },
    inputStuId: function (e) {
        this.getUserInfo();
        this.setData({
            studentNo: e.detail.value
        })
    },
    inputPassword: function (e) {
        this.setData({
            password: e.detail.value
        })
    },
    getUserInfo: function () {
        var that = this;
        if (util.isEmpty(that.data.userInfo)) {
            wx.getUserInfo({
                success: function (resp) {
                    if (!util.isEmpty(resp.userInfo)) {
                        that.setData({
                            userInfo: resp.userInfo
                        });
                        app.globalData.userInfo = resp.userInfo;
                    }
                }
            });
        }
    },
    login: function (e) {
        var that = this;
        that.getUserInfo();
        var isValid = that.validateData();
        var formId = e.detail.formId;
        var toastMsg = '';
        var failed = true;
        var quit = false;
        if (isValid) {
            app.showLoading("正在登陆");
            wx.request({
                url: app.globalData.loginUrl,
                method: 'POST',
                header: {
                    Authorization: app.globalData.authorization
                },
                data: {
                    studentNo: that.data.studentNo,
                    password: that.data.password,
                    weChatOpenId: app.globalData.weChatOpenId,
                    nickName: app.globalData.userInfo.nickName,
                    formId: formId
                },
                success: function (res) {
                    toastMsg = "";
                    if (res.data.message == "success") {
                        //将studentNo设置为全局属性
                        app.globalData.studentNo = that.data.studentNo;
                        if (res.data.code == 200) {
                            failed = false;
                            app.getToken(true);
                        } else if (res.data.code == 202) {
                            toastMsg = "从教务在线获取数据完成后将发送通知，请耐心等待5-10分钟后再打开，确认后将退出";
                            app.saveStorage("parsing", true);
                            // 退出
                            quit = true;
                        }
                    } else {
                        toastMsg = res.data.message;
                    }
                },
                fail: function () {
                    toastMsg = "请求失败，请稍后重试";
                },
                complete: function () {
                    app.hideLoading();
                    if (quit || failed) {
                        wx.showModal({
                            title: '操作完成',
                            content: toastMsg,
                            showCancel: false,
                            success: function (res) {
                                if (res.confirm) {
                                    // 退出
                                    if (quit) {
                                        app.saveStorage("parsing", true);
                                        app.close();
                                    }
                                }
                            }
                        });
                    } else {
                        wx.reLaunch({
                            url: '/pages/index/index'
                        });
                    }
                    app.mta.Event.stat('login', {'studentNo': that.data.studentNo})
                }
            })
        }
    },
    //校验输入信息
    validateData: function () {
        var that = this;
        that.getUserInfo();
        if (util.isEmpty(that.data.userInfo)) {
            app.showMsgModal("请授权后使用;授权请点击右上角-关于-右上角-设置，打开使用我的用户信息");
            return false;
        }

        var studentNoRegex = /^[1,2][0-9]{9}$/;
        var passwordRegex = /^[0-9A-Za-z]{1,19}$/;
        if (that.data.studentNo != "" && that.data.password != "") {
            if (studentNoRegex.test(that.data.studentNo)) {
                if (passwordRegex.test(that.data.password)) {
                    return true;
                } else {
                    app.showToast("密码格式错误", false);
                    return false;
                }
            } else {
                app.showToast("学号格式错误", false);
                return false;
            }
        } else {
            app.showToast("请输入学号密码", false);
            return false;
        }
    }
});