var app = getApp();
Page({
  data: {
  },
  onLoad: function () {
    var that = this;
    app.mta.Page.init();
    that.getCurrentWeekAndDay();
  },
  //获取当前周数和星期
  getCurrentWeekAndDay: function () {
    wx.request({
      url: app.globalData.getCurrentWeekAndDayUrl,
      data: {},
      method: 'GET',
      header: {
        Authorization: app.globalData.wxGlobalToken
      },
      success: function (res) {
        if (res.data.status == "success") {
          app.globalData.currentWeek = res.data.result.currentWeek;
          app.globalData.currentDay = res.data.result.currentDay;
        }
      },
      fail: function (res) {
      },
      complete: function (res) {

      }
    })
  }
})