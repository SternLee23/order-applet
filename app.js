// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    wx.cloud.init({
      env:'cloud1-3geyoggd96af2f04'
    })

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
  globalData: {
    userInfo: null
  }
})
