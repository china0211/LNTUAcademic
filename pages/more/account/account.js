var app = getApp();
var util = require('../../../utils/util.js');
Page({
    data: {
        stuDetail: null,
        studentNo: '',
        userInfo: null,
        isBind: null
    },
    onLoad: function (options) {
        app.mta.Page.init();
        var that = this;
        that.setData({
            userInfo: app.globalData.userInfo,
            stuDetail: app.globalData.stuDetail,
            studentNo: app.globalData.studentNo,
            isBind: app.globalData.isBind
        })
    },
    //解除绑定
    unboundAccount: function () {
        var that = this;
        var msg = "";
        var success = false;
        wx.showModal({
            title: '删除账号',
            content: '将删除所有信息并退出',
            success: function (res) {
                if (res.confirm) {
                    app.showLoading();
                    wx.request({
                        url: app.globalData.unBindUrl,
                        data: {
                            studentNo: app.globalData.studentNo,
                            weChatOpenId: app.globalData.weChatOpenId
                        },
                        method: 'DELETE',
                        header: {
                            Authorization: app.globalData.wxGlobalToken
                        },
                        success: function (response) {
                            if (response.data.result) {
                                msg = "已成功删除账号";
                                success = true;
                                app.clearStorage();
                                app.globalData.isBind = false;
                                app.globalData.studentNo = null;
                                app.saveStorage("isBind", false);
                                app.saveStorage("weChatOpenId", app.globalData.weChatOpenId);
                            } else {
                                msg = "删除失败，请稍后重试";
                            }
                        },
                        fail: function () {
                            msg = "请求失败，请稍后重试";
                        },
                        complete: function () {
                            app.hideLoading();
                            app.showToast(msg, success);
                            if (success) {
                                app.close();
                            }
                            app.mta.Event.stat('account', {'operation': 'unbind'});
                        }
                    })
                }
            }
        })
    },
    switchAccount: function () {
        wx.showModal({
            title: '切换账号',
            content: '是否确定要切换账号',
            success: function (res) {
                if (res.confirm) {
                    app.navigateToPage("/pages/more/login/login")
                }
            },
            complete: function () {
                app.mta.Event.stat('account', {'operation': 'switch'});
            }
        })
    }
});