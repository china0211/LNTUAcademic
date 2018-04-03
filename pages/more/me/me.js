var app = getApp();
Page({
    data: {
        studentDetail: null,
        userInfo: null,
        isBind: false
    },
    onLoad: function (options) {
        var that = this;
        that.setData({
            studentDetail: app.globalData.studentDetail,
            userInfo: app.globalData.userInfo,
            isBind: app.globalData.isBind
        });
        app.mta.Page.init();
    },
    onShow: function () {

    }
});