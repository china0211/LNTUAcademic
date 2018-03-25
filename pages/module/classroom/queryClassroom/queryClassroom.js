var app = getApp();
Page({
    data: {
        //校区
        campuses: [{location_name: "校本部", location_id: 1},
            {location_name: "校本部(北)", location_id: 2},
            {location_name: "葫芦岛", location_id: 3}],
        //校本部教学楼
        mainBuildings: [
            {building_name: "新华楼", building_id: 4},
            {building_name: "博雅楼", building_id: 5},
            {building_name: "主楼机房", building_id: 8},
            {building_name: "物理实验室", building_id: 10},
            {building_name: "中和楼", building_id: 12},
            {building_name: "知行楼", building_id: 15},
            {building_name: "致远楼", building_id: 16}],
        //北校区教学楼
        northBuildings: [
            {building_name: "育龙主楼", building_id: 1913},
            {building_name: "育龙实验室", building_id: 2023},
            {building_name: "育龙二号实验室", building_id: 2437}],
        //葫芦岛教学楼
        hldBuildings: [
            {building_name: "尔雅楼", building_id: 6},
            {building_name: "耘慧楼", building_id: 7},
            {building_name: "葫芦岛机房", building_id: 9},
            {building_name: "物理实验室", building_id: 11},
            {building_name: "静远楼", building_id: 14}],
        //周
        weeks: [{week_name: "第1周", week_id: 1},
            {week_name: "第2周", week_id: 2},
            {week_name: "第3周", week_id: 3},
            {week_name: "第4周", week_id: 4},
            {week_name: "第5周", week_id: 5},
            {week_name: "第6周", week_id: 6},
            {week_name: "第7周", week_id: 7},
            {week_name: "第8周", week_id: 8},
            {week_name: "第9周", week_id: 9},
            {week_name: "第10周", week_id: 10},
            {week_name: "第11周", week_id: 11},
            {week_name: "第12周", week_id: 12},
            {week_name: "第13周", week_id: 13},
            {week_name: "第14周", week_id: 14},
            {week_name: "第15周", week_id: 15},
            {week_name: "第16周", week_id: 16},
            {week_name: "第17周", week_id: 17},
            {week_name: "第18周", week_id: 18},
            {week_name: "第19周", week_id: 19},
            {week_name: "第20周", week_id: 20}],
        //星期
        days: [{day_name: "星期一", day_id: 1},
            {day_name: "星期二", day_id: 2},
            {day_name: "星期三", day_id: 3},
            {day_name: "星期四", day_id: 4},
            {day_name: "星期五", day_id: 5},
            {day_name: "星期六", day_id: 6},
            {day_name: "星期日", day_id: 7}],

        selectCampus: "请选择校区",
        select_location_id: '',
        selectBuilding: "请选择教学楼",
        select_building_id: '',
        selectWeek: "请选择周(可选)",
        select_week: '',
        selectDay: "请选择星期(可选)",
        select_day: '',
        currentBuildings: "请选择校区",
        isCampusSelect: false
    },
    onLoad: function (options) {
        var that = this;
        that.setWeekAndDay();
        that.getDefaultCampus();
        app.mta.Page.init();
    },
    //获取默认的校区(上次选择)
    getDefaultCampus: function () {
        var that = this;
        var campusIndex = null;
        var fail = true;
        wx.getStorage({
            key: 'defaultCampus',
            success: function (res) {
                that.setData({
                    select_location_id: res.data
                })
                campusIndex = res.data - 1;
                fail = false;
                that.getDefaultBuilding();
            },
            complete: function (res) {
                if (!fail) {
                    that.chooseLocation(campusIndex);
                }
            }
        })
    },
    //获取默认的教学楼(上次选择)
    getDefaultBuilding: function () {
        var that = this;
        var buildingIndex = null;
        var fail = true;
        wx.getStorage({
            key: 'defaultBuilding',
            success: function (res) {
                that.setData({
                    select_building_id: res.data
                })
                fail = false;
                buildingIndex = res.data;
            },
            complete: function (res) {
                if (!fail) {
                    that.chooseCurrentBuilding(buildingIndex);
                }
            }
        })
    },
    //选择校区
    chooseLocation: function (index) {
        var that = this;
        if (index == 0 || index == 1 || index == 2) {
            // that.setData({
            //     selectBuilding: "请选择教学楼",
            //     select_building_id: ""
            // })
            that.setData({
                selectCampus: that.data.campuses[index].location_name,
                select_location_id: that.data.campuses[index].location_id,
                isCampusSelect: true
            })
            if (index == 0) {
                that.setData({
                    currentBuildings: that.data.mainBuildings
                })
            } else if (index == 1) {
                that.setData({
                    currentBuildings: that.data.northBuildings
                })
            } else {
                that.setData({
                    currentBuildings: that.data.hldBuildings
                })
            }
            // 默认选中第一个教学楼
            that.setData({
                selectBuilding: that.data.currentBuildings[0].building_name,
                select_building_id: that.data.currentBuildings[0].building_id
            })
        }
    },
    //选择教学楼
    chooseCurrentBuilding: function (buildingIndex) {
        var that = this;
        //将Object转换为Array
        for (var key in that.data.currentBuildings) {
            //key是属性,object[key]是值
            if (that.data.currentBuildings[key].building_id == buildingIndex) {
                that.setData({
                    selectBuilding: that.data.currentBuildings[key].building_name,
                    select_building_id: that.data.currentBuildings[key].building_id
                })
            }
        }

    },
    //选择校区
    chooseCampus: function (e) {
        var that = this;
        that.chooseLocation(e.detail.value);
    },
    validateBuilding: function () {
        var that = this;
        if (that.data.selectCampus == "请选择校区") {
            app.showMsgModal("请先选择校区");
        }
    },
    //选择教学楼
    chooseBuilding: function (e) {
        var that = this;
        var index = e.detail.value;
        that.setData({
            selectBuilding: that.data.currentBuildings[index].building_name,
            select_building_id: that.data.currentBuildings[index].building_id
        })
    },
    chooseWeek: function (e) {
        var that = this;
        that.setData({
            selectWeek: that.data.weeks[e.detail.value].week_name,
            select_week: that.data.weeks[e.detail.value].week_id
        })
    },
    chooseDay: function (e) {
        var that = this;
        that.setData({
            selectDay: that.data.days[e.detail.value].day_name,
            select_day: that.data.days[e.detail.value].day_id
        })
    },
    //查询教室信息
    queryClassroom: function (e) {
        var that = this;

        //校验校区和教学楼
        if (that.validateCampusAndBuilding()) {
            //校验时间
            if (that.validateWeekAndDay()) {
                that.getClassroomInfo();
            }
        }
    },
    //校验校区和教学楼选择
    validateCampusAndBuilding: function () {
        var that = this;
        if (that.data.selectCampus == "请选择校区") {
            app.showMsgModal("请选择校区");
            return false;
        } else if (that.data.selectBuilding == "请选择教学楼") {
            app.showMsgModal("请选择教学楼");
            return false;
        } else {
            return true;
        }
    },
    //校验校区和教学楼选择
    validateWeekAndDay: function () {
        var that = this;
        if (that.data.selectWeek == "请选择周(可选)") {
            app.showMsgModal("请选择周");
            return false;
        } else if (that.data.selectDay == "请选择星期(可选)") {
            app.showMsgModal("请选择星期");
            return false;
        } else {
            return true;
        }
    },
    //设置当日week和day
    setWeekAndDay: function () {
        var that = this;
        var toastMsg = '';

        that.setData({
            select_week: app.globalData.currentWeek,
            select_day: app.globalData.currentDay,
            selectWeek: that.data.weeks[app.globalData.currentWeek - 1].week_name,
            selectDay: that.data.days[app.globalData.currentDay - 1].day_name
        })
    },
    //查询教室信息
    getClassroomInfo: function () {
        var that = this;
        var toastMsg = '';
        var failed = true;
        app.saveStorage("defaultCampus", that.data.select_location_id);
        app.saveStorage("defaultBuilding", that.data.select_building_id);
        app.showLoading();
        wx.request({
            url: app.globalData.classroomOccupyUrl,
            data: {
                buildingNo: that.data.select_building_id,
                week: that.data.select_week,
                day: that.data.select_day
            },
            method: 'GET',
            header: {
                Authorization: app.globalData.wxGlobalToken
            },
            success: function (res) {
                if (res.data.message == "success") {
                    failed = false;
                    //处理数据
                    app.currentClassrooms = res.data.result;
                }
                else {
                    toastMsg = "查询失败，请稍后重试";
                }
            },
            fail: function (res) {
                toastMsg = "请求失败，请稍后重试";
            },
            complete: function (res) {
                app.hideLoading();
                if (failed) {
                    app.showToast(toastMsg, false);
                } else {
                    app.currentClassroomsTitle = that.data.selectBuilding;
                    app.navigateToPage("/pages/module/classroom/classroomDetail/classroomDetail");
                }
                //MTA统计
                app.mta.Event.stat('classroom_plan', {'campus': that.data.selectCampus});
                app.mta.Event.stat('classroom_plan', {'building': that.data.selectBuilding});
            }
        })
    }
});