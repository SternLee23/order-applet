// pages/food/food.js
const db = wx.cloud.database()
let searchKey = ''
let searchKey2 = {}
Page({
  data: {
    isHiddMask: true,
    foodList: [],
    op: {
      searchKey: ''
    },
    totalMoney: 0,
    totalNum: 0,
    cartList: []
  },
  onLoad(options) {
    console.log(options)
    // 如果是搜索进来的  有搜索词 // 调用pushList方法把首页搜索结果数据渲染到页面
    if (options.searchKey) {
      this.pushList(options);
    } else {
      // 说明是通过点击菜品浏览按钮进来的 就给searchKey赋空制值传进去，列表就会显示所有菜品
      this.pushList(this.data.op);
      // 把导航栏字改为“菜品列表页”
      wx.setNavigationBarTitle({
        title: '菜品列表页',
      })
    }
    // 获取购物车缓存数据  如果cart有数据就赋值给cartList 没有的话就把空数组赋值
    let cartList = wx.getStorageSync('cart') || []
    console.log('缓存数据', cartList)
    this.setData({
      cartList
    })
  },
  // 渲染首页搜索结果数据到页面
  pushList(options) {
    let cartList = this.data.cartList
    let searchKey = options.searchKey
    db.collection('food').where({
        // 模糊搜索
        name: db.RegExp({
          regexp: searchKey,
          // regexp: "",
          options: 'i' //不区分大小写
        })
      }).get()
      .then(res => {
        if (res.data.length == 0) {
          console.log(res.data, '没有搜索到')
          wx.showToast({
            icon: 'none',
            title: '没有该菜品哦！',
          })
        } else {
          // console.log(res.data, '搜索到了')
          // 循环数组每一项，// 给list每一项多加一个属性num，用于后面购物车功能使用
          res.data.forEach(item => {
            item.num = 0
            if (cartList && cartList.length > 0) {
              // 查询购物车数组里面是否存在当前点击的菜品
              let result = cartList.find(cart => {
                return cart._id == item._id
              })
              if (result) {
                item.num = result.num
              } else {
                item.num = 0
              }
            } else {
              item.num = 0
            }
          })
          this.setData({
            foodList: res.data,
          })
          this.getTotal()
        }
      })
      .catch(res => {
        console.log(res, '没有搜索到')
      })
  },
  // 获取用户输入数据
  getInput(e) {
    // console.log(e.detail.value)
    searchKey2.searchKey = e.detail.value
    console.log(searchKey2.searchKey)
  },
  // pages/home/home.js
  // 用户点击搜搜按钮，触发搜索事件
  goSearch() {
    // console.log('点击了搜索', searchKey)
    // 判断用户是否在输入框输入了内容
    if (searchKey2.searchKey) {
      // 搜索触发事件
      this.pushList(searchKey2);
    } else {
      wx.showToast({
        icon: 'none',
        title: '请输入菜品',
      })
    }
  },
  // 加操作
  // 需要传入商品id，才知道是加了哪个商品22+168+325+161
  jia(e) {
    let list = this.data.foodList
    let cartList = this.data.cartList
    let id = e.currentTarget.dataset.id
    // console.log('点击了加', e.currentTarget.dataset.id)
    // 循环数组每一项，找到对应id的商品
    list.forEach(item => {
      // 当id相等  给该id对应的商品 num + 1
      if (item._id == id) {
        item.num += 1
        // this.data.cartList.push(item)
        if (cartList && cartList.length > 0) {
          // 查询购物车数组里面是否存在当前点击的菜品
          var result = cartList.find(cart => {
            return cart._id == id
          })
          // console.log("当前点击的菜品在购物车吗？", result)
          if (!result) { //如果点击的菜品不在购物车，直接添加
            cartList.push(item)
          }
        } else {
          cartList.push(item)
        }
        // console.log('遍历后的数组++++', cartList)
      }
      this.setData({
        foodList: list,
        cartList,
      })
      this.getTotal()
    })
    // 把购物车数据缓存到本地存储
    wx.setStorageSync('cart', cartList)
  },
  // 减操作
  jian(e) {
    let list = this.data.foodList
    let cartList = this.data.cartList
    let id = e.currentTarget.dataset.id
    // console.log('点击了加', e.currentTarget.dataset.id)
    // 循环数组每一项，找到对应id的商品
    list.forEach(item => {
      // 当id相等  给该id对应的商品 num - 1
      if (item._id == id) {
        if (item.num > 0) {
          item.num -= 1
          // 查询购物车数组里面是否存在当前点击的菜品 
          var index = cartList.findIndex(cart => {
            return cart._id == id;
          })
          if (index > -1) {
            cartList[index].num = item.num
          }
          if (item.num == 0) { //如果点击的菜品在购物车的数量为0，就移除
            cartList.splice(index, 1) //删除下标为index 的元素 1代表删除从下标开始的一个元素
          }
        } else {
          wx.showToast({
            icon: 'none',
            title: '数量不能小于0',
          })
        }
      }
      this.setData({
        foodList: list,
        cartList,
      })
      this.getTotal()
    })
    // 把购物车数据缓存到本地存储
    wx.setStorageSync('cart', cartList)
  },
  // 计算总价格和总数量
  getTotal() {
    let cartList = this.data.cartList
    let totalMoney = 0
    let totalNum = 0
    cartList.forEach(item => {
      totalNum += item.num
      totalMoney += item.num * item.price
    })
    this.setData({
      totalMoney,
      totalNum
    })
  },
  // 点击购物车图标打开蒙层
  openMask() {
    this.setData({
      isHiddMask: false
    })
  },
  // 关闭购物车蒙层
  closeMask() {
    this.setData({
      isHiddMask: true
    })
  },
  //清空购物车
  clearCart() {
    wx.setStorageSync('cart', null)
    let foodList = this.data.foodList
    foodList.forEach(item => {
      item.num = 0
    })
    this.setData({
      foodList,
      cartList: [],
      totalMoney: 0,
      totalNum: 0
    })
  },

  //下单
  takeOrder() {
    console.log(this.data.foodList)
    console.log(this.data.cartList)
    console.log(wx.getStorageSync('user'))
    let ordernum = Math.random().toString(36)
    wx.setStorageSync('orderNum', ordernum)
    this.data.cartList.forEach(item => {
      db.collection('order').add({
        data: {
          nickName: wx.getStorageSync('user').nickName,
          foodName: item.name,
          num: item.num,
          orderNum: ordernum
        },
        success: function(res) {
          console.log(res)
        }
      })
    })
    this.clearCart()
  },

  // 删除购物车里的一条数据
  closeCartItem(e) {
    console.log(e.currentTarget.dataset.index)
    let index = e.currentTarget.dataset.index
    let cartList = this.data.cartList
    let cart = cartList[index]
    // 遍历菜品列表，把要删除的菜品数量置为零
    let foodList = this.data.foodList
    foodList.forEach(item => {
      if (item._id == cart._id) {
        item.num = 0
      }
    })
    // 从购物车数组里删除当前菜品
    cartList.splice(index, 1)
    this.setData({
      cartList,
      foodList
    })
    // 重新计算总价格
    this.getTotal()
    // 把更新后的数据重新缓存
    wx.setStorageSync('cart', cartList)
  }
})