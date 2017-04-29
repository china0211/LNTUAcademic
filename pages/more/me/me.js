var app = getApp();
Page({
    data: {
        stuDetail: null,
        userInfo: null,
        isBind: false
    },
    onLoad: function(options) {
        app.mta.Page.init();
    },
    onShow: function() {
        var that = this
        that.setData({
            isBind: app.globalData.isBind,
            userInfo: app.globalData.userInfo,
        })

        //读取本地保存的用户信息
        wx.getStorage({
                key: 'stuDetail',
                success: function(res) {
                    that.setData({
                        stuDetail: res.data,
                    })
                }
            }),
            wx.getStorage({
                key: 'isBind',
                success: function(res) {
                    that.setData({
                        isBind: res.data
                    })
                }
            })
    }
})