// pages/home/home.js
const db = wx.cloud.database()
let searchKey = ''
Page({
  data: {
    swiper: [],
    foodList: [],
    scanCodeResult: '扫码',
  },

  onLoad() {
    // 从数据库获取轮播图
    this.getSwiper()

    // 获取热门推荐菜品列表
    this.getHotList()

  },

  // 获取用户输入数据
  getInput(e) {
    // console.log(e.detail.value)
    searchKey = e.detail.value
  },

  // pages/home/home.js
  // 用户点击搜搜按钮，触发搜索事件
  goSearch() {

    // console.log('点击了搜索', searchKey)
    // 判断用户是否在输入框输入了内容
    if (searchKey && searchKey.length > 0) {
      // 搜索触发事件
      // 携带搜索参数跳转到food页面进行搜索并显示搜索结果
      wx.navigateTo({
        url: '/pages/food/food?searchKey=' + searchKey,
      })
    } else {
      wx.showToast({
        icon: 'none',
        title: '请输入菜品',
      })
    }
  },
  // 点击事件,去菜品分类页
  click1() {
    wx.navigateTo({
      url: '/pages/food2/food2',
    })
  },
  //扫码事件
  scanCodeEvent: function() {
    var that = this;
    wx.scanCode({
      onlyFromCamera: true,
      success(res) {
        console.log("扫码成功：" + JSON.stringify(res))
        console.log(res.result)
        that.setData({
          scanCodeResult: res.result
        })
        wx.navigateTo({
          url: res.result
        })
      }
    })
  },
  // 点击事件,去菜品列表页
  click2() {
    wx.navigateTo({
      url: '/pages/food/food' 
    })
  },

  // 点击事件,去关于我们页
  click4() {
    wx.navigateTo({
      url: '/pages/address/address',
    })
  },
  //获取轮播图方法
  getSwiper() {
    wx.cloud.callFunction({
        name: "getSwiper",
      })
      // db.collection('swiper').get()
      .then(res => {
        // console.log(res.result.data, '获取成功')
        this.setData({
          swiper: res.result.data
        })
      })
      .catch(res => {
        // console.log(res, '获取失败')
        // 获取失败或者网络断开就显示本地图片到轮播图
        this.setData({
          swiper: [{
              img: '../../images/bendi-1.jpg'
            },
            {
              img: '../../images/bendi-2.jpg'
            }
          ]
        })
      })
  },
  // 获取热门推荐菜品列表
  getHotList() {
    //  1. 小程序直接查询数据库

    //   db.collection('food')
    //     .where({
    //       status: '上架' 
    //     })
    //     .orderBy('sell', 'desc') 
    //     .limit(5) 
    //     .get()
    //     .then(res => {
    //       console.log(res, '获取热门菜品列表ok')

    //     })
    //     .catch(res => {
    //       console.log(res, '获取热门菜品列表失败')
    //     })


    //  2. 通过云函数查询数据库

    wx.cloud.callFunction({
        name: 'getFoodList' //云函数的名称
      })
      .then(res => {
        // console.log(res.result.data, '获取热门菜品列表ok')
        this.setData({
          foodList: res.result.data
        })
      })
      .catch(res => {
        console.log(res, '获取热门菜品列表失败')
      })

  }
})