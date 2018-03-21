var app = getApp();
Page({
    data: {
        studentNo: '',
        userInfo: '',
        password: ''
    },
    onLoad: function (options) {
        app.mta.Page.init();
        var that = this;
        that.setData({
            userInfo: app.globalData.userInfo
        })
    },
    inputStuId: function (e) {
        this.setData({
            studentNo: e.detail.value
        })
    },
    inputPassword: function (e) {
        this.setData({
            password: e.detail.value
        })
    },

    login: function () {
        var that = this;
        var isValid = that.validateInput();
        var toastMsg = '';
        var failed = true;
        var navigateBack = false;
        if (isValid) {
            app.showLoading("正在登陆");
            wx.request({
                url: app.globalData.loginUrl,
                data: {
                    weChatOpenId: app.globalData.weChatOpenId,
                    studentNo: that.data.studentNo,
                    password: that.data.password
                },
                method: 'POST',
                header: {
                    Authorization: app.globalData.authorization
                },
                success: function (res) {
                    if (res.data.message == "success") {
                        failed = false;
                        //将stuId设置为全局属性
                        app.globalData.studentNo = that.data.result.studentNo
                        app.queryAllstuInfo();
                        that.bindStuIdWithWeChatId();
                        //将数据保存到本地，方便下次使用读取
                        app.saveStorage("studentNo", that.data.result.studentNo);
                        app.globalData.isBind = true
                    } else {
                        toastMsg = "登录失败，学号或密码错误";
                    }
                },
                fail: function () {
                    toastMsg = "请求失败，请稍后重试";

                },
                complete: function () {
                    app.hideLoading();
                    if (failed) {
                        app.showToast(toastMsg, false);
                    }
                    app.mta.Event.stat('login', {'studentNo': that.data.studentNo})
                }
            })
        }
    },

    //绑定微信账号
    bindStuIdWithWeChatId: function () {
        var that = this;
        var toastMsg = '';
        var failed = true;
        var navigateBack = false;
        wx.showModal({
            title: '绑定微信账号',
            content: '是否将学号和微信账号绑定，绑定后可以直接通过微信账号登录',
            success: function (res) {
                if (res.confirm) {
                    app.showLoading("正在绑定");
                    wx.request({
                        url: app.globalData.bindStuIdWithWeChatIdUrl,
                        data: {
                            studentNo: app.globalData.studentNo,
                            weChatOpenId: app.globalData.weChatOpenId
                        },
                        method: 'POST',
                        header: {
                            Authorization: app.globalData.wxGlobalToken
                        },
                        success: function (response) {
                            if (response.data.status == "success") {
                                toastMsg = "绑定成功";
                                failed = false;
                                app.globalData.isBind = true;
                                app.saveStorage("isBind", true);
                            } else {
                                toastMsg = "绑定失败，请稍后重试";
                            }
                        },
                        fail: function () {
                            toastMsg = "请求失败，请稍后重试";
                        },
                        complete: function () {
                            app.hideLoading();
                            app.showToast(toastMsg, !failed);
                            app.navigateBack();
                        }
                    })
                } else {
                    app.navigateBack();
                }
            }
        })
    },

    // 查询
    queryAllInfo: function () {
        var toastMsg = '';
        var failed = true;
        var that = this;
        wx.request({
            url: app.globalData.studentInfoUrl,
            method: 'GET',
            header: {
                Authorization: app.globalData.authorization,
                username: app.globalData.studentNo
            },
            success: function (res) {
                if (res.data.message == "请求成功") {
                    failed = false;
                    app.globalData.stuDetail = res.data.info.baseInfo
                    wx.setStorage({
                        key: 'stuDetail',
                        data: res.data.info.baseInfo,
                        fail: function (res) {
                            failed = true;
                            toastMsg = "保存用户信息失败";
                        }
                    })
                } else {
                    toastMsg = "获取用户信息失败,请重新登录";
                }
            },
            fail: function (res) {
                toastMsg = "获取用户信息失败";
            },
            complete: function (res) {
                if (failed) {
                    app.showToast(toastMsg, !failed);
                }
            }
        })
    },
    //校验输入信息
    validateInput: function () {
        var that = this;
        if (that.data.studentNo != "" && that.data.password != "") {
            if (that.data.studentNo.length == 10) {
                if (that.data.password.length > 0 && that.data.password.length < 19) {
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
})