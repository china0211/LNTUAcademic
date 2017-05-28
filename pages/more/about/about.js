var app = getApp();
Page({
    data: {
        showLog: false,
        year: null,
        version: '0.0.1',
        versionType: '开发版',
    },
    onLoad: function(options) {
        app.mta.Page.init();
        var that = this;
        that.setData({
            year: new Date().getFullYear()
        })
    },
    toggleLog: function() {
        var that = this
        this.setData({
            showLog: !that.data.showLog
        })
    },
    setClipboardData:function(e){
      app.setClipboardData(e.currentTarget.dataset.qqgroup);
    }
})