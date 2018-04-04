var app = getApp();
var util = require("../../../../../utils/util.js");
Page({
    data: {
        yearAndSeason: '',
        educationPlans: '',
        loading: true,
        noData: false,
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
        var that = this;
        that.fetchFilterData();
        that.getEducationPlanFromStorage();
        app.mta.Page.init();
    },
    onReady: function () {
        // 页面渲染完成
    },
    onShow: function () {
        // 页面显示
    },
    onHide: function () {
        // 页面隐藏
    },
    onUnload: function () {
        // 页面关闭
    },
    getEducationPlanFromStorage: function () {
        var that = this;
        var educationPlanStorage = "educationPlan:" + that.data.yearAndSeason;
        wx.getStorage({
            key: educationPlanStorage,
            success: function (res) {
                that.setData({
                    noData: false,
                    loading: false,
                    educationPlans: res.data
                })
            },
            fail: function (res) {
                that.queryEducationPlan();
            },
            complete: function (res) {
            }
        });
    },
    //查询教学计划
    queryEducationPlan: function () {
        var that = this;
        var toastMsg = '';
        var failed = true;
        var educationPlanStorage = "educationPlan:" + that.data.yearAndSeason;

        app.showLoading('正在查询', true);
        wx.request({
            url: app.globalData.courseStudyScheduleUrl.concat(app.globalData.studentNo),
            data: {
                yearAndSeason: that.data.yearAndSeason
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
                            noData: false,
                            educationPlans: res.data.result
                        });
                        app.saveStorage(educationPlanStorage, that.data.educationPlans);
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
            }
        })
    },
    viewEducationPlanDetail: function (e) {
        app.currentCourse = e.currentTarget.dataset.examscore;
        app.navigateToPage("/pages/module/others/educationPlan/educationPlanDetail/educationPlanDetail")
    },
    fetchFilterData: function () {
        var filterData = [];

        var yearAndSeasonFilterId = 1;
        for (var i = 1; i <= 4; i++) {
            var yearAndSeason = {};
            yearAndSeason.id = yearAndSeasonFilterId++;
            yearAndSeason.title = "第" + i + "学年";

            var full = {};
            full.id = 0;
            full.title = "秋季学期";
            full.value = i + "秋";
            full.displayValue = yearAndSeason.title + full.title;

            var spring = {};
            spring.id = 0;
            spring.title = "春季学期";
            spring.value = i + "春";
            spring.displayValue = yearAndSeason.title + spring.title;

            var subFilterData = [];
            subFilterData.push(full);
            subFilterData.push(spring);

            yearAndSeason.subFilterData = subFilterData;

            filterData.push(yearAndSeason);
        }

        var startYear = Number("20".concat(app.globalData.studentNo.substr(0, 2)));
        var endYear = app.globalData.currentYear;
        var yearDiff = endYear - startYear;
        // 首年秋季学期
        if (yearDiff == 0) {
            yearDiff = 1;
        }
        var currentFilterText = "第" + yearDiff + "学年";
        var yearAndSeason = yearDiff;

        // 当前月份大于2月且小于8月时查询本学年春季学期
        if (app.globalData.currentMonth > 2 && app.globalData.currentMonth < 8) {
            currentFilterText += " 春季学期";
            yearAndSeason += "春";
        } else {
            // 其他时间为秋季学期
            currentFilterText += " 秋季学期";
            yearAndSeason += "秋";
        }

        this.setData({
            filterData: filterData,
            currentFilterText: currentFilterText,
            yearAndSeason: yearAndSeason
        });
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
        that.setData({
            subFilterIndex: dataSet.subfilterindex,
            subFilterId: dataSet.subfilterid
        });
        var currentFilterText = that.data.filterData[that.data.filterIndex].title + " " +
            that.data.filterData[that.data.filterIndex].subFilterData[that.data.subFilterIndex].title;
        that.setData({
            currentFilterText: currentFilterText,
            yearAndSeason: that.data.filterData[that.data.filterIndex].subFilterData[that.data.subFilterIndex].value
        });

        that.hideFilter();
        // 查询成绩或绩点
        that.getEducationPlanFromStorage();
    },
    //关闭筛选面板
    hideFilter: function () {
        this.setData({
            showFilter: false,
            showFilterIndex: null
        })
    }
});