var app = getApp()
Page({
    data: {
        contentLength: 0,
        // 反馈信息
        title: '',
        comments: '',
        contactInfomation: '',
        // 手机信息
        phoneModel: '',
        pixelRatio: '',
        screenWidth: '',
        screenHeight: '',
        windowWidth: '',
        windowHeight: '',
        wechatVersion: '',
        system: '',
        language: '',
        platform: '',
        sdkVersion: '',
        networkType: '',
        disabled: false,
        loading: false,
    },
    onLoad: function(options) {
        // 页面初始化 options为页面跳转所带来的参数
    },
    inputFeedbackTitle: function(e) {
        this.setData({
            title: e.detail.value
        })
    },
    inputFeedbackContent: function(e) {
        this.setData({
            comments: e.detail.value,
            contentLength: e.detail.value.length
        })
    },
    inputCotactInfomation: function(e) {
        this.setData({
            contactInfomation: e.detail.value
        })
    },
    // 获取手机信息
    getSystemInfo: function() {
        var that = this;
        wx.getSystemInfo({
                success: function(res) {
                    that.setData({
                        phoneModel: res.model,
                        pixelRatio: res.pixelRatio,
                        screenWidth: res.screenWidth,
                        screenHeight: res.screenHeight,
                        windowWidth: res.windowWidth,
                        windowHeight: res.windowHeight,
                        wechatVersion: res.version,
                        language: res.language,
                        system: res.system,
                        platform: res.platform,
                        sdkVersion: res.SDKVersion,
                    })
                }
            }),
            wx.getNetworkType({
                success: function(res) {
                    that.setData({
                        networkType: res.networkType
                    })
                }
            })
    },
    //校验数据
    validateData: function() {
        var result = false;
        if (this.data.title == null || this.data.title.trim() == "") {
            app.showToast("请输入反馈标题", false);
        } else if (this.data.comments == null || this.data.comments.trim() == "") {
            app.showToast("请输入反馈信息", false);
        } else {
            result = true;
        }
        return result;
    },
    // 反馈
    sendFeddback: function() {
        var that = this;
        if (that.validateData()) {
            var msg = "";
            var feedbackResult = false;
            app.showLoading();
            that.getSystemInfo();
            wx.request({
                url: app.globalData.feedbackUrl,
                data: {
                    // 用户信息
                    stuId: app.globalData.stuId,
                    wechatId: app.globalData.weChatId,
                    // 反馈信息
                    title: that.data.title,
                    comments: that.data.comments,
                    contactInfomation: that.data.contactInfomation,
                    // 手机信息
                    phoneModel: that.data.phoneModel,
                    pixelRatio: that.data.pixelRatio,
                    screenWidth: that.data.screenWidth,
                    screenHeight: that.data.screenHeight,
                    windowWidth: that.data.windowWidth,
                    windowHeight: that.data.windowHeight,
                    wechatVersion: that.data.wechatVersion,
                    language: that.data.language,
                    system: that.data.system,
                    platform: that.data.platform,
                    sdkVersion: that.data.sdkVersion,
                    //网络信息
                    networkType: that.data.networkType
                },
                method: 'POST',
                // header: {}, // 设置请求的 header
                success: function(res) {
                    console.log(res);
                    if (res.data == "success") {
                        feedbackResult = true;
                        msg = "反馈成功";
                    } else {
                        msg = "反馈失败，请稍后重试";
                    }
                },
                fail: function(res) {
                    msg = "请求失败，请稍后重试";
                },
                complete: function(res) {
                    app.hideLoading();
                    app.showToast(msg, feedbackResult);
                    app.navigateBack();
                }
            })
        }
    }
})