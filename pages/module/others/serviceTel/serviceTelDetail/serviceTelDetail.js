var app = getApp();
Page({
    data: {
        currentTels: ''
    },
    onLoad: function (options) {
        var that = this;
        app.mta.Page.init();
        wx.setNavigationBarTitle({
            title: app.currentOrg
        });
        that.setData({
            currentTels: app.currentTels,
            currentOrg: app.currentOrg
        })
    },
    callTel: function (e) {
        var that = this;
        wx.showModal({
            content: '是否拨打' + that.data.currentOrg + e.currentTarget.dataset.name
            + "电话:\n" + e.currentTarget.dataset.tel,
            success: function (res) {
                if (res.confirm) {
                    //拨打电话
                    wx.makePhoneCall({
                        phoneNumber: e.currentTarget.dataset.tel
                    })
                }
            }
        })
    },
})