//app.js
var properties = require("/utils/configProperties.js")
App({
    onLaunch: function() {
        //调用API从本地缓存中获取数据
        var logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)
        console.log(wx.getSystemInfoSync())
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
        weChatId:'',
        stuDetail: null,
        authorization: properties.authorization,
        academicUrl: properties.academicUrl,
        loginUrl: properties.loginUrl,
        studentInfoUrl: properties.studentInfoUrl,
        examUrl: properties.examUrl,
        scheduleUrl: properties.scheduleUrl,
        skillInfoUrl: properties.skillInfoUrl,
        bindStuIdWithWeChatIdUrl: properties.bindStuIdWithWeChatIdUrl,

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
    }
})