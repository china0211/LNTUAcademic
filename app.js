var properties = require("/utils/configProperties.js");
var mta = require('/common/lib/mta.js');
var LNTUOEDomain = properties.LNTUOEDomain;
var LNTUOEDomainNew = properties.LNTUOEDomainNew;
var LNTUWMPOEDomain = properties.LNTUWMPOEDomain;
App({
  onLaunch: function (options) {
    var that = this;
    that.getStuId();
    that.initMTA(options);
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
    getOpenIdUrl: LNTUWMPOEDomain+"/getOpenId",
    loginUrl: LNTUOEDomain + "/login",
    studentInfoUrl: LNTUOEDomain + "/student-info",
    examUrl: LNTUOEDomain + "/query-results-all",
    scheduleUrl: LNTUOEDomain + "/schedule",
    skillInfoUrl: LNTUOEDomain + "/skill-score",
    // queryAchievementUrl: LNTUWMPOEDomain + "/queryExamScores",
    queryAchievementUrl: LNTUOEDomain + "/query-results-all",
    queryGradePointUrl: LNTUWMPOEDomain + "/queryGradePoint",
    bindStuIdWithWeChatIdUrl: LNTUWMPOEDomain + "/bindStuIdWithWeChatId",
    removeBoundUrl: LNTUWMPOEDomain + "/removeBound",
    getLogsUrl: LNTUWMPOEDomain + "/getlogs",
    feedbackUrl: LNTUWMPOEDomain + "/feedback",
    queryBindStatusUrl: LNTUWMPOEDomain + "/queryBindStatus",
    getAnnouncementUrl: LNTUWMPOEDomain + "/getAnnouncement",
    modifyPasswordUrl: LNTUWMPOEDomain + "/modifyPassword",
    queryClassroomUrl: LNTUOEDomainNew + "/room-schedule",
    getTokenUrl: LNTUWMPOEDomain + "/getToken",
    queryEducationPlanUrl: LNTUOEDomain + "/teaching-plan",
    // queryEducationPlanUrl: LNTUWMPOEDomain + "/queryEducationPlan",
    getStuIdByWeChatIdUrl: LNTUWMPOEDomain + "/getStuIdByWeChatId",
    saveStartUpRecordUrl: LNTUWMPOEDomain + "/saveStartUpRecord",
    getCurrentWeekAndDayUrl: LNTUWMPOEDomain + "/getCurrentWeekAndDay",
    evaluateCourseUrl: LNTUWMPOEDomain + "/evaluateCourse",
    queryCourseScheduleUrl: LNTUOEDomain + "/schedule",
    isBind: false,

    toastFailImg: properties.toastFailImg,
    version:properties.version,
    versionType:properties.versionType
  },
    
  getOpenId: function (readStorageSuccess) {
    var that = this;
    wx.login({
      success: function (res) {
        if (res.code) {
          wx.request({
            url: that.globalData.getOpenIdUrl,
            data: {
              code: res.code
            },
            method: 'GET',
            header: {
                Authorization: that.globalData.wxGlobalToken
            },
            success: function (res) {
              that.globalData.weChatId = res.data.result;
              if (!readStorageSuccess) {
                that.getStuIdByWeChatId();
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
                  //发送使用信息
                  that.saveStartUpRecord(resp.userInfo.nickName);
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
    mta.App.init({
      "appID": "500434803",
      "eventID": "500437610",
      "lauchOpts": options,
      "statPullDownFresh": true,
      "statShareApp": true,
      "statReachBottom": true
    });
    this.mta = mta;
  },
  // 获取TOKEN
  getToken: function () {
    var that = this;
    wx.request({
      url: that.globalData.getTokenUrl,
      data: {},
      method: 'GET',
      header: {
        Authorization: that.globalData.wxGlobalToken
      },
      success: function (res) {
        that.globalData.wxGlobalToken = res.data.result;
      },
      fail: function (res) {
        that.showMsgModal("获取应用信息失败，请稍后再试")
      },
      complete: function (res) {
        // complete
      }
    })
  },
  //获取学号
  getStuId: function () {
    var that = this;
    wx.getStorage({
      key: 'stuId',
      success: function (res) {
        that.globalData.stuId = res.data;
        that.getOpenId(true);
        that.getStuDetailFromStorage();
      },
      fail: function (res) {
        that.getOpenId(false);
      },
      complete: function (res) {

      }
    })
  },
    //从缓存中读取学生信息(如果本地有缓存，没有缓存的时候通过queryAllstuInfo获取)
    getStuDetailFromStorage: function () {
        var that = this;
        wx.getStorage({
            key: 'stuDetail',
            success: function (res) {
                that.globalData.stuDetail = res.data;
            }
        })
    },

  //通过openID查询stuId
  getStuIdByWeChatId: function () {
    var that = this;
    wx.request({
      url: that.globalData.getStuIdByWeChatIdUrl,
      data: {
        wechatId: that.globalData.weChatId
      },
      method: 'POST',
      header: {
        Authorization: that.globalData.wxGlobalToken
      },
      success: function (resp) {
        if (resp.data.result != null && resp.data.result != "") {
          that.globalData.stuId = resp.data.result.stuId;
          that.globalData.isBind = true;
          that.saveStorage("isBind", true);
          that.saveStorage("stuId", that.globalData.stuId);
          that.queryAllstuInfo();
        } else {
          that.navigateToPage("/pages/more/login/login");
        }
      },
      fail: function (resp) {
        that.showMsgModal("获取绑定信息失败，请稍后再试")
      },
      complete: function (resp) {
        // complete
      }
    })
  },
  // 查询
  queryAllstuInfo: function () {
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
      success: function (res) {
        if (res.data.message == "请求成功") {
          failed = false;
          that.globalData.stuDetail = res.data.info.baseInfo;
          wx.setStorage({
            key: 'stuDetail',
            data: res.data.info.baseInfo,
            fail: function (res) {
              failed = true;
              toastMsg = "保存用户信息失败";
            }
          })
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
          that.navigateToPage("/pages/more/login/login");
        }
      }
    })
  },
  //校验用户信息是否有效
  validateStuId: function () {
    var that = this;
    if (that.globalData.stuId == null || that.globalData.stuId == "") {
      that.showToast("请登录后使用", false);
      that.redirectToLoginPage();
    }
  },
  //保存用户使用信息
  saveStartUpRecord: function (nickName) {
    var that = this;
    wx.request({
      url: that.globalData.saveStartUpRecordUrl,
      data: {
        wechatId: nickName,
      },
      method: 'POST',
      header: {
        Authorization: that.globalData.wxGlobalToken
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
  navigateToPage: function(path) {
    wx.navigateTo({
      url: path
    })
  },
  //页面重定向
  redirectToPage: function(path) {
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
    try {
      wx.clearStorageSync()
    } catch (e) {
      console.log("清除缓存失败")
    }
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
  }
})