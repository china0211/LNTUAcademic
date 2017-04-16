var app = getApp();
Page({
  data:{
    examScoreDetail:null
  },
  onLoad:function(options){
    var that = this;
    that.setData({
      examScoreDetail:app.currentExamScore
    })
    wx.setNavigationBarTitle({
      title: that.data.examScoreDetail.courseName
    })
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})