var app = getApp();
var util = require('../../../../utils/util.js');

Page({
    data: {
        announcementDetail: null,
        accessories: null
    },
    onLoad: function (options) {
        app.mta.Page.init();
        var that = this;
        var accessories = app.announcementDetail.announcementAccessoryList;
        if (!util.isEmpty(accessories)) {
            for (var i = 0; i < accessories.length; i++) {
                if (accessories[i].accessoryUrl.indexOf("pdf") > -1) {
                    accessories[i].type = "pdf";
                } else if (accessories[i].accessoryUrl.indexOf("doc") > -1) {
                    accessories[i].type = "doc";
                } else if (accessories[i].accessoryUrl.indexOf("ppt") > -1) {
                    accessories[i].type = "ppt";
                } else if (accessories[i].accessoryUrl.indexOf("xls") > -1) {
                    accessories[i].type = "xls";
                } else if (accessories[i].accessoryUrl.indexOf("zip") > -1 ||
                    accessories[i].accessoryUrl.indexOf("rar") > -1) {
                    accessories[i].type = "zip";
                } else if (accessories[i].accessoryUrl.indexOf("png") > -1 ||
                    accessories[i].accessoryUrl.indexOf("jpg") > -1 ||
                    accessories[i].accessoryUrl.indexOf("gif") > -1 ||
                    accessories[i].accessoryUrl.indexOf("jpeg") > -1) {
                    accessories[i].type = "pic";
                } else {
                    accessories[i].type = "doc";
                }
                accessories[i].statusIcon = "download";
                accessories[i].c = 0;
            }
        }
        that.setData({
            announcementDetail: app.announcementDetail,
            accessories: accessories
        })
    },

    downloadAccessory: function (e) {
        var that = this;
        var accessory = e.currentTarget.dataset.accessory;
        var index = e.currentTarget.dataset.index;
        app.showLoading("下载中...");
        wx.downloadFile({
            url: accessory.accessoryUrl,
            success: function (res) {
                if (res.statusCode === 200) {
                    var accessories = that.data.accessories;
                    for (var i = 0; i < that.data.accessories.length; i++) {
                        if (i === index) {
                            accessories[index].statusIcon = "success";
                            accessories[index].process = 100;
                        }
                    }
                    that.setData({
                        accessories: accessories
                    });

                    var filePath = res.tempFilePath;

                    if (accessory.type == "doc" || accessory.type == "xls" ||
                        accessory.type == "ppt" || accessory.type == "pdf") {
                        wx.openDocument({
                            filePath: filePath
                        });
                    } else if (accessory.type == "pic") {
                        console.log(filePath);
                        wx.previewImage({
                            current: accessory.accessoryUrl,
                            urls: [accessory.accessoryUrl]
                        })
                    }

                    wx.saveFile({
                        tempFilePath: filePath,
                        success: function (res) {
                            var savedFilePath = res.savedFilePath;
                        }
                    });
                }
            },
            complete: function (res) {
                app.hideLoading();
            }
        });
    }
});