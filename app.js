//app.js
var properties = require("/utils/configProperties.js")
var mta = require('/common/lib/mta.js')
App({
    onLaunch: function(options) {
        var that = this;
        var code = null;

        that.getStuId();
        //腾讯MTA分析
        mta.App.init({
            "appID": "500013092",
            "eventID": "500015824",
            "lauchOpts": options,
            "statPullDownFresh": true,
            "statShareApp": true,
            "statReachBottom": true
        });
        this.mta = mta;
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
        wxGlobalToken: properties.wxGlobalToken,
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
        getAnnouncementUrl: properties.getAnnouncementUrl,
        modifyPasswordUrl: properties.modifyPasswordUrl,
        queryClassroomUrl: properties.queryClassroomUrl,
        getTokenUrl: properties.getTokenUrl,
        queryEducationPlanUrl: properties.queryEducationPlanUrl,
        getStuIdByWeChatIdUrl: properties.getStuIdByWeChatIdUrl,
        isBind: false,

        toastFailImg: properties.toastFailImg
    },

    //获取openid
    getOpenId: function(readStorageSuccess) {
        var that = this;
        var result = false;
        wx.login({
            success: function(res) {
                if (res.code) {
                    wx.request({
                        url: 'https://api.weixin.qq.com/sns/jscode2session',
                        data: {
                            appid: that.globalData.appid,
                            secret: that.globalData.secret,
                            grant_type: 'authorization_code',
                            js_code: res.code,
                        },
                        method: 'GET',
                        header: {},
                        success: function(res) {
                            result = true;
                            that.globalData.weChatId = res.data.openid;
                            if (!readStorageSuccess) {
                                that.getStuIdByWeChatId();
                            }
                        },
                        fail: function(res) {
                            that.showToast("获取授权信息失败，请重新打开应用", false)
                        },
                        complete: function(res) {
                            wx.getUserInfo({
                                success: function(resp) {
                                    that.globalData.userInfo = resp.userInfo
                                }
                            })
                        }
                    })
                }
            },
            fail: function(res) {
                that.showMsgModal("获取授权信息失败，请稍后再试")
            },
            complete: function(res) {
                return result;
            }
        })
    },
    // 获取TOKEN
    getToken: function() {
        var that = this;
        wx.request({
            url: that.globalData.getTokenUrl,
            data: {},
            method: 'GET',
            header: {
                Authorization: that.globalData.wxGlobalToken
            },
            success: function(res) {
                console.log(res.data.result)
                that.globalData.wxGlobalToken = res.data.result;
            },
            fail: function(res) {
                that.showMsgModal("获取应用信息失败，请稍后再试")
            },
            complete: function(res) {
                // complete
            }
        })
    },
    //获取学号
    getStuId: function() {
        var that = this;
        wx.getStorage({
            key: 'stuId',
            success: function(res) {
                that.globalData.stuId = res.data;
                that.getOpenId(true);
            },
            fail: function(res) {
                that.getOpenId(false);
            },
            complete: function(res) {

            }
        })
    },
    //通过openID查询stuId
    getStuIdByWeChatId: function() {
        var that = this;
        wx.request({
            url: that.globalData.getStuIdByWeChatIdUrl,
            data: {
                weChatId: that.globalData.weChatId
            },
            method: 'GET',
            header: {
                Authorization: that.globalData.wxGlobalToken
            },
            success: function(resp) {
                if (resp.data.result != null && resp.data.result != "") {
                    that.globalData.stuId = resp.data.result;
                    that.globalData.isBind = true;
                    that.saveStorage("isBind", true);
                    that.saveStorage("stuId", that.globalData.stuId);
                    that.queryAllstuInfo();
                } else {
                    that.navigateToPage("/pages/more/login/login");
                }
            },
            fail: function(resp) {
                that.showMsgModal("获取绑定信息失败，请稍后再试")
            },
            complete: function(resp) {
                // complete
            }
        })
    },
    // 查询
    queryAllstuInfo: function() {
        var toastMsg = '';
        var failed = true;
        var that = this;
        wx.request({
            url: that.globalData.studentInfoUrl,
            method: 'GET',
            header: {
                Authorization: that.globalData.authorization,
                username: that.globalData.stuId
            },
            success: function(res) {
                if (res.data.message == "请求成功") {
                    failed = false;
                    that.globalData.stuDetail = res.data.info.baseInfo
                    wx.setStorage({
                        key: 'stuDetail',
                        data: res.data.info.baseInfo,
                        fail: function(res) {
                            failed = true;
                            toastMsg = "保存用户信息失败";
                        }
                    })
                } else {
                    toastMsg = "获取用户信息失败，请重新登录";
                }
            },
            fail: function(res) {
                toastMsg = "获取用户信息失败，请稍后重试";
            },
            complete: function(res) {
                if (failed) {
                    that.showToast(toastMsg, !failed);
                    that.navigateToPage("/pages/more/login/login");
                }
            }
        })
    },
    //校验用户信息是否有效
    validateStuId: function() {
        var that = this;
        if (that.globalData.stuId == null || that.globalData.stuId == "") {
            that.showToast("请登录后使用", false);
            that.redirectToLoginPage();
        }
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
    //显示加载loadding
    showLoading: function(title, ifShowMask) {
        wx.showLoading({
            title: title || '加载中',
            mask: ifShowMask || true,
            duration: 10000
        })
    },
    //显示错误提醒信息
    showMsgModal: function(msg) {
        wx.showModal({
            showCancel: false,
            content: msg || "未知错误"
        })
    },
    //隐藏加载loadding
    hideLoading: function() {
        wx.hideLoading();
    },
    //页面跳转
    navigateToPage(path) {
        wx.navigateTo({
            url: path
        })
    },
    //页面重定向
    redirectToPage(path) {
        wx.redirectTo({
            url: path
        })
    },
    //重定向到登录页面
    redirectToLoginPage: function() {
        // var duration = showToast ? 1500 : 0;
        setTimeout(function() {
            wx.redirectTo({
                url: '/pages/more/login/login'
            })
        }, 1500)
    },
    //返回前一个页面
    navigateBack: function() {
        setTimeout(function() {
            wx.navigateBack({
                delta: 1
            })
        }, 1500)
    },
    //保存缓存
    saveStorage: function(key, value) {
        wx.setStorage({
            key: key || '',
            data: value || ''
        })
    },
    //清除缓存
    clearStorage: function() {
        try {
            wx.clearStorageSync()
        } catch (e) {
            console.log("清除缓存失败")
        }
    }
})