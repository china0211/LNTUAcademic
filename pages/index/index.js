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
          //服务器返回周日值为0，其他值为1 2 3 4 5 6
          if(res.data.result.currentDay == 0) {
              app.globalData.currentDay = 7;
          }else{
              app.globalData.currentDay = res.data.result.currentDay;
          }
          console.log(app.globalData.currentWeek);
        }
      },
      fail: function (res) {
      },
      complete: function (res) {

      }
    })
  }
})