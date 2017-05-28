var app = getApp();
Page({
  data: {
    //校区
    campuses: [{ location_name: "校本部", location_id: 1 },
    { location_name: "校本部（北）", location_id: 2 },
    { location_name: "葫芦岛", location_id: 3 }],
    //校本部教学楼
    mainBuildings: [
      { building_name: "新华楼", building_id: 4 },
      { building_name: "博雅楼", building_id: 5 },
      { building_name: "主楼机房", building_id: 8 },
      { building_name: "物理实验室", building_id: 10 },
      { building_name: "中和楼", building_id: 12 },
      { building_name: "知行楼", building_id: 15 },
      { building_name: "致远楼", building_id: 16 }],
    //北校区教学楼
    northBuildings: [
      { building_name: "育龙主楼", building_id: 1913 },
      { building_name: "育龙实验室", building_id: 2023 },
      { building_name: "育龙二号实验室", building_id: 2437 }],
    //葫芦岛教学楼
    hldBuildings: [
      { building_name: "尔雅楼", building_id: 6 },
      { building_name: "耘慧楼", building_id: 7 },
      { building_name: "葫芦岛机房", building_id: 9 },
      { building_name: "物理实验室", building_id: 11 },
      { building_name: "静远楼", building_id: 14 }],
    //周
    weeks: [{ week_name: "第1周", week_id: 1 },
    { week_name: "第2周", week_id: 2 },
    { week_name: "第3周", week_id: 3 },
    { week_name: "第4周", week_id: 4 },
    { week_name: "第5周", week_id: 5 },
    { week_name: "第6周", week_id: 6 },
    { week_name: "第7周", week_id: 7 },
    { week_name: "第8周", week_id: 8 },
    { week_name: "第9周", week_id: 9 },
    { week_name: "第10周", week_id: 10 },
    { week_name: "第11周", week_id: 11 },
    { week_name: "第12周", week_id: 12 },
    { week_name: "第13周", week_id: 13 },
    { week_name: "第14周", week_id: 14 },
    { week_name: "第15周", week_id: 15 },
    { week_name: "第16周", week_id: 16 },
    { week_name: "第17周", week_id: 17 },
    { week_name: "第18周", week_id: 18 },
    { week_name: "第19周", week_id: 19 },
    { week_name: "第20周", week_id: 20 }],
    //星期
    days: [{ day_name: "星期一", day_id: 1 },
    { day_name: "星期二", day_id: 2 },
    { day_name: "星期三", day_id: 3 },
    { day_name: "星期四", day_id: 4 },
    { day_name: "星期五", day_id: 5 },
    { day_name: "星期六", day_id: 6 },
    { day_name: "星期日", day_id: 7 }],

    selecetedCampus: "请选择校区",
    selecteed_location_id: '',
    selecetedBuilding: "请选择教学楼",
    selecteed_building_id: '',
    selecetedWeek: "请选择周（可选）",
    selecteed_week: '',
    selecetedDay: "请选择星期（可选）",
    selecteed_day: '',
    currentBuildings: "请选择校区",
    isCampusSelected: false
  },
  onLoad: function (options) {
    var that = this;
    that.getDefaultCampus();
    that.setWeekAndDay();
    app.mta.Page.init();
  },
  //获取默认的校区
  getDefaultCampus: function () {
    var that = this;
    var index = null;
    wx.getStorage({
      key: 'defaultCampus',
      success: function (res) {
        that.setData({
          selecteed_location_id: res.data,
        }),
          index = res.data - 1;
      },
      complete: function (res) {
        that.chooseLocation(index);
      }
    })
  },
  //选择校区
  chooseLocation: function (index) {
    var that = this;
    if (index == 0 || index == 1 || index == 2) {
      that.setData({
        selecetedBuilding: "请选择教学楼",
        selecteed_building_id: ""
      }),
        that.setData({
          selecetedCampus: that.data.campuses[index].location_name,
          selecteed_location_id: that.data.campuses[index].location_id,
          isCampusSelected: true
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
    }
  },
  //选择校区
  chooseCampus: function (e) {
    var that = this;
    that.chooseLocation(e.detail.value);
  },
  validateBuilding: function () {
    var that = this;
    if (that.data.selecetedCampus == "请选择校区") {
      app.showMsgModal("请先选择校区");
    }
  },
  chooseBuilding: function (e) {
    var that = this;
    that.setData({
      selecetedBuilding: that.data.currentBuildings[e.detail.value].building_name,
      selecteed_building_id: that.data.currentBuildings[e.detail.value].building_id
    })
  },
  chooseWeek: function (e) {
    var that = this;
    that.setData({
      selecetedWeek: that.data.weeks[e.detail.value].week_name,
      selecteed_week: that.data.weeks[e.detail.value].week_id,
    })
  },
  chooseDay: function (e) {
    var that = this;
    that.setData({
      selecetedDay: that.data.days[e.detail.value].day_name,
      selecteed_day: that.data.days[e.detail.value].day_id,
    })
  },
  //查询教室信息
  queryClassroom: function (e) {
    var that = this;

    //校验校区和教学楼
    if (that.validateCampusAndBuilding()) {
      //校验时间
      if (that.validateWeekAndDay()) {
        that.getClssroomInfo();
      }
    }
  },
  //校验校区和教学楼选择
  validateCampusAndBuilding: function () {
    var that = this;
    if (that.data.selecetedCampus == "请选择校区") {
      app.showMsgModal("请选择校区");
      return false;
    } else if (that.data.selecetedBuilding == "请选择教学楼") {
      app.showMsgModal("请选择教学楼");
      return false;
    } else {
      return true;
    }
  },
  //校验校区和教学楼选择
  validateWeekAndDay: function () {
    var that = this;
    if (that.data.selecetedWeek == "请选择周（可选）") {
      app.showMsgModal("请选择周");
      return false;
    } else if (that.data.selecetedDay == "请选择星期（可选）") {
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
      selecteed_week: app.globalData.currentWeek,
      selecteed_day: app.globalData.currentDay,
      selecetedWeek: that.data.weeks[app.globalData.currentWeek - 1].week_name,
      selecetedDay: that.data.days[app.globalData.currentDay - 1].day_name,
    })
  },
  //查询教室信息
  getClssroomInfo: function () {
    var that = this;
    var toastMsg = '';
    var failed = true;
    var navigateBack = true;
    app.saveStorage("defaultCampus", that.data.selecteed_location_id);
    app.showLoading();
    wx.request({
      url: app.globalData.queryClassroomUrl,
      data: {
        location_id: that.data.selecteed_location_id,
        building_id: that.data.selecteed_building_id,
        week: that.data.selecteed_week,
        week_day: that.data.selecteed_day,
      },
      method: 'GET',
      header: {
        Authorization: app.globalData.wxGlobalToken
      },
      success: function (res) {
        if (res.data != null) {
          failed = false;
          app.currentClassrooms = res.data.results;
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
          app.currentClassroomsTitle = that.data.selecetedBuilding;
          app.navigateToPage("/pages/module/classroom/classroomDetail/classroomDetail");
        }
        //MTA统计
        app.mta.Event.stat('classroom_plan', { 'campus': that.data.selecetedCampus });
        app.mta.Event.stat('classroom_plan', { 'building': that.data.selecetedBuilding });
      }
    })
  }
})