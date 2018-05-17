var properties = require("/utils/configProperties.js");
var mta = require('/common/lib/mta.js');
var util = require("utils/util.js");
App({
    onLaunch: function (options) {
        var that = this;
        that.validateInParse();
        that.getStudentNo();
        that.initMTA(options);
        // options 用于退出重新进入后初始化 MTA
        that.globalData.options = options;
    },
    globalData: {
        quit: false,
        parsing: false,
        userInfo: null,
        studentNo: '',
        weChatOpenId: '',
        studentDetail: null,
        authorization: properties.authorization,
        appID: properties.appID,
        eventID: properties.eventID,
        getOpenIdUrl: properties.getOpenIdUrl,
        loginUrl: properties.loginUrl,
        studentInfoUrl: properties.studentInfoUrl,
        examPlanUrl: properties.examPlanUrl,
        courseScheduleUrl: properties.courseScheduleUrl,
        gradeExamScoreUrl: properties.gradeExamScoreUrl,
        examUrl: properties.examUrl,
        gradePointUrl: properties.gradePointUrl,
        bindUrl: properties.bindUrl,
        unBindUrl: properties.unBindUrl,
        feedbackUrl: properties.feedbackUrl,
        feedbackUploadUrl: properties.feedbackUploadUrl,
        announcementUrl: properties.announcementUrl,
        modifyPasswordUrl: properties.modifyPasswordUrl,
        classroomOccupyUrl: properties.classroomOccupyUrl,
        getTokenUrl: properties.getTokenUrl,
        educationPlanUrl: properties.educationPlanUrl,
        getStudentNoUrl: properties.getStudentNoUrl,
        getCurrentTimeInfoUrl: properties.getCurrentTimeInfoUrl,
        evaluateCourseUrl: properties.evaluateCourseUrl,
        organizationServiceTelephoneUrl: properties.organizationServiceTelephoneUrl,
        isBind: false,
        grantType: properties.grantType,
        toastFailImg: properties.toastFailImg,
        version: properties.version,
        versionType: properties.versionType
    },

    getOpenId: function (readStorageSuccess) {
        var that = this;
        wx.login({
            success: function (res) {
                if (res.code) {
                    wx.request({
                        url: that.globalData.getOpenIdUrl,
                        data: {
                            sessionCode: res.code
                        },
                        method: 'GET',
                        header: {
                            Authorization: that.globalData.authorization
                        },
                        success: function (res) {
                            that.globalData.weChatOpenId = res.data.result;
                            that.saveStorage("weChatOpenId", that.globalData.weChatOpenId);
                            if (!readStorageSuccess) {
                                that.getStudentNoByOpenId();
                            } else {
                                that.getToken();
                            }
                        },
                        fail: function (res) {
                            that.showToast("获取授权信息失败，请重新打开应用", false)
                        },
                        complete: function (res) {
                            wx.getUserInfo({
                                success: function (resp) {
                                    that.globalData.userInfo = resp.userInfo;
                                }, complete: function (resp) {
                                }
                            })
                        }
                    })
                }
            },
            fail: function (res) {
                that.showMsgModal("获取授权信息失败，请稍后再试")
            },
            complete: function (res) {
            }
        })
    },
    //腾讯MTA分析
    initMTA: function (options) {
        var that = this;
        mta.App.init({
            "appID": that.globalData.appID,
            "eventID": that.globalData.eventID,
            "lauchOpts": options,
            "statPullDownFresh": true,
            "statShareApp": true,
            "statReachBottom": true
        });
        this.mta = mta;
    },
    // 获取TOKEN
    getToken: function (needGetStudentInfo) {
        var that = this;
        if (!util.isEmpty(that.globalData.studentNo) && !util.isEmpty(that.globalData.weChatOpenId)) {
            wx.request({
                url: that.globalData.getTokenUrl,
                method: 'POST',
                header: {
                    Authorization: util.encodeAuthorization(that.globalData.studentNo, that.globalData.weChatOpenId),
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: {
                    grant_type: that.globalData.grantType,
                    username: that.globalData.studentNo,
                    password: that.globalData.weChatOpenId
                },
                success: function (res) {
                    that.globalData.authorization = "Bearer " + res.data.value;
                },
                fail: function (res) {
                    that.showMsgModal("获取应用信息失败，请稍后再试")
                },
                complete: function (res) {
                    if (needGetStudentInfo) {
                        that.getStudentInfo();
                    }
                }
            });
        }
    },
    validateInParse: function () {
        var that = this;
        wx.getStorage({
            key: 'parsing',
            success: function (res) {
                that.globalData.parsing = res.data;
            },
            fail: function (res) {
            },
            complete: function (res) {
            }
        })
    },
    //获取学号
    getStudentNo: function () {
        var that = this;
        wx.getStorage({
            key: 'studentNo',
            success: function (res) {
                that.globalData.studentNo = res.data;
                that.getOpenId(true);
                that.getStudentInfoFromStorage();
            },
            fail: function (res) {
                that.getOpenId(false);
            },
            complete: function (res) {
            }
        })
    },
    //从缓存中读取学生信息(如果本地有缓存，没有缓存的时候通过getStudentInfo获取)
    getStudentInfoFromStorage: function () {
        var that = this;
        wx.getStorage({
            key: 'studentDetail',
            success: function (res) {
                that.globalData.studentDetail = res.data;
                that.globalData.isBind = true;
            }
        })
    },

    //通过openID查询 studentNo
    getStudentNoByOpenId: function () {
        var that = this;
        wx.request({
            url: that.globalData.getStudentNoUrl,
            data: {
                weChatOpenId: that.globalData.weChatOpenId
            },
            method: 'GET',
            header: {
                Authorization: that.globalData.authorization
            },
            success: function (resp) {
                if (resp.data.message == "success") {
                    that.globalData.studentNo = resp.data.result.studentNo;
                    that.getToken(true);
                } else {
                    that.redirectToLoginPage();
                }
            },
            fail: function (resp) {
                that.showMsgModal("获取绑定信息失败，请稍后再试")
            },
            complete: function (resp) {
            }
        })
    },
    // 查询
    getStudentInfo: function () {
        var toastMsg = '';
        var failed = true;
        var that = this;
        if (that.globalData.studentNo != undefined) {
            wx.request({
                url: that.globalData.studentInfoUrl.concat(that.globalData.studentNo),
                method: 'GET',
                header: {
                    Authorization: that.globalData.authorization
                },
                success: function (res) {
                    if (res.data.message == "success") {
                        failed = false;
                        that.globalData.studentDetail = res.data.result;
                        that.globalData.parsing = false;
                        that.globalData.isBind = true;
                        that.saveStorage("studentNo", that.globalData.studentNo);
                        that.saveStorage("parsing", false);
                        that.saveStorage("isBind", true);
                        that.saveStorage("studentDetail", res.data.result);
                    } else {
                        toastMsg = "获取用户信息失败，请重新登录";
                    }
                },
                fail: function (res) {
                    toastMsg = "获取用户信息失败，请稍后重试";
                },
                complete: function (res) {
                    if (failed) {
                        that.showToast(toastMsg, !failed);
                        that.redirectToLoginPage();
                    }
                }
            })
        } else {
            that.redirectToLoginPage("/pages/more/login/login");
        }
    },
    //校验用户信息是否有效
    validateStuId: function () {
        var that = this;
        if (that.globalData.studentNo == null || that.globalData.studentNo == "") {
            that.showToast("请登录后使用", false);
            // that.redirectToLoginPage();
        }
    },
    //提示信息(信息内容，是否成功提示)
    showToast: function (msg, success) {
        var that = this;
        if (success) {
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
            duration: 30000
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
    navigateToPage: function (path) {
        wx.navigateTo({
            url: path
        })
    },
    //页面重定向
    redirectToPage: function (path) {
        wx.redirectTo({
            url: path
        })
    },
    //重定向到登录页面
    redirectToLoginPage: function (noDuration) {
        var duration = noDuration ? 0 : 1500;
        setTimeout(function () {
            wx.redirectTo({
                url: '/pages/more/login/login'
            })
        }, duration)
    },
    //返回前一个页面
    navigateBack: function (noDelay) {
        var duration = noDelay ? 0 : 1500;
        setTimeout(function () {
            wx.navigateBack({
                delta: 1
            })
        }, duration)
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
        wx.clearStorageSync();
    },
    //保存内容到剪贴板
    setClipboardData: function (data) {
        var that = this;
        wx.setClipboardData({
            data: data,
            success: function (res) {
                that.showToast("已复制到剪贴板", true);
            }
        })
    },
    //从剪贴板获取数据
    getClipboardData: function () {
        var that = this;
        wx.getClipboardData({
            success: function (res) {
                return res.data;
            }
        })
    },
    close: function () {
        this.globalData.quit = true;
        wx.reLaunch({
            url: '/pages/index/index'
        })
    },
    // 获取手机信息
    getSystemInfo: function () {
        var that = this;
        wx.getSystemInfo({
            success: function (res) {
                that.globalData.phoneModel = res.model;
                that.globalData.windowWidth = res.windowWidth;
                that.globalData.windowHeight = res.windowHeight;
                that.globalData.weChatVersion = res.version;
                that.globalData.systemInfo = res.system;
                that.globalData.weChatLanguage = res.language;
                that.globalData.sdkVersion = res.SDKVersion
            }
        })
    }
});