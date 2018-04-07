var app = getApp();
var util = require("../../../utils/util.js");
Page({
    data: {
        studentDetail: null,
        loading: true,
        noData: false
    },
    onLoad: function (options) {
        app.mta.Page.init();
        var that = this;
        wx.getStorage({
            key: 'studentDetail',
            success: function (res) {
                if (util.isEmpty(res.data)) {
                    that.setData({
                        noData: true
                    })
                } else {
                    that.setData({
                        noData: false,
                        studentDetail: res.data
                    })
                }
            },
            fail: function (res) {
                app.getStudentInfo();
            },
            complete: function (res) {
                that.setData({
                    loading: false
                });
            }
        });
    }
})