var app = getApp();
var util = require("../../../utils/util.js");
Page({
    data: {
        studentDetail: null,
        userInfo: null,
        isBind: false,
        authorization: true
    },
    onLoad: function (options) {
        var that = this;
        if (util.isEmpty(app.globalData.userInfo)) {
            that.setData({
                authorization: false
            });
        }
        that.setData({
            studentDetail: app.globalData.studentDetail,
            userInfo: app.globalData.userInfo,
            isBind: app.globalData.isBind
        });
        app.mta.Page.init();
    },
    onShow: function () {
    },
    getUserInfo: function () {
        var that = this;
        if (util.isEmpty(that.data.userInfo)) {
            wx.getUserInfo({
                success: function (resp) {
                    if (!util.isEmpty(resp.userInfo)) {
                        that.setData({
                            userInfo: resp.userInfo,
                            authorization: true
                        });
                        app.globalData.userInfo = resp.userInfo;
                    }
                }
            });
        }
    }
});