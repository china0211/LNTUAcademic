var app = getApp();
Page({
  data: {
    days:['一','二','三','四','五','六','七'],
    courses: [
      [[], [], [], [], []],
      [[], [], [], [], []],
      [[], [], [], [], []],
      [[], [], [], [], []],
      [[], [], [], [], []],
      [[], [], [], [], []],
      [[], [], [], [], []]
    ],

  },
  onLoad: function (options) {
    var that = this;
    app.mta.Page.init();
    app.validateStuId();

    // 获取课程表信息
    that.getCourseData();
  },

  // 获取课程表信息
  getCourseData: function () {
    var that = this;
    var toastMsg = '';
    var failed = true;
    var navigateBack = true;
    app.showLoading();
    wx.request({
      url: app.globalData.queryCourseScheduleUrl,
      data: {},
      method: 'GET',
      header: {
        Authorization: app.globalData.authorization,
        username: app.globalData.stuId
      },
      success: function (res) {
        if (res.data.message == "请求成功") {
          failed = false;
          navigateBack = false;
          that.setData({
            courseSchedule: res.data.info
          });
          app.saveStorage("courseSchedule", res.data.info);
          //处理课程数据
          that.handleCourseData(res.data.info);
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
          app.showToast(toastMsg, false);
        }
        if (navigateBack) {
          app.navigateBack();
        }
      }
    })
  },

  //处理课程数据
  handleCourseData: function (courseData) {
    var that = this;
    var courseDataArray = that.data.courses;

    for (var i = 0; i < 7; i++) {//星期
      for (var j = 0; j < 5; j++) {//节数
        var currentCourse = courseData[i + 1][j + 1];

        //拼接显示内容
        if (currentCourse.name != "none") {

          //课程起始周数(包含单双周情况)
          var weeks = null;
          if (currentCourse.weeks.indexOf('单') > 0) {
            weeks = currentCourse.weeks.split('单')[0];
            currentCourse.weekType = '单';
          }
          else if (currentCourse.weeks.indexOf('双') > 0) {
            weeks = currentCourse.weeks.split('双')[0];
            currentCourse.weekType = '双';
          } else {
            weeks = currentCourse.weeks;
            currentCourse.weekType = 'All'
          }

          currentCourse.startWeek = weeks.split('-')[0];
          currentCourse.endWeek = weeks.split('-')[1];

          //处理是否处于活跃状态（周数在index.js中查询）
          if (app.globalData.currentWeek >= currentCourse.startWeek && app.globalData.currentWeek <= currentCourse.endWeek) {
            var isAcative = false;
            if (currentCourse.weekType == 'All') {
              isAcative = true;
            } else if (currentCourse.weekType == '单') {
              isAcative = app.globalData.currentWeek % 2 == 0 ? false : true;
            } else if (currentCourse.weekType = '双') {
              isAcative = app.globalData.currentWeek % 2 == 0 ? true : false;
            }
            currentCourse.isActive = isAcative;
          } else {
            currentCourse.isActive = false;
          }

          //处理课程显示名称（名称长度超过9位截断，中间部分用...代替，少于6位在末尾多加换行，显示三行，保证column高度一致）
          if (currentCourse.name.length > 9) {
            currentCourse.name = currentCourse.name.substring(0, 5) + "..." +
              currentCourse.name.substring(currentCourse.name.length - 2, currentCourse.name.length);
          } else if (currentCourse.name.length < 6) {
            currentCourse.name = currentCourse.name + "\n";
          } else if (currentCourse.name.indexOf('（') > 0 && currentCourse.name.length < 8) {
            //处理带有（）的课程名称
            currentCourse.name = currentCourse.name.replace('（', '(');
            currentCourse.name = currentCourse.name.replace('）', ')');
            currentCourse.name = currentCourse.name + "\n";
          }

          //处理教师名称（长度超过3位截断，中间部分用...代替，长度固定为3位，显示一行）
          if (currentCourse.teacher.length > 3) {
            currentCourse.teacher = currentCourse.teacher.substring(0, 1) + "..." +
              currentCourse.teacher.substring(currentCourse.teacher.length - 1, currentCourse.teacher.length);
          }

          // 处理教学地点显示（长度超过6位截断，中间部分用...代替，保留后三位，少于三位换行，长度固定为6位，显示两行）
          if (currentCourse.location.length > 6) {
            currentCourse.location = currentCourse.location.substring(0, 2) + "..." +
              currentCourse.location.substring(currentCourse.location.length - 3, currentCourse.location.length);
          }
          else if (currentCourse.location.length < 4) {
            currentCourse.location = "\n" + currentCourse.location;
          }

          //拼接显示内容
          currentCourse.displayContent = currentCourse.name + "\n" + currentCourse.weeks + "\n" + currentCourse.teacher + "\n" + currentCourse.location;

          //添加背景色
          if (currentCourse.isActive) {
            currentCourse.bgColor = that.getBgColor();
          } else {
            currentCourse.bgColor = "#c7c7c7";
          }

        } else {
          //没课时显示空白，保证column高度一致
          currentCourse.displayContent = '\n\n\n\n\n\n';
          currentCourse.bgColor = "#EBEBEB";
        }

        courseDataArray[i][j] = currentCourse;
      }
    }

    that.setData({
      courses: courseDataArray
    })
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