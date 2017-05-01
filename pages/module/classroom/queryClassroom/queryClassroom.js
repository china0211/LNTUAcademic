var app = getApp();
Page({
    data: {
        campuses: ["校本部", "校本部（北）", "葫芦岛校区"],
        mainBuildings: ["博雅楼", "物理实验室", "新华楼", "知行楼", "致远楼", "中和楼", "主楼机房"],
        northBuildings: ["育龙主楼", "育龙实验室", "育龙二号实验室", "14秋临时"],
        hldBuildings: ["尔雅楼", "耘慧楼", "静远楼", "物理实验室", "葫芦岛机房"],
        weeks: ["第1周", "第2周", "第3周", "第4周", "第5周", "第6周", "第7周", "第8周", "第9周", "第10周",
            "第11周", "第12周", "第13周", "第14周", "第15周", "第16周", "第17周", "第18周", "第19周", "第20周"],
        days: ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
        selecetedCampus: "请选择校区",
        selecetedBuilding: "请选择教学楼",
        selecetedWeek: "请选择周（可选）",
        selecetedDay: "请选择星期（可选）",
        currentBuildings: "请选择校区",
        isCampusSelected: false
    },
    onLoad: function (options) {
        app.mta.Page.init();
    },
    chooseCampus: function (e) {
        var that = this;
        that.setData({
            selecetedCampus: that.data.campuses[e.detail.value],
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
            selecetedBuilding: that.data.currentBuildings[e.detail.value]
        })
    },
    chooseWeek: function (e) {
        var that = this;
        that.setData({
            selecetedWeek: that.data.weeks[e.detail.value]
        })
    },
    chooseDay: function (e) {
        var that = this;
        that.setData({
            selecetedDay: that.data.days[e.detail.value]
        })
    },
    //查询教室信息
    queryClassroom: function (e) {
        var that = this;
        var quryType = "CURRENT_DATE";
        var sendRequest = true;
        var toastMsg = '';
        var failed = true;
        var navigateBack = true;
        if (that.validateCampusAndBuilding()) {
            if (e.currentTarget.dataset.type == "SELECTED_DATE") {
                quryType = "SELECTED_DATE";
                if (!that.validateWeekAndDay()) {
                    sendRequest = false;
                }
            }
            if (sendRequest) {
                app.showLoading();
                wx.request({
                    url: app.globalData.queryClassroomUrl,
                    data: {
                        queryType: quryType,
                        campus: that.data.selecetedCampus,
                        building: that.data.selecetedBuilding,
                        week: that.data.selecetedWeek,
                        day: that.data.selecetedDay,
                    },
                    method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                    header: {
                        Authorization: app.globalData.wxGlobalToken
                    },
                    success: function (res) {
                        console.log(res)
                        if (res.data.status == "success") {
                            failed = false;
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
                            app.currentClassroomsTitle = that.data.selecetedBuilding;
                            app.navigateToPage("/pages/module/classroom/classroomDetail/classroomDetail");
                        }
                    }
                })
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

})