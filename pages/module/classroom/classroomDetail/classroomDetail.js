var app = getApp();
var mta = require('../../../../common/lib/mta.js');
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
        mta.Page.init();
  }
})