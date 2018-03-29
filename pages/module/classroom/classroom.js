var app = getApp();
var util = require('../../../utils/util.js');
Page({
    data: {
        classrooms: null,
        //校本部教学楼
        mainBuildings: [
            {buildingName: "新华楼", buildingId: 4},
            {buildingName: "博雅楼", buildingId: 5},
            {buildingName: "主楼机房", buildingId: 8},
            {buildingName: "物理实验室", buildingId: 10},
            {buildingName: "中和楼", buildingId: 12},
            {buildingName: "知行楼", buildingId: 15},
            {buildingName: "致远楼", buildingId: 16}],
        //北校区教学楼
        northBuildings: [
            {buildingName: "育龙主楼", buildingId: 1913},
            {buildingName: "育龙实验室", buildingId: 2023},
            {buildingName: "育龙二号实验室", buildingId: 2437}],
        //葫芦岛教学楼
        hldBuildings: [
            {buildingName: "尔雅楼", buildingId: 6},
            {buildingName: "耘慧楼", buildingId: 7},
            {buildingName: "葫芦岛机房", buildingId: 9},
            {buildingName: "物理实验室", buildingId: 11},
            {buildingName: "静远楼", buildingId: 14}],

        currentBuilding: "教学楼",
        currentTime: "时间",
        filterData: {},
        showFilter: false,
        showFilterIndex: null,
        campusIndex: 0,
        campusId: null,
        buildingIndex: 0,
        buildingId: null,
        weekAndDayIndex: 0,
        weekAndDayId: 1,
        subWeekAndDayIndex: 0,
        subWeekAndDayId: 1,
        loading: true,
        noData: false
    },
    onLoad: function (options) {
        var that = this;
        that.fetchFilterData();
        that.setWeekAndDay();
        that.getDefaultCampusAndCampus();
        app.mta.Page.init();
    },
    //获取默认的校区(上次选择)
    getDefaultCampusAndCampus: function () {
        var that = this;
        var fail = true;
        wx.getStorage({
            key: 'buildingInfo',
            success: function (res) {
                var currentBuilding = that.data.filterData.campus[res.data.campusIndex].subFilterData[res.data.buildingIndex].title;
                that.setData({
                    campusId: res.data.campusId,
                    campusIndex: res.data.campusIndex,
                    buildingId: res.data.buildingId,
                    buildingIndex: res.data.buildingIndex,
                    currentBuilding: currentBuilding
                });
                fail = false;
            },
            complete: function (res) {
                if (!fail) {
                    that.getClassroomInfo();
                }
            }
        })
    },
    //校验校区和教学楼选择
    validateCampusAndBuilding: function () {
        var that = this;
        if (that.data.campusId == null) {
            app.showMsgModal("请选择校区");
            return false;
        } else if (that.data.buildingId == null) {
            app.showMsgModal("请选择教学楼");
            return false;
        } else {
            return true;
        }
    },
    //校验时间
    validateWeekAndDay: function () {
        var that = this;
        if (that.data.weekAndDayId == undefined || that.data.weekAndDayId == null || that.data.weekAndDayId == "") {
            app.showMsgModal("请选择周");
            return false;
        } else if (that.data.subWeekAndDayId == undefined || that.data.subWeekAndDayId == null || that.data.subWeekAndDayId == "") {
            app.showMsgModal("请选择星期");
            return false;
        } else {
            return true;
        }
    },
    //设置当日week和day
    setWeekAndDay: function () {
        var that = this;
        var currentWeek = that.data.filterData.weekAndDay[app.globalData.currentWeek - 1].title;
        var currentDay = that.data.filterData.weekAndDay[app.globalData.currentWeek - 1].subFilterData[app.globalData.currentDay - 1].title;
        that.setData({
            weekAndDayId: app.globalData.currentWeek,
            weekAndDayIndex: app.globalData.currentWeek - 1,
            subWeekAndDayId: app.globalData.currentDay,
            subWeekAndDayIndex: app.globalData.currentDay - 1,
            currentTime: currentWeek + " " + currentDay
        });
    },
    //查询教室信息
    getClassroomInfo: function () {
        var that = this;

        if (!that.validateCampusAndBuilding() || !that.validateWeekAndDay()) {
            return false;
        }
        that.setData({
            loading: true,
            noData: false,
            classrooms: null
        });

        var toastMsg = '';
        var failed = true;
        var buildingInfo = {};

        app.showLoading();
        wx.request({
            url: app.globalData.classroomOccupyUrl,
            data: {
                buildingNo: that.data.buildingId,
                week: that.data.weekAndDayId,
                day: that.data.subWeekAndDayId
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
                            classrooms: res.data.result,
                            noData: false
                        })
                    }
                }
                else {
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
                    app.showToast(toastMsg, false);
                }
                //MTA统计
                app.mta.Event.stat('classroom_plan', {'campus': that.data.filterData.campus[that.data.campusIndex].title});
                app.mta.Event.stat('classroom_plan', {'building': that.data.currentBuilding});
            }
        });

        buildingInfo.campusId = that.data.campusId;
        buildingInfo.campusIndex = that.data.campusIndex;
        buildingInfo.buildingId = that.data.buildingId;
        buildingInfo.buildingIndex = that.data.buildingIndex;
        app.saveStorage("buildingInfo", buildingInfo);
    },

    //获取筛选条件
    fetchFilterData: function () {
        var that = this;

        var campus = [];
        // 主校区
        var mainCampus = {};
        mainCampus.id = 11;
        mainCampus.title = "校本部";
        var mainCampusSubFilterData = [];
        for (var i = 0; i < that.data.mainBuildings.length; i++) {
            var building = {};
            building.id = that.data.mainBuildings[i].buildingId;
            building.title = that.data.mainBuildings[i].buildingName;
            mainCampusSubFilterData.push(building);
        }
        mainCampus.subFilterData = mainCampusSubFilterData;
        campus.push(mainCampus);

        // 北校区
        var northCampus = {};
        northCampus.id = 12;
        northCampus.title = "校本部(北)";
        var northCampusSubFilterData = [];
        for (var i = 0; i < that.data.northBuildings.length; i++) {
            var building = {};
            building.id = that.data.northBuildings[i].buildingId;
            building.title = that.data.northBuildings[i].buildingName;
            northCampusSubFilterData.push(building);
        }
        northCampus.subFilterData = northCampusSubFilterData;
        campus.push(northCampus);

        // 葫芦岛
        var hldCampus = {};
        hldCampus.id = 13;
        hldCampus.title = "葫芦岛";
        var hldCampusSubFilterData = [];
        for (var i = 0; i < that.data.hldBuildings.length; i++) {
            var building = {};
            building.id = that.data.hldBuildings[i].buildingId;
            building.title = that.data.hldBuildings[i].buildingName;
            hldCampusSubFilterData.push(building);
        }
        hldCampus.subFilterData = hldCampusSubFilterData;
        campus.push(hldCampus);

        // 周
        var weekAndDay = [];
        var dayDisplay = ['一', '二', '三', '四', '五', '六', '日'];

        for (var i = 1; i <= 20; i++) {
            var week = {};
            week.id = i;
            week.title = "第" + i + "周";
            var weekSubFilterData = [];

            // 日
            for (var j = 0; j < 7; j++) {
                var day = {};
                day.id = j + 1;
                day.title = "星期" + dayDisplay[j];
                weekSubFilterData.push(day);
            }
            week.subFilterData = weekSubFilterData;
            weekAndDay.push(week);
        }

        var filterData = {};
        filterData.campus = campus;
        filterData.weekAndDay = weekAndDay;

        this.setData({
            filterData: filterData
        });
    },
    //展开筛选面板
    setFilterPanel: function (e) {
        var that = this;
        var filterPanelIndex = e.currentTarget.dataset.filterpanelindex;
        if (that.data.showFilterIndex == filterPanelIndex) {
            this.setData({
                showFilter: false,
                showFilterIndex: null
            })
        } else {
            this.setData({
                showFilter: true,
                showFilterIndex: filterPanelIndex
            })
        }
    },
    //校区 一级索引
    setCampusIndex: function (e) {
        var that = this;
        var dataSet = e.currentTarget.dataset;
        this.setData({
            campusIndex: dataSet.campusindex,
            campusId: dataSet.campusid,
            buildingIndex: that.data.campusIndex == dataSet.campusIndex ? that.data.buildingIndex : 0
        });
    },
    //教学楼 二级索引
    setBuildingIndex: function (e) {
        var that = this;
        var dataSet = e.currentTarget.dataset;
        this.setData({
            currentBuilding: that.data.filterData.campus[that.data.campusIndex].subFilterData[dataSet.buildingindex].title,
            buildingIndex: dataSet.buildingindex,
            buildingId: dataSet.buildingid,
            showFilterIndex: 2
        });
        that.hideFilter();
        that.getClassroomInfo();
    },
    //周 一级索引
    setWeekAndDayIndex: function (e) {
        var that = this;
        var dataSet = e.currentTarget.dataset;
        this.setData({
            weekAndDayIndex: dataSet.weekanddayindex,
            weekAndDayId: dataSet.weekanddayid,
            subWeekAndDayIndex: that.data.weekAndDayIndex == dataSet.weekAndDayIndex ? that.data.subWeekAndDayIndex : 0
        });
    },
    //日 二级索引
    setSubWeekAndDayIndex: function (e) {
        var that = this;
        var dataSet = e.currentTarget.dataset;
        var currentWeek = that.data.filterData.weekAndDay[that.data.weekAndDayIndex].title;
        var currentDay = that.data.filterData.weekAndDay[that.data.weekAndDayIndex].subFilterData[dataSet.subweekanddayindex].title;
        this.setData({
            currentTime: currentWeek + " " + currentDay,
            subWeekAndDayIndex: dataSet.subweekanddayindex,
            subWeekAndDayId: dataSet.subweekanddayid
        });
        that.hideFilter();
        that.getClassroomInfo();
    },
    //关闭筛选面板
    hideFilter: function () {
        this.setData({
            showFilter: false,
            showFilterIndex: null
        })
    }
});