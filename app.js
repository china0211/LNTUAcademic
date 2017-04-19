//app.js
var properties = require("/utils/configProperties.js")
App({
    onLaunch: function () {
        var that = this;
        var code = null;
        that.getOpenId();
    },
    getUserInfo: function (cb) {
        var that = this;
        if (this.globalData.userInfo) {
            typeof cb == "function" && cb(this.globalData.userInfo)
        } else {
            //调用登录接口
            wx.login({
                success: function () {
                    wx.getUserInfo({
                        success: function (res) {
                            typeof cb == "function" && cb(that.globalData.userInfo)
                        }
                    })
                }
            });
        }
    },
    globalData: {
        appid: properties.appid,
        secret: properties.secret,
        userInfo: null,
        stuId: '',
        weChatId: '',
        stuDetail: null,
        authorization: properties.authorization,
        academicUrl: properties.academicUrl,
        loginUrl: properties.loginUrl,
        studentInfoUrl: properties.studentInfoUrl,
        examUrl: properties.examUrl,
        scheduleUrl: properties.scheduleUrl,
        skillInfoUrl: properties.skillInfoUrl,
        queryAchievementUrl: properties.queryAchievementUrl,
        queryGradePointUrl: properties.queryGradePointUrl,
        bindStuIdWithWeChatIdUrl: properties.bindStuIdWithWeChatIdUrl,
        removeBoundUrl: properties.removeBoundUrl,
        getLogsUrl: properties.getLogsUrl,
        feedbackUrl: properties.feedbackUrl,
        queryBindStatusUrl: properties.queryBindStatusUrl,
        isBind: false,

        toastFailImg: properties.toastFailImg
    },
    //获取openid
    getOpenId: function () {
        var that = this
        wx.login({
            success: function (res) {
                if (res.code) {
                    wx.request({
                        url: 'https://api.weixin.qq.com/sns/jscode2session?appid=' + that.globalData.appid + '&secret=' + that.globalData.secret + '&grant_type=authorization_code&js_code=' + res.code,
                        data: {},
                        method: 'GET',
                        header: {},
                        success: function (res) {
                            that.globalData.weChatId = res.data.openid
                        },
                        fail: function (res) {
                            that.showToast("获取授权信息失败，请重新打开应用", false)
                        },
                        complete: function (res) {
                            // complete
                        }
                    })
                }
                wx.getUserInfo({
                    success: function (res) {
                        that.globalData.userInfo = res.userInfo
                    }
                })
            },
            fail: function (res) {
                that.showToast("获取授权信息失败，请重新打开应用", false)
            },
            complete: function (res) {
            }
        })
    },
    //提示信息(信息内容，是否成功提示)
    showToast: function (msg, isSuccessed) {
        var that = this;
        if (isSuccessed) {
            wx.showToast({
                title: msg,
                duration: 1500
            });
        } else {
            wx.showToast({
                title: msg,
                image: that.globalData.toastFailImg,
                duration: 1500
            });
        }
    },
    //显示加载loadding
    showLoading: function (title, ifShowMask) {
        wx.showLoading({
            title: title || '加载中',
            mask: ifShowMask || true,
            duration: 10000
        })
    },
    //显示错误提醒信息
    showMsgModal: function (msg) {
        wx.showModal({
            showCancel: false,
            content: msg || "未知错误"
        })
    },
    //隐藏加载loadding
    hideLoading: function () {
        wx.hideLoading();
    },
    //页面跳转
    navigateToPage(path) {
        wx.navigateTo({ url: path })
    },
    //页面重定向
    redirectToPage(path) {
        wx.redirectTo({
            url: path
        })
    },
    //重定向到登录页面
    redirectToLoginPage: function () {
        wx.redirectTo({
            url: '/pages/more/login/login'
        })
    },
    //返回前一个页面
    navigateBack: function () {
        setTimeout(function () {
            wx.navigateBack({
                delta: 1
            })
        }, 1500)
    },
    //保存缓存
    saveStorage: function (key, value) {
        wx.setStorage({
            key: key || '',
            data: value || ''
        })
    },
    //清除缓存
    clearStorage: function () {
        try {
            wx.clearStorageSync()
        } catch (e) {
            console.log("清除缓存失败")
        }
    }
})