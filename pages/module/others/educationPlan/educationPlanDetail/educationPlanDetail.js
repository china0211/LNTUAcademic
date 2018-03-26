var app = getApp();
Page({
    data: {
        course: null
    },
    onLoad: function (options) {
        app.mta.Page.init();
        var that = this;
        that.setData({
            course: app.currentCourse
        })
        wx.setNavigationBarTitle({
            title: that.data.course.courseName
        })
    }
})