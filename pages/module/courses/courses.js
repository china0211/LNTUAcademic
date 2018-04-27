var app = getApp();
var util = require("../../../utils/util.js");
Page({
    data: {
        loading: true,
        noData: false,
        days: ['一', '二', '三', '四', '五', '六', '七'],
        colors: ['#66CCCC', '#FF99CC', '#FFCC99', '#FF8866', '#99CC66', '#FFB760', '#FF6666', '#FF9966'],
        originCourseSchedule: null,
        selectWeek: 1,
        courseSchedule: [
            [[], [], [], [], []],
            [[], [], [], [], []],
            [[], [], [], [], []],
            [[], [], [], [], []],
            [[], [], [], [], []],
            [[], [], [], [], []],
            [[], [], [], [], []]
        ],
        currentFilterText: '请选择周',
        filterData: [],  //筛选条件数据
        showFilter: false, //是否显示下拉筛选
        showFilterIndex: null, //显示哪个筛选类目
        filterIndex: 0,  //一级分类索引
        filterId: null  //一级分类id
    },
    onLoad: function (options) {
        var that = this;
        that.setData({
            selectWeek: app.globalData.currentWeek
        });
        that.fetchFilterData();
        that.getCourseDataFromStorage(that.data.selectWeek);
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
                    //处理课程数据
                    if (util.isEmpty(res.data.result)) {
                        that.setData({
                            noData: true
                        })
                    } else {
                        that.handleCourseData(res.data.result, that.data.selectWeek);
                        that.setData({
                            originCourseSchedule: res.data.result
                        });
                        app.saveStorage("originCourseSchedule", res.data.result);
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
                that.setData({
                    loading: false
                });
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
    handleCourseData: function (courseSchedule, selectWeek) {
        var that = this;
        for (var i = 0; i < 7; i++) {//星期
            for (var j = 0; j < 5; j++) {//节数
                var currentCourse = courseSchedule[i][j];
                //拼接显示内容
                if (currentCourse.courseName != null) {
                    //处理是否处于活跃状态（周数在index.js中查询）
                    if (selectWeek >= currentCourse.startWeek && selectWeek <= currentCourse.endWeek) {
                        var active = false;
                        currentCourse.displayEndWeek = currentCourse.endWeek;
                        if (currentCourse.classType == 0) {
                            active = true;
                        } else if (currentCourse.classType == 1) {
                            active = selectWeek % 2 == 0 ? false : true;
                            currentCourse.displayEndWeek = currentCourse.displayEndWeek + "单";
                        } else if (currentCourse.classType = 2) {
                            active = selectWeek % 2 == 0 ? true : false;
                            currentCourse.displayEndWeek = currentCourse.displayEndWeek + "双";
                        }
                        currentCourse.active = active;
                    } else {
                        currentCourse.active = false;
                    }

                    // 处理课程显示名称（名称长度超过8位截断，中间部分用...代替，少于6位在末尾多加换行，显示三行，保证column高度一致）
                    currentCourse.disPlayCourseName = currentCourse.courseName;
                    if (currentCourse.disPlayCourseName.length > 8) {
                        currentCourse.disPlayCourseName = currentCourse.disPlayCourseName.substring(0, 5) + "..." +
                            currentCourse.disPlayCourseName.substring(currentCourse.disPlayCourseName.length - 2,
                                currentCourse.disPlayCourseName.length);
                    } else if (currentCourse.disPlayCourseName.length < 5) {
                        currentCourse.disPlayCourseName = currentCourse.disPlayCourseName + "\n";
                    }

                    // 处理教师名称（长度超过3位截断，中间部分用...代替，长度固定为3位，显示一行）
                    currentCourse.displayTeacher = currentCourse.teacher;
                    if (currentCourse.displayTeacher.length > 3) {
                        currentCourse.displayTeacher = currentCourse.displayTeacher.substring(0, 1) + "..." +
                            currentCourse.displayTeacher.substring(currentCourse.displayTeacher.length - 1,
                                currentCourse.displayTeacher.length);
                    }

                    // 处理教学地点显示（长度超过6位截断，中间部分用...代替，保留后三位，少于三位换行，长度固定为6位，显示两行）
                    currentCourse.displayClassroom = currentCourse.classroom;
                    if (currentCourse.displayClassroom.length > 6) {
                        currentCourse.displayClassroom = currentCourse.displayClassroom.substring(0, 2) + "..." +
                            currentCourse.displayClassroom.substring(currentCourse.displayClassroom.length - 3,
                                currentCourse.displayClassroom.length);
                    } else if (currentCourse.displayClassroom.length < 4) {
                        currentCourse.displayClassroom = "\n" + currentCourse.displayClassroom;
                    }

                    //拼接显示内容
                    currentCourse.displayContent = currentCourse.disPlayCourseName + "\n" + currentCourse.startWeek +
                        "-" + currentCourse.displayEndWeek + "\n" + currentCourse.displayTeacher + "\n" +
                        currentCourse.displayClassroom + "\n";

                    currentCourse.originContent = currentCourse.courseName + "\n" + currentCourse.startWeek +
                        "-" + currentCourse.endWeek + "\n" + currentCourse.teacher + "\n" + currentCourse.classroom;

                    //添加背景色
                    if (currentCourse.active) {
                        currentCourse.bgColor = that.getBgColor(currentCourse.courseName);
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
            loading: false,
            noData: false
        });
        app.hideLoading();
        app.saveStorage("courseSchedule" + selectWeek, that.data.courseSchedule);
    },

    //为课程添加随机背景色
    getBgColor: function (courseName) {
        var that = this;
        var index = util.getBinarySum(util.getCharBinary(courseName)) % 8;
        return that.data.colors[index];
    },

    getCourseDataFromStorage: function (selectWeek) {
        var that = this;
        wx.getStorage({
            key: 'courseSchedule' + selectWeek,
            success: function (res) {
                if (util.isEmpty(res.data) || app.globalData.currentDay == 1) {
                    that.setData({
                        noData: true
                    });
                    that.getCourseData();
                } else {
                    that.setData({
                        noData: false,
                        loading: false,
                        courseSchedule: res.data
                    });
                }
            },
            fail: function (res) {
                that.getCourseData();
            },
            complete: function (res) {
            }
        });

    },
    viewCourseDetail: function (e) {
        var originContent = e.currentTarget.dataset.origincontent;
        if (!util.isEmpty(originContent)) {
            app.showMsgModal(originContent);
        }
    },
    fetchFilterData: function () {
        var that = this;
        var filterData = [];
        var currentFilterText = "第" + app.globalData.currentWeek + "周";

        for (var i = app.globalData.currentWeek; i <= 20; i++) {
            var week = {};
            week.id = i;
            week.title = "第" + i + "周";
            filterData.push(week);
        }

        for (var j = 1; j < app.globalData.currentWeek; j++) {
            var week = {};
            week.id = j;
            week.title = "第" + j + "周";
            filterData.push(week);
        }

        that.setData({
            filterIndex: app.globalData.currentWeek - 1,
            filterId: app.globalData.currentWeek,
            filterData: filterData,
            currentFilterText: currentFilterText
        });
    },
    //展开筛选面板
    setFilterPanel: function (e) {
        var that = this;
        if (util.isEmpty(that.data.originCourseSchedule)) {
            wx.getStorage({
                key: 'originCourseSchedule',
                success: function (res) {
                    if (util.isEmpty(res.data)) {
                        that.setData({
                            noData: true
                        });
                        that.getCourseData();
                    } else {
                        that.setData({
                            originCourseSchedule: res.data
                        });
                    }
                },
                fail: function (res) {
                    that.getCourseData();
                },
                complete: function (res) {
                }
            });
        }

        var showFilterIndex = e.currentTarget.dataset.filterindex;
        if (that.data.showFilterIndex == showFilterIndex) {
            that.setData({
                showFilter: false,
                showFilterIndex: null
            })
        } else {
            that.setData({
                showFilter: true,
                showFilterIndex: showFilterIndex
            })
        }
    },
    //分类一级索引
    setFilterData: function (e) {
        var that = this;
        var dataSet = e.currentTarget.dataset;
        this.setData({
            filterIndex: dataSet.filterindex,
            filterId: dataSet.filterid,
            currentFilterText: that.data.filterData[dataSet.filterindex].title
        });
        that.handleCourseData(that.data.originCourseSchedule, that.data.filterId);
        that.hideFilter();
    },
    //关闭筛选面板
    hideFilter: function () {
        this.setData({
            showFilter: false,
            showFilterIndex: null
        })
    }
});