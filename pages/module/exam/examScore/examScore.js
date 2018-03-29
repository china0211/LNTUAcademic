var app = getApp();
var util = require('../../../../utils/util.js');
Page({
    data: {
        queryType: '',
        yearAndSeason: '请选择学年学期',
        currentFilterText: '请选择学年学期',
        filterData: [],  //筛选条件数据
        showFilter: false, //是否显示下拉筛选
        showFilterIndex: null, //显示哪个筛选类目
        filterIndex: 0,  //一级分类索引
        filterId: null,  //一级分类id
        subFilterIndex: 0, //二级分类索引
        subFilterId: null, //二级分类id
        loading: true,
        noData: false
    },
    onLoad: function (options) {
        this.fetchFilterData();
        app.mta.Page.init();
    },
    fetchFilterData: function () {
        var filterData = [];

        var startYear = Number("20".concat(app.globalData.studentNo.substr(0, 2)));
        var endYear = app.globalData.currentYear;
        var yearDiff = endYear - startYear;
        var academicYearSubFilterData = [];
        var academicSubFilterId = 11;
        // 添加学年学期筛选时间
        for (var i = 0; i < yearDiff; i++) {
            var currentYearSpring = new Object();
            currentYearSpring.id = academicSubFilterId++;
            currentYearSpring.title = startYear + i + "春";
            academicYearSubFilterData.push(currentYearSpring);

            var currentYearFull = new Object();
            currentYearFull.id = academicSubFilterId++;
            currentYearFull.title = startYear + i + "秋";
            academicYearSubFilterData.push(currentYearFull);
        }
        // 移除首年秋季学期
        if (academicYearSubFilterData.length > 0) {
            academicYearSubFilterData.splice(0, 1);
        }

        // 当前月份大于2月时添加本学年春季学期
        if (app.globalData.currentMonth > 2) {
            var currentYearSpring = new Object();
            currentYearSpring.id = academicSubFilterId++;
            currentYearSpring.title = app.globalData.currentYear + "春";
            academicYearSubFilterData.push(currentYearSpring);
        }
        // 当前月份大于8月时添加本学年春季学期
        if (app.globalData.currentMonth > 8) {
            var currentYearFull = new Object();
            currentYearFull.id = academicSubFilterId;
            currentYearFull.title = app.globalData.currentYear + "秋";
            academicYearSubFilterData.push(currentYearFull);
        }

        var academicYear = new Object();
        academicYear.id = 1;
        academicYear.title = "学年学期";
        academicYear.subFilterData = academicYearSubFilterData;
        console.log(academicYearSubFilterData);

        // 其他子菜单
        var notPassed = new Object();
        notPassed.id = 21;
        notPassed.title = "未通过课程";

        var gradePoint = new Object();
        gradePoint.id = 22;
        gradePoint.title = "学分绩";

        var othersSubFilterData = [];
        othersSubFilterData.push(notPassed);
        othersSubFilterData.push(gradePoint);

        var others = new Object();
        others.id = 2;
        others.title = "其他";
        others.subFilterData = othersSubFilterData;

        filterData.push(academicYear);
        filterData.push(others);

        this.setData({
            filterData: filterData,
            queryType: 'EXAM_SCORE',
            currentFilterText: academicYearSubFilterData[academicYearSubFilterData.length - 1].title,
            yearAndSeason: academicYearSubFilterData[academicYearSubFilterData.length - 1].title
        });

        this.queryExamScore();
    },
    //查询成绩
    queryExamScore: function () {
        var that = this;
        if (that.data.yearAndSeason != null && that.data.yearAndSeason != "请选择学年学期") {
            that.setData({
                examScores: null,
                noData: true
            });
            var toastMsg = '';
            var failed = true;
            app.showLoading('正在查询', true);
            wx.request({
                url: app.globalData.examUrl.concat(app.globalData.studentNo),
                data: {
                    yearAndSeason: that.data.yearAndSeason,
                    queryType: that.data.queryType
                },
                method: 'GET',
                header: {
                    Authorization: app.globalData.authorization
                },
                success: function (res) {
                    if (res.data.message == "success") {
                        failed = false;
                        if (util.isEmpty(res.data.result)) {
                            that.setData({
                                noData: true
                            })
                        } else {
                            that.setData({
                                examScores: res.data.result,
                                noData: false
                            })
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
                    app.hideLoading();
                    if (failed) {
                        app.showToast(toastMsg, false)
                    }

                    //统计查询事件
                    app.mta.Event.stat('exam_score', {'year': that.data.yearAndSeason});
                    app.mta.Event.stat('exam_score', {'querytype': that.data.queryType});
                }
            })
        } else {
            app.showMsgModal("请选择学年学期");
        }
    },
    //查询绩点
    queryGradePoint: function () {
        var that = this;
        var toastMsg = '';
        var failed = true;
        app.showLoading('正在查询', true);
        wx.request({
            url: app.globalData.gradePointUrl.concat(app.globalData.studentNo),
            method: 'GET',
            header: {
                Authorization: app.globalData.authorization
            },
            success: function (res) {
                if (res.data.message == "success") {
                    failed = false;
                    app.showMsgModal('你当前的学分绩为:' + res.data.result)
                } else {
                    toastMsg = "查询失败，请稍后重试";
                }
            },
            fail: function (res) {
                toastMsg = "请求失败，请稍后重试";
            },
            complete: function (res) {
                app.hideLoading();
                if (failed) {
                    app.showToast(toastMsg, false)
                }

                //MTA统计事件
                app.mta.Event.stat('exam_score', {'querytype': 'credit'});
            }
        })
    },
    //展开筛选面板
    setFilterPanel: function (e) {

        var showFilterIndex = e.currentTarget.dataset.filterindex;
        if (this.data.showFilterIndex == showFilterIndex) {
            this.setData({
                showFilter: false,
                showFilterIndex: null
            })
        } else {
            this.setData({
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
            subFilterIndex: that.data.filterIndex == dataSet.filterindex ? that.data.subFilterIndex : 0
        });
    },
    //分类二级索引
    setSubFilterIndex: function (e) {
        var that = this;
        var dataSet = e.currentTarget.dataset;
        var queryExamScore = true;
        that.setData({
            subFilterIndex: dataSet.subfilterindex,
            subFilterId: dataSet.subfilterid
        });
        var currentFilterText = that.data.filterData[that.data.filterIndex].subFilterData[that.data.subFilterIndex].title;
        that.setData({
            currentFilterText: currentFilterText,
            yearAndSeason: currentFilterText
        });
        // 学年学期查询
        if (that.data.filterIndex == 0) {
            that.setData({
                queryType: 'EXAM_SCORE'
            })
        } else {
            if (that.data.subFilterIndex == 0) {
                that.setData({
                    queryType: 'NOT_PASSED'
                })
            } else {
                queryExamScore = false;
            }
        }

        that.hideFilter();
        // 查询成绩或绩点
        if (queryExamScore) {
            that.queryExamScore();
        } else {
            that.queryGradePoint();
        }
    },
    //关闭筛选面板
    hideFilter: function () {
        this.setData({
            showFilter: false,
            showFilterIndex: null
        })
    },
    //查看成绩详情
    viewExamScoreDetail: function (e) {
        app.currentExamScore = e.currentTarget.dataset.examscore;
        app.navigateToPage("/pages/module/exam/examScoreDetail/examScoreDetail")
    },
    preventTouchMove: function () {
        console.log("move")
    }
});