var app = getApp()
var user = app.globalData.user;
Page({
    data: {
        stuId: '',
        userInfo: '',
        password: '',
        disabled: false,
        loading: false,
    },
    onLoad: function(options) {
        var that = this
        app.getUserInfo(function(userInfo) {
            that.setData({
                userInfo: userInfo
            })
        })
    },
    logging: function(e) {
        this.setData({
            disabled: !this.data.disabled,
            loading: !this.data.loading
        })
    },

    inputStuId: function(e) {
        this.setData({
            stuId: e.detail.value
        })
    },
    inputPassword: function(e) {
        this.setData({
            password: e.detail.value
        })
    },

    login: function() {
        var that = this;
        var isValid = that.validateInput();
        if (isValid) {
            that.logging();
            wx.request({
                url: app.globalData.loginUrl,
                data: {
                    userId: that.data.stuId,
                    password: that.data.password
                },
                method: 'GET',
                header: {
                    Authorization: app.globalData.authorization
                },
                success: function(res) {
                    if (res.data.message == "请求成功") {
                        //将stuId设置为全局属性
                        app.globalData.stuId = that.data.stuId

                        that.queryAllInfo();
                        that.bindStuIdWithWeChatId();
                        //将数据保存到本地，方便下次使用读取
                        wx.setStorage({
                            key: "stuId",
                            data: that.data.stuId
                        })

                        app.globalData.isBind = true
                    } else {
                        app.showToast("登录失败，学号或密码错误", false);
                    }
                },
                fail: function() {
                    app.showToast("请求失败，请稍后重试", false);
                },
                complete: function() {
                    that.logging();
                }
            })
        }
    },

    //绑定微信账号
    bindStuIdWithWeChatId: function() {
        var that = this;
        var msg = "";
        var isSuccessed = false;
        wx.showModal({
            title: '绑定微信账号',
            content: '是否将学号和微信账号绑定，绑定后可以直接通过微信账号登录',
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
                            that.navigateToIndexPage(msg, isSuccessed);
                        }
                    })
                } else {
                    that.navigateToIndexPage();
                }
            }
        })
    },

    // 查询
    queryAllInfo: function() {
        var that = this;
        wx.request({
            url: app.globalData.studentInfoUrl,
            method: 'GET',
            header: {
                Authorization: app.globalData.authorization,
                username: app.globalData.stuId
            },
            success: function(res) {
                if (res.data.message == "请求成功") {
                    app.globalData.stuDetail = res.data.info.baseInfo
                    wx.setStorage({
                        key: 'stuDetail',
                        data: res.data.info.baseInfo,
                        fail: function(res) {
                            app.showToast("获取用户信息失败", false)
                        }
                    })
                }
            },
            fail: function(res) {
                app.showToast("获取用户信息失败", false)
            }
        })
    },

    //跳转到首页
    navigateToIndexPage: function(msg, isSuccessed) {
        wx.navigateBack({
            delta: 1,
            complete: function(res) {
                setTimeout(function() {
                    app.showToast(msg, isSuccessed); //跳转成功之后显示提示
                }, 500)
            }
        })
    },

    //校验输入信息
    validateInput: function() {
        var that = this;
        if (that.data.stuId != "" && that.data.password != "") {
            if (that.data.stuId.length == 10) {
                if (that.data.password.length == 6) {
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