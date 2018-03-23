var app = getApp();
Page({
    data: {
        loginButtonText: '登录',
        loginButtonDisable: false,
        studentNo: '',
        userInfo: '',
        password: ''
    },
    onLoad: function (options) {
        app.mta.Page.init();
        var that = this;
        if (app.globalData.parsing) {
            that.setData({
                loginButtonText: '服务端获取数据中...',
                loginButtonDisable: true
            })
        }
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
        var quit = false;
        if (isValid) {
            app.showLoading("正在登陆");
            wx.request({
                url: app.globalData.loginUrl,
                data: {
                    studentNo: that.data.studentNo,
                    password: that.data.password,
                    weChatOpenId: app.globalData.weChatOpenId
                },
                method: 'POST',
                header: {
                    Authorization: app.globalData.authorization
                },
                success: function (res) {
                    toastMsg = "";
                    if (res.data.message == "success") {
                        //将studentNo设置为全局属性
                        app.globalData.studentNo = that.data.studentNo;
                        if (res.data.code == 200) {
                            failed = false;
                            app.getStudentInfo();
                        } else {
                            toastMsg = "首次登陆，需要较长时间从教务在线获取数据，请2-5分钟后重新打开";
                            app.saveStorage("parsing", true);
                            // 退出
                            quit = true;
                        }
                    }
                },
                fail: function () {
                    toastMsg = "请求失败，请稍后重试";
                },
                complete: function () {
                    app.hideLoading();
                    app.showMsgModal(toastMsg);
                    if (quit || failed) {
                        wx.showModal({
                            title: '提示',
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
});