var app = getApp();
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
    },
    onLoad: function(options) {
        app.mta.Page.init();
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
            app.showMsgModal("请输入反馈标题");
        } else if (this.data.comments == null || this.data.comments.trim() == "") {
            app.showMsgModal("请输入反馈信息");
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
            var feedbackSuccess = false;
            app.showLoading("正在反馈");
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
                header: {
                    Authorization: app.globalData.wxGlobalToken
                },
                success: function(res) {
                    if (res.data == "success") {
                        feedbackSuccess = true;
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
                    app.showToast(msg, feedbackSuccess);
                    if (feedbackSuccess) {
                        app.navigateBack();
                    }
                }
            })
        }
    }
})