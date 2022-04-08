// pages/address/address.js
Page({
  // 页面默认商家信息
  data: {
    address: "山东省威海市环翠区怡园街道文化西路二号",
    phone: "0631-5687002",
    weixin: "15684551706",
    // 标记点
    markers: [{
      id: 0,
      name: '智能手机应用',
      address: '哈尔滨工业大学（威海）',
      latitude: 37.5378,
      longitude: 122.083507,
      width: 100,
      height: 100
    }]
  },
  onLoad() {
    // 页面加载从数据库调用商家信息显示到页面
    this.getInfo();
  },
  // 点击标记点完成导航
  clickMap(e) {
    let marker = e.currentTarget.dataset.marker
    // 获取自己的位置
    wx.getLocation({ //getLocation需要在app.json中声明permission才可以使用
      type: 'wgs84',
      success(res) {
        // 目的地位置
        // console.log(res)
        wx.openLocation({
          latitude: marker.latitude,
          longitude: marker.longitude,
          name: marker.name,
          address: marker.address,
          scale: 18
        })
      },
      fail(res) {
        wx.showModal({
          cancelColor: 'cancelColor',
          title: '需要授权',
          content: '需要位置授权，才可以实现导航，点击去设置就可以开启位置授权',
          confirmText: "去设置",
          success(res) {
            if (res.confirm) {
              wx.openSetting({
                withSubscriptions: true,
              })
            }
          }
        })
      }
    })
  },
  //拨打电话
  callPhone(e) {

    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone,
      success(res) {
        // console.log(res,'打了')
      },
      fail(res) {
        // console.log(res,'没打')

      }
    })
  },
  // 复制微信号
  copyWechat(e) {

    wx.setClipboardData({
      data: e.currentTarget.dataset.weixin
    })
  },
  // 云函数调用商家信息（商家电话。。。商家位置坐标等）
  getInfo() {
    wx.cloud.callFunction({
        name: 'getInfo'
      })
      .then(res => {
        // console.log(res.result.data[0],'info查询成功')
        let data = res.result.data[0]
        this.setData({
          address: data.address,
          phone: data.phone,
          weixin: data.weixin,
          markers: [{
            id: 0,
            name: data.address,
            address: data.zuobiaoname,
            latitude: data.jindu,
            longitude: data.weidu,
            width: 100,
            height: 100
          }]
        })
      })
      .catch(res => {
        // console.log(res,'info查询失败')
      })
  }
})