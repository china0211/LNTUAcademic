//app.js
var properties = require("/utils/configProperties.js")
App({
    onLaunch: function() {

    },
    getUserInfo: function(cb) {
        var that = this;
        if (this.globalData.userInfo) {
            typeof cb == "function" && cb(this.globalData.userInfo)
        } else {
            //调用登录接口
            wx.login({
                success: function() {
                    wx.getUserInfo({
                        success: function(res) {
                            that.globalData.userInfo = res.userInfo;
                            typeof cb == "function" && cb(that.globalData.userInfo)
                        }
                    })
                }
            });
        }
    },
    globalData: {
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
        bindStuIdWithWeChatIdUrl: properties.bindStuIdWithWeChatIdUrl,
        getLogsUrl: properties.getLogsUrl,
        feedbackUrl: properties.feedbackUrl,
        queryBindStatusUrl: properties.queryBindStatusUrl,
        isBind: false,

        toastFailImg: properties.toastFailImg
    },
    //提示信息(信息内容，是否成功提示)
    showToast: function(msg, isSuccessed) {
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
    //重定向到登录页面
    redirectToLoginPage: function() {
        wx.redirectTo({
            url: '/pages/more/login/login'
        })
    },
})