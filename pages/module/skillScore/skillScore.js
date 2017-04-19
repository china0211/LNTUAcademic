var app = getApp();
Page({
  data: {
    stuId: null,
    skillScores: []
  },
  onLoad: function (options) {
    var that = this;
    wx.getStorage({
      key: 'stuId',
      success: function (response) {
        that.setData({
          stuId: response.data
        }),
          wx.request({
            url: app.globalData.skillInfoUrl,
            data: {},
            method: 'GET',
            header: {
              Authorization: app.globalData.authorization,
              username: that.data.stuId
            },
            success: function (res) {
              if (res.data.message == "请求成功") {
                that.setData({
                  skillScores: res.data.info
                })
              }
              else {
                app.showToast("查询失败，请稍后重试", false);
                app.navigateBack();
              }
            },
            fail: function (res) {
              app.showToast("请求失败，请稍后重试", false);
              app.navigateBack();
            },
          })
      },
      fail: function (res) {
        app.showToast("查询失败，请重新登录", false);
        app.redirectToLoginPage();
      }
    })
  },
})