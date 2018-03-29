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
        windowWidth: '',
        windowHeight: '',
        wechatVersion: '',
        system: '',
        sdkVersion: '',
        networkType: '',
        language: '',
        feedbackTitle: '',
        feedbackBody: ''
    },
    onLoad: function (options) {
        var that = this;
        app.mta.Page.init();
        that.getNetwork();
        that.getSystemInfo();
    },
    inputFeedbackTitle: function (e) {
        this.setData({
            title: e.detail.value
        })
    },
    inputFeedbackContent: function (e) {
        this.setData({
            comments: e.detail.value,
            contentLength: e.detail.value.length
        })
    },
    inputCotactInfomation: function (e) {
        this.setData({
            contactInfomation: e.detail.value
        })
    },
    // 获取手机信息
    getSystemInfo: function () {
        var that = this;
        wx.getSystemInfo({
            success: function (res) {
                that.setData({
                    phoneModel: res.model,
                    windowWidth: res.windowWidth,
                    windowHeight: res.windowHeight,
                    wechatVersion: res.version,
                    system: res.system,
                    language: res.language,
                    sdkVersion: res.SDKVersion
                });

            }
        })
    },
    getNetwork: function () {
        var that = this;
        wx.getNetworkType({
            success: function (resp) {
                that.setData({
                    networkType: resp.networkType
                })
                that.getSystemInfo();
            }
        });
    },
    //校验数据
    validateData: function () {
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
    sendFeedback: function () {
        var that = this;
        if (that.validateData()) {
            var msg = "";
            var feedbackSuccess = false;
            app.showLoading("正在反馈");
            if (that.handleData()) {
                wx.request({
                    url: app.globalData.feedbackUrl,
                    data: {
                        title: that.data.feedbackTitle,
                        body: that.data.feedbackBody
                    },
                    method: 'POST',
                    header: {
                        Authorization: app.globalData.authorization
                    },
                    success: function (res) {
                        if (res.data.message == "success") {
                            feedbackSuccess = true;
                            msg = "反馈成功";
                        } else {
                            msg = "反馈失败，请稍后重试";
                        }
                    },
                    fail: function (res) {
                        msg = "请求失败，请稍后重试";
                    },
                    complete: function (res) {
                        app.hideLoading();
                        app.showToast(msg, feedbackSuccess);
                        if (feedbackSuccess) {
                            app.navigateBack();
                        }
                    }
                })
            }
        }
    },
    //处理反馈数据
    handleData: function () {
        try {
            var that = this;
            var title = '\"' + app.globalData.userInfo.nickName + '\"\t' + that.data.title;
            var body = '**反馈内容**';
            body += '\r\n >' + that.data.comments;
            body += '\r\n\r\n**用户信息**';
            body += '\r\n>微信昵称：' + app.globalData.userInfo.nickName;
            body += '\r\n>OpenID：' + app.globalData.weChatOpenId;
            //当用户登录时反馈内容中包含姓名学号，否则不包含
            if (app.globalData.stuDetail) {
                body += '\r\n>姓名：' + app.globalData.stuDetail.name;
                body += '\r\n>学号：' + app.globalData.stuDetail.studentNo;
            }
            body += '\r\n>联系方式：' + that.data.contactInfomation;
            body += '\r\n\r\n**设备信息**';
            body += '\r\n>手机型号：' + that.data.phoneModel;
            body += '（' + that.data.windowHeight + ' x ' + that.data.windowWidth + '）';
            body += '\r\n>系统类型：' + that.data.system;
            body += '\r\n>微信版本：' + that.data.wechatVersion;
            body += '\r\n>微信语言：' + that.data.language;
            body += '\r\n>SDK版本：' + that.data.sdkVersion;
            body += '\r\n>网络类型：' + that.data.networkType;
            body += '\r\n>小程序版本：' + app.globalData.version + '-' + app.globalData.versionType;
            that.setData({
                feedbackTitle: title,
                feedbackBody: body
            });
            return true;
        }
        catch (e) {
            return false;
        }
    }
})