var app = getApp();
Page({
  data: {
    classrooms: null
  },
  onLoad: function (options) {
    var that = this;
    wx.setNavigationBarTitle({
      title: app.currentClassroomsTitle
    }),
    that.setData({
      classrooms: app.currentClassrooms
    }),
        app.mta.Page.init();
  }
})