var app = getApp();
Page({
    data: {
        studentNo: app.globalData.studentNo,
        queryType: '',
        academicYears: ['2014秋', '2015春', '2015秋', '2016春', '2016秋', '2017春', '2017秋'],
        yearAndSeason: '请选择学年学期',
        currentFilterText: '请选择学年学期',
        filterData: [],  //筛选条件数据
        showFilter: false, //是否显示下拉筛选
        showFilterIndex: null, //显示哪个筛选类目
        filterIndex: 0,  //一级分类索引
        filterId: null,  //一级分类id
        subFilterIndex: 0, //二级分类索引
        subFilterId: null //二级分类id
    },
    onLoad: function (options) {
        this.fetchFilterData();
        app.mta.Page.init();
    },
    fetchFilterData: function () {
        this.setData({
            filterData: [
                {
                    "id": 1,
                    "title": "学年学期",
                    "subFilterData": [
                        {
                            "id": 11,
                            "title": "2015秋"
                        },
                        {
                            "id": 12,
                            "title": "2016春"
                        },
                        {
                            "id": 13,
                            "title": "2016秋"
                        },
                        {
                            "id": 14,
                            "title": "2017春"
                        },
                        {
                            "id": 15,
                            "title": "2017秋"
                        }
                    ]
                },
                {
                    "id": 2,
                    "title": "其他",
                    "subFilterData": [
                        {
                            "id": 21,
                            "title": "未通过课程"
                        },
                        {
                            "id": 22,
                            "title": "学分绩"
                        }
                    ]
                }
            ]
        })
    },
    //查询成绩
    queryExamScore: function () {
        var that = this;
        if (that.data.yearAndSeason != null && that.data.yearAndSeason != "请选择学年学期") {
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
                    Authorization: app.globalData.wxGlobalToken,
                    username: that.data.studentNo
                },
                success: function (res) {
                    if (res.data.message == "success") {
                        failed = false;
                        that.setData({
                            examScores: res.data.result
                        })
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
                Authorization: app.globalData.wxGlobalToken
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
    setFilterPanel: function (e) { //展开筛选面板
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
    setFilterData: function (e) { //分类一级索引
        var that = this;
        var dataSet = e.currentTarget.dataset;
        this.setData({
            filterIndex: dataSet.filterindex,
            filterId: dataSet.filterid,
            subFilterIndex: that.data.filterIndex == dataSet.filterindex ? that.data.subFilterIndex : 0
        });
    },
    setSubFilterIndex: function (e) { //分类二级索引
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
    hideFilter: function () { //关闭筛选面板
        this.setData({
            showFilter: false,
            showFilterIndex: null
        })
    },
    //查看成绩详情
    viewExamScoreDetail: function (e) {
        app.currentExamScore = e.currentTarget.dataset.examscore;
        app.navigateToPage("/pages/module/exam/examScoreDetail/examScoreDetail")
    }
});