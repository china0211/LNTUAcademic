var app = getApp();
Page({
  data: {
    //校区
    campuses: [{ location_name: "校本部", location_id: 1 },
    { location_name: "校本部（北）", location_id: 2 },
    { location_name: "葫芦岛校区", location_id: 3 }],
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
    app.mta.Page.init();
  },
  chooseCampus: function (e) {
    var that = this;
    that.setData({
      selecetedBuilding: "请选择教学楼",
      selecteed_building_id: ""
    }),
      that.setData({
        selecetedCampus: that.data.campuses[e.detail.value].location_name,
        selecteed_location_id: that.data.campuses[e.detail.value].location_id,
        isCampusSelected: true
      })
    if (e.detail.value == 0) {
      that.setData({
        currentBuildings: that.data.mainBuildings
      })
    } else if (e.detail.value == 1) {
      that.setData({
        currentBuildings: that.data.northBuildings
      })
    } else {
      that.setData({
        currentBuildings: that.data.hldBuildings
      })
    }
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
    var quryType = "CURRENT_DATE";
    var sendRequest = true;

    //校验校区和教学楼
    if (that.validateCampusAndBuilding()) {
      //判断查询类型，查询今日自动获取时间
      if (e.currentTarget.dataset.type == "CURRENT_DATE") {
        //查询日期后查询教室信息
        that.setWeekAndDay();
      } else if (that.validateWeekAndDay()) {
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
    var successed = true;

    wx.request({
      url: app.globalData.getCurrentWeekAndDayUrl,
      data: {},
      method: 'GET',
      header: {
        Authorization: app.globalData.wxGlobalToken
      },
      success: function (res) {
        if (res.data.status == "success") {
          that.setData({
            selecteed_week: res.data.result.currentWeek,
            selecteed_day: res.data.result.currentDay,
            selecetedWeek: that.data.weeks[res.data.result.currentWeek - 1].week_name,
            selecetedDay: that.data.days[res.data.result.currentDay - 1].day_name,
          })
          successed = true;
        }
      },
      fail: function (res) {
      },
      complete: function (res) {
        if (successed) {
          that.getClssroomInfo();
        } else {
          app.showMsgModal("未查询到教室信息");
        }
      }
    })
  },
  //查询教室信息
  getClssroomInfo: function () {
    var that = this;
    var toastMsg = '';
    var failed = true;
    var navigateBack = true;
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
      }
    })
  }
})