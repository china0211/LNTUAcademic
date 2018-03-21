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
    studentNo: ''
  },
  onLoad: function (options) {
    var that = this;
    app.mta.Page.init();
    app.validateStuId();
    that.queryEducationPlan();
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
  // setStuId: function () {
  //   var that = this;
  //   if (util.isStudentNoValid(app.globalData.studentNo)) {
  //     that.setData({
  //       studentNo: app.globalData.studentNo
  //     })
  //   } else {
  //     wx.getStorage({
  //       key: 'studentNo',
  //       success: function (response) {
  //         that.setData({
  //           studentNo: response.data
  //         })
  //       },
  //       fail: function (res) {
  //         app.showToast("获取用户信息失败，请重新登录", false);
  //         app.redirectToLoginPage();
  //       }
  //     })
  //   }
  // },
  //查询教学计划
  queryEducationPlan: function (e) {
    var that = this;
    var selectedEducationPlanYear = that.data.selectedEducationPlanYear;

    // if (selectedEducationPlanYear != null && selectedEducationPlanYear != "请选择学年学期") {
      var toastMsg = '';
      var failed = true;
      app.showLoading('正在查询', true);
      wx.request({
        url: app.globalData.courseStudyScheduleUrl.concat(app.globalData.studentNo),
        data: {
          educationPlanYear: selectedEducationPlanYear
        },
        method: 'GET',
        header: {
          Authorization: app.globalData.authorization,
          username: app.globalData.studentNo
        },
        success: function (res) {
          if (res.data.message == "success") {
            failed = false;
            that.setData({
              educationPlans: res.data.result
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
    // } else {
    //   app.showMsgModal("请选择学年学期");
    // }
  },
})