// pages/me/me.js
Page({
  data: {
    userInfo: ''
  },
  onLoad() {
    // 加载页面之后把用户数据从缓存取出渲染到页面
    let user= wx.getStorageSync('user')
    // console.log(user)
    this.setData({
      userInfo: user
    })
  },
  // 授权获取用户信息
  getUserInfo(e) {
    wx.getUserProfile({
      desc: '必须授权才可以继续',
      success: res => {
        // 授权成功之后把用户信息存入本地缓存
        wx.setStorageSync('user', res.userInfo)//同步存入
        this.setData({
          userInfo: res.userInfo
        })
      },
      fail: res => {
        // console.log('授权', res)
      }
    })
  },
  // 退出登录
  logOut(){
    this.setData({
      userInfo:''
    })
    wx.setStorageSync('user', null)//清除缓存数据
  },
  //跳转我的订单
  toMyOrder(){
    wx.navigateTo({
      url: '/pages/myOrder/myOrder',
    })
  }

})