// pages/myOrder/myOrder.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let nick = wx.getStorageSync('user').nickName
    let order = wx.getStorageSync('orderNum')
    console.log(nick)
    console.log(order)
    db.collection('order').where({
      nickName: nick,
      orderNum: order
    })
    .get()
    .then(res => {
      if(res.data.length == 0){
        console.log(res.data, '没有搜索到订单')
        wx.showToast({
          icon: 'none',
          title: '没有搜索到订单',
        })
      } else {
        this.setData({
          orderList: res.data
        })
        console.log(this.data.orderList)
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})