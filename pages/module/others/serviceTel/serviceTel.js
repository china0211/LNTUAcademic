var app = getApp();
Page({
  onLoad: function (options) {
    app.mta.Page.init();
  },
  callTel: function (e) {
    wx.showModal({
      content: '是否拨打' + e.currentTarget.dataset.name + "电话",
      success: function (res) {
        if (res.confirm) {
          //拨打电话
          wx.makePhoneCall({
            phoneNumber: e.currentTarget.dataset.tel
          })
        }
      }
    })
  }
})