var app = getApp();
var util = require("../../../utils/util.js");
Page({
    data: {
        loading: true,
        noData: false,
        days: ['一', '二', '三', '四', '五', '六', '七'],
        courseSchedule: [
            [[], [], [], [], []],
            [[], [], [], [], []],
            [[], [], [], [], []],
            [[], [], [], [], []],
            [[], [], [], [], []],
            [[], [], [], [], []],
            [[], [], [], [], []]
        ]
    },
    onLoad: function (options) {
        var that = this;
        // 获取课程表信息
        that.getCourseData();
        app.mta.Page.init();
    },

    // 获取课程表信息
    getCourseData: function () {
        var that = this;
        var toastMsg = '';
        var failed = true;
        var navigateBack = true;
        app.showLoading();
        wx.request({
            url: app.globalData.courseScheduleUrl.concat(app.globalData.studentNo),
            data: {},
            method: 'GET',
            header: {
                Authorization: app.globalData.authorization
            },
            success: function (res) {
                if (res.data.message == "success") {
                    failed = false;
                    navigateBack = false;
                    // that.setData({
                    //     courseSchedule: res.data.result
                    // });
                    // app.saveStorage("courseSchedule", res.data.result);
                    //处理课程数据
                    if(util.isEmpty(res.data.result)) {
                        that.setData({
                            noData: true
                        })
                    }else{
                        that.handleCourseData(res.data.result);
                    }
                } else {
                    that.setData({
                        noData: true
                    });
                    toastMsg = "查询失败，请稍后重试";
                }
            },
            fail: function (res) {
                toastMsg = "请求失败，请稍后重试";
            },
            complete: function (res) {
                if (failed) {
                    app.showToast(toastMsg, false);
                }
                if (navigateBack) {
                    app.navigateBack();
                }
            }
        })
    },

    //处理课程数据
    handleCourseData: function (courseSchedule) {
        var that = this;
        var courseDataArray = that.data.courses;

        for (var i = 0; i < 7; i++) {//星期
            for (var j = 0; j < 5; j++) {//节数
                var currentCourse = courseSchedule[i][j];

                //拼接显示内容
                if (currentCourse.courseName != null) {

                    //处理是否处于活跃状态（周数在index.js中查询）
                    if (app.globalData.currentWeek >= currentCourse.startWeek && app.globalData.currentWeek <= currentCourse.endWeek) {
                        var active = false;
                        if (currentCourse.classType == 0) {
                            active = true;
                        } else if (currentCourse.classType == 1) {
                            active = app.globalData.currentWeek % 2 == 0 ? false : true;
                        } else if (currentCourse.classType = 2) {
                            active = app.globalData.currentWeek % 2 == 0 ? true : false;
                        }
                        currentCourse.active = active;
                    } else {
                        currentCourse.active = false;
                    }

                    // 处理课程显示名称（名称长度超过9位截断，中间部分用...代替，少于6位在末尾多加换行，显示三行，保证column高度一致）
                    if (currentCourse.courseName.length > 9) {
                        currentCourse.courseName = currentCourse.courseName.substring(0, 5) + "..." +
                            currentCourse.courseName.substring(currentCourse.courseName.length - 2, currentCourse.courseName.length);
                    } else if (currentCourse.courseName.length < 5) {
                        currentCourse.courseName = currentCourse.courseName + "\n";
                    }

                    // 处理教师名称（长度超过3位截断，中间部分用...代替，长度固定为3位，显示一行）
                    if (currentCourse.teacher.length > 3) {
                        currentCourse.teacher = currentCourse.teacher.substring(0, 1) + "..." +
                            currentCourse.teacher.substring(currentCourse.teacher.length - 1, currentCourse.teacher.length);
                    }

                    // 处理教学地点显示（长度超过6位截断，中间部分用...代替，保留后三位，少于三位换行，长度固定为6位，显示两行）
                    if (currentCourse.classroom.length > 6) {
                        currentCourse.classroom = currentCourse.classroom.substring(0, 2) + "..." +
                            currentCourse.classroom.substring(currentCourse.classroom.length - 3, currentCourse.classroom.length);
                    }
                    else if (currentCourse.classroom.length < 4) {
                        currentCourse.classroom = "\n" + currentCourse.classroom;
                    }

                    //拼接显示内容
                    currentCourse.displayContent = currentCourse.courseName + "\n" + currentCourse.startWeek + "-" + currentCourse.endWeek + "\n" + currentCourse.teacher + "\n" + currentCourse.classroom + "\n";

                    //添加背景色
                    if (currentCourse.active) {
                        currentCourse.bgColor = that.getBgColor();
                    } else {
                        currentCourse.bgColor = "#c7c7c7";
                    }

                } else {
                    //没课时显示空白，保证column高度一致
                    currentCourse.displayContent = '\n\n\n\n\n\n';
                    currentCourse.bgColor = "#EBEBEB";
                }

                courseSchedule[i][j] = currentCourse;
                that.setData({
                    courseSchedule: courseSchedule
                });
            }
        }

        that.setData({
            courses: courseDataArray,
            loading: false,
            noData: false
        });
        app.hideLoading();
    },

    //为课程添加随机背景色
    getBgColor: function () {
        var that = this;
        var colors = ['#66CCCC', '#FF99CC', '#FF99CC', '#FFCC99', '#FF6666',
            '#99CC66', '#99CC33', '#66CCCC', '#FF6666', '#FF9966', '#FF6600'];

        //产生0-10之间的随机数
        var index = Math.floor(Math.random() * 10);
        return colors[index];
    }
})