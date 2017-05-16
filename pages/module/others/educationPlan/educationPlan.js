var app = getApp();
Page({
  data: {
    educationPlanYears: ["第一学年秋季学期", "第一学年春季学期",
      "第二学年秋季学期", "第二学年春季学期",
      "第三学年秋季学期", "第三学年春季学期",
      "第四学年秋季学期", "第四学年春季学期"
    ],
    selectedEducationPlanYear: '请选择学年学期',
    educationPlans: '',
    stuId: ''
  },
  onLoad: function (options) {
    app.mta.Page.init();
    app.validateStuId();
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  //选择学年学期
  chooseEducationPlanYear: function (e) {
    var that = this;
    that.setData({
      selectedEducationPlanYear: that.data.educationPlanYears[e.detail.value]
    })
  },
  //获取学号
  setStuId: function () {
    var that = this;
    if (util.isStuIdValid(app.globalData.stuId)) {
      that.setData({
        stuId: app.globalData.stuId
      })
    } else {
      wx.getStorage({
        key: 'stuId',
        success: function (response) {
          that.setData({
            stuId: response.data
          })
        },
        fail: function (res) {
          app.showToast("获取用户信息失败，请重新登录", false);
          app.redirectToLoginPage();
        }
      })
    }
  },
  //查询教学计划
  queryEducationPlan: function (e) {
    var that = this;
    var selectedEducationPlanYear = that.data.selectedEducationPlanYear;

    if (selectedEducationPlanYear != null && selectedEducationPlanYear != "请选择学年学期") {
      var toastMsg = '';
      var failed = true;
      app.showLoading('正在查询', true);
      wx.request({
        url: app.globalData.queryEducationPlanUrl,
        data: {
          educationPlanYear: selectedEducationPlanYear,
          stuId: app.globalData.stuId
        },
        method: 'GET',
        header: {
          Authorization: app.globalData.authorization,
          username: app.globalData.stuId
        },
        success: function (res) {
          if (res.data.message == "请求成功") {
            failed = false;
            that.setData({
              educationPlans: res.data.info
            })
          } else {
            toastMsg = "查询失败，请稍后重试";
          }
        },
        fail: function (res) {
          toastMsg = "请求失败，请稍后重试";
        },
        complete: function (res) {
          app.hideLoading();
          if (failed) {
            app.showToast(toastMsg, false)
          }
        }
      })
    } else {
      app.showMsgModal("请选择学年学期");
    }
  },
})