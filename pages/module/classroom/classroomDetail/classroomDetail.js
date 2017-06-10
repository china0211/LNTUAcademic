var app = getApp();
Page({
  data: {
    classrooms: null,
    hasResult: false
  },
  onLoad: function (options) {
    var that = this;
    wx.setNavigationBarTitle({
      title: app.currentClassroomsTitle
    })
    if (app.currentClassrooms != null && app.currentClassrooms != undefined
      && app.currentClassrooms.length > 0) {
      that.setData({
        classrooms: app.currentClassrooms,
        hasResult: true
      })
    }
    app.mta.Page.init();
  }
})