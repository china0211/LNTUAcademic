var app = getApp();
Page({
    data: {},
    onLoad: function () {
        var that = this;
        if (app.globalData.quit) {
            wx.navigateBack({
                delta: 1
            });
            app.globalData.quit = false;
            app.onLaunch(app.globalData.options);
        }
        app.mta.Page.init();
        that.getCurrentWeekAndDay();
    },
    //获取当前学年学期 周数和星期
    getCurrentWeekAndDay: function () {
        wx.request({
            url: app.globalData.getCurrentTimeInfoUrl,
            data: {},
            method: 'GET',
            header: {
                Authorization: app.globalData.authorization
            },
            success: function (res) {
                if (res.data.message == "success") {
                    app.globalData.currentYear = res.data.result.currentYear;
                    app.globalData.currentSeason = res.data.result.currentSeason;
                    app.globalData.currentMonth = res.data.result.currentMonth;
                    app.globalData.currentWeek = res.data.result.currentWeek;
                    app.globalData.currentDay = res.data.result.currentDay;
                }
            },
            fail: function (res) {
            },
            complete: function (res) {

            }
        })
    }
});