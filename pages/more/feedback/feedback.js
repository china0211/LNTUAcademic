var app = getApp();
var util = require('../../../utils/util.js');

Page({
    data: {
        commentLength: 0,
        // 反馈信息
        comment: '',
        // 手机信息
        phoneModel: '',
        windowWidth: '',
        windowHeight: '',
        weChatVersion: '',
        system: '',
        sdkVersion: '',
        networkType: '',
        weChatLanguage: '',
        feedbackBody: '',
        files: [],
        feedbackId: ''
    },
    onLoad: function (options) {
        var that = this;
        that.getNetwork();
        that.getSystemInfo();
        app.mta.Page.init();
    },
    inputFeedbackContent: function (e) {
        this.setData({
            comment: e.detail.value,
            commentLength: e.detail.value.length
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
                    weChatVersion: res.version,
                    system: res.system,
                    weChatLanguage: res.language,
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
                });
                that.getSystemInfo();
            }
        });
    },
    //校验数据
    validateData: function () {
        var result = false;
        if (this.data.comment == null || this.data.comment.trim() == "") {
            app.showMsgModal("请输入反馈信息");
        } else {
            result = true;
        }
        return result;
    },
    chooseImage: function (e) {
        var that = this;
        wx.chooseImage({
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: function (res) {
                that.setData({
                    files: that.data.files.concat(res.tempFilePaths)
                });
            }
        })
    },
    previewImage: function (e) {
        wx.previewImage({
            current: e.currentTarget.id,
            urls: this.data.files
        })
    },
    // 反馈
    sendFeedback: function () {
        var that = this;
        var msg = "";
        var feedbackSuccess = false;
        if (that.validateData()) {
            app.showLoading("正在反馈");
            wx.request({
                url: app.globalData.feedbackUrl,
                method: 'POST',
                header: {
                    Authorization: app.globalData.authorization
                },
                data: {
                    comment: that.data.comment,
                    studentNo: app.globalData.studentNo,
                    studentId: app.globalData.studentDetail.id,
                    studentName: app.globalData.studentDetail.name,
                    weChatNickname: app.globalData.userInfo.nickName,
                    weChatOpenId: app.globalData.weChatOpenId,
                    phoneModel: that.data.phoneModel,
                    windowHeight: that.data.windowHeight,
                    windowWidth: that.data.windowWidth,
                    system: that.data.system,
                    weChatVersion: that.data.weChatVersion,
                    weChatLanguage: that.data.weChatLanguage,
                    sdkVersion: that.data.sdkVersion,
                    networkType: that.data.networkType,
                    miniProgramVersion: app.globalData.version,
                    miniProgramType: app.globalData.versionType
                },
                success: function (res) {
                    if (res.data.message == "success") {
                        that.setData({
                            feedbackId: res.data.result.id
                        });
                        msg = "反馈成功";
                        if (that.uploadFile()) {
                            feedbackSuccess = true;
                        }
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
            });
        }
    },
    uploadFile: function () {
        var that = this;
        if (!util.isEmpty(that.data.files)) {
            for (var i = 0; i < that.data.files.length; i++) {
                wx.uploadFile({
                    url: app.globalData.feedbackUploadUrl,
                    header: {
                        Authorization: app.globalData.authorization
                    },
                    filePath: that.data.files[i],
                    name: 'file',
                    formData: {
                        'feedbackId': that.data.feedbackId,
                        'originFileName': that.data.files[i]
                    },
                    success: function (res) {
                    }
                });
            }
        }
        return true;
    }
});