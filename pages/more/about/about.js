var app = getApp();
Page({
    data: {
        showLog: false,
        year: null,
        version: '',
        versionType: ''
    },
    onLoad: function(options) {
        app.mta.Page.init();
        var that = this;
        that.setData({
            year: new Date().getFullYear(),
            version:app.globalData.version,
            versionType:app.globalData.versionType
        })
    },
    toggleLog: function() {
        var that = this;
        this.setData({
            showLog: !that.data.showLog
        })
    },
    setClipboardData:function(e){
      app.setClipboardData(e.currentTarget.dataset.qqgroup);
    }
})