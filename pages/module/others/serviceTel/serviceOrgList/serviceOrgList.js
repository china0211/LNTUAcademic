var app = getApp();
var util = require('../../../../../utils/util.js');
Page({
    data: {
        organizationServiceTelephone: [],
        currentTels: null,
        searchResultVisible: false,
        inputShowed: false,
        inputVal: "",
        loading: true,
        noData: false
    },
    onLoad: function (options) {
        var that = this;
        that.getServiceTelephoneFromStorage();
        app.mta.Page.init();
    },
    getServiceTelephoneFromStorage: function () {
        var that = this;
        wx.getStorage({
            key: 'organizationServiceTelephone',
            success: function (res) {
                that.setData({
                    organizationServiceTelephone: res.data,
                    noData: false,
                    loading: false
                })
            },
            fail: function (res) {
                that.getServiceTelephone();
            },
            complete: function (res) {

            }
        })
    },
    getServiceTelephone: function () {
        var that = this;
        var toastMsg = '';
        var failed = true;
        app.showLoading();
        wx.request({
            url: app.globalData.organizationServiceTelephoneUrl,
            data: {},
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
                            organizationServiceTelephone: res.data.result,
                            noData: false
                        });
                        app.saveStorage("organizationServiceTelephone", res.data.result);
                    }
                } else {
                    that.setData({
                        noData: true
                    });
                    toastMsg = "获取服务电话失败，请稍后重试";
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
                    app.navigateBack();
                }
            }
        })
    },
    viewTelDetail: function (e) {
        app.organizationName = e.currentTarget.dataset.organizationname;
        app.serviceTelephoneList = e.currentTarget.dataset.servicetelephonelist;
        app.navigateToPage("/pages/module/others/serviceTel/serviceTelDetail/serviceTelDetail");
    },
    // 查询框处理事件
    showInput: function () {
        this.setData({
            inputShowed: true
        });
    },
    hideInput: function () {
        this.setData({
            inputVal: "",
            inputShowed: false,
            currentTels: null,
            searchResultVisible: false
        });
    },
    clearInput: function () {
        this.setData({
            inputVal: ""
        });
    },
    //查询电话
    inputOrgs: function (e) {
        var that = this;
        // 输入内容
        var searchValue = e.detail.value;
        var organizationServiceTelephone = that.data.organizationServiceTelephone;
        if (searchValue.length > 0) {
            //查询结果
            var searchResult = [];
            for (var i = 0; i < organizationServiceTelephone.length; i++) {
                var serviceTelephoneList = organizationServiceTelephone[i].serviceTelephoneList;
                for (var j = 0; j < serviceTelephoneList.length; j++) {
                    //拼接组织和部门电话
                    var telephoneDetail = {};
                    telephoneDetail.name = organizationServiceTelephone[i].name + " " + serviceTelephoneList[j].name;
                    telephoneDetail.telephone = serviceTelephoneList[j].telephone;
                    if (telephoneDetail.name.indexOf(searchValue) > -1 || telephoneDetail.telephone.indexOf(searchValue) > -1) {
                        searchResult.push(telephoneDetail);
                    }
                }
            }

            if (searchResult.length > 0) {
                that.setData({
                    currentTels: searchResult,
                    searchResultVisible: true
                })
            } else {
                that.setData({
                    currentTels: null,
                    searchResultVisible: true
                })
            }
        } else {
            that.setData({
                currentTels: null,
                searchResultVisible: false
            })
        }
    },
    // 拨打电话
    callTel: function (e) {
        var that = this;
        wx.showModal({
            content: '是否拨打' + e.currentTarget.dataset.name
            + "电话:\n" + e.currentTarget.dataset.telephone,
            success: function (res) {
                if (res.confirm) {
                    //拨打电话
                    wx.makePhoneCall({
                        phoneNumber: e.currentTarget.dataset.telephone
                    })
                }
            }
        })
    }
});