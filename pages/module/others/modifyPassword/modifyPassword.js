var app = getApp();
Page({
    data: {
        originalPassword: null,
        newPassword: null,
        confirmPassword: null
    },
    onLoad: function (options) {
        app.mta.Page.init();
        app.validateStuId();
    },
    onShow: function () {

    },
    inputOriginalPassword: function (e) {
        this.setData({
            originalPassword: e.detail.value
        })
    },
    inputNewPassword: function (e) {
        this.setData({
            newPassword: e.detail.value
        })
    },
    inputConfirmPassword: function (e) {
        this.setData({
            confirmPassword: e.detail.value
        })
    },
    //校验密码格式
    isPasswordFormatValid: function (password) {
        var that = this;
        if (password == null || password == "" || password.length < 1 || password.length > 18) {
            return false;
        } else {
            return true;
        }
    },
    //校验密码是否为空
    isPasswordFormatValid: function (password) {
        var that = this;
        if (password != null && password != "") {
            return true;
        } else {
            return false;
        }
    },
    //校验密码
    validatePassword: function () {
        var that = this;
        if (!that.isPasswordFormatValid(that.data.originalPassword)) {
            app.showMsgModal("原密码为空或格式不正确");
            return false;
        } else if (!that.isPasswordFormatValid(that.data.newPassword)) {
            app.showMsgModal("新密码为空或格式不正确");
            return false;
        } else if (!that.isPasswordFormatValid(that.data.confirmPassword)) {
            app.showMsgModal("确认密码为空或格式不正确");
            return false;
        } else if (that.data.newPassword == that.data.originalPassword) {
            app.showMsgModal("新密码不能和原密码相同");
            return false;
        } else if (that.data.newPassword != that.data.confirmPassword) {
            app.showMsgModal("两次输入新密码不一致");
            return false;
        } else {
            return true;
        }
    },
    modifyPassword: function () {
        var that = this;
        if (that.validatePassword()) {
            var toastMsg = '';
            var failed = true;
            var showToast = true;
            var navigateBack = false;
            wx.request({
                url: app.globalData.modifyPasswordUrl,
                data: {
                    studentNo: app.globalData.studentNo,
                    originalPassword: that.data.originalPassword,
                    newPassword: that.data.newPassword,
                },
                method: 'GET',
                header: {
                    Authorization: app.globalData.authorization,
                    username: app.globalData.studentNo
                },
                success: function (res) {
                    if (res.data.result == "success") {
                        failed = false;
                        navigateBack = true;
                        toastMsg = "修改密码成功";
                    } else {
                        toastMsg = "原密码错误，请重新确认";
                        showToast = false;
                    }
                },
                fail: function (res) {
                    toastMsg = "请求失败，请稍后重试";
                },
                complete: function (res) {
                    app.hideLoading();
                    if (showToast) {
                        app.showToast(toastMsg, !failed);
                    } else {
                        app.showMsgModal(toastMsg);
                    }
                    if (navigateBack) {
                        app.navigateBack();
                    }
                }
            })
        }
    }
})