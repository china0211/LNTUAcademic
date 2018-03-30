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
        if (util.isEmpty(accessory.savedFilePath)) {
            app.showLoading("下载中...");
            wx.downloadFile({
                url: accessory.accessoryUrl,
                success: function (res) {
                    if (res.statusCode === 200) {
                        var accessories = that.data.accessories;
                        var savedFilePath = res.tempFilePath;
                        wx.saveFile({
                            tempFilePath: savedFilePath,
                            success: function (res) {
                                savedFilePath = res.savedFilePath
                            },
                            complete: function (res) {
                                for (var i = 0; i < that.data.accessories.length; i++) {
                                    if (i === index) {
                                        accessory.statusIcon = "success";
                                        accessory.savedFilePath = savedFilePath;
                                        accessories[index] = accessory;
                                    }
                                }
                                that.setData({
                                    accessories: accessories
                                });
                                that.viewFile(accessory);
                            }
                        });
                    }
                },
                complete: function (res) {
                    app.hideLoading();
                }
            });
        } else {
            that.viewFile(accessory);
        }
    },
    viewFile: function (accessory) {
        if (accessory.type == "doc" || accessory.type == "xls" ||
            accessory.type == "ppt" || accessory.type == "pdf") {
            wx.openDocument({
                filePath: accessory.savedFilePath
            });
        } else if (accessory.type == "pic") {
            wx.previewImage({
                current: accessory.savedFilePath,
                urls: [accessory.savedFilePath]
            })
        }
    }
});