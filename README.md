# 云开发扫码点餐小程序

# 1.初始化云开发环境

- 配置project.config.json  指定云开发本地目录路径

![imag-20220408153458021](E:/WebstormProjects/food-master/program/README_files\image-20220408153458021.png)

```json
 "cloudfunctionRoot": "./cloud/",
```

- 初始化云开发本地环境 app.js

![image-20220408153625893](E:/WebstormProjects/food-master/program/README_files\image-20220408153625893.png)

```js
//app.js
App({
  onLaunch: function () {
    wx.cloud.init({
      env: 'cloud1-3geyoggd96af2f04'
    })
  }
})
```

- 保存之后，cloud目录变成云朵形状

![image-20210706235507872](E:/WebstormProjects/food-master/program/README_files/image-20210706235507872.png)

# 3.首页开发home页面

## 	1.轮播图开发

**内容管理平台地址**：[内容管理（CMS） (tcloudbaseapp.com)](https://cloud1-3geyoggd96af2f04-1310954068.tcloudbaseapp.com/wx-cms/#/home)

- 用户名：root
- 密码：ly635294

- 用到小程序组件swiper

![image-20210706230542227](E:/WebstormProjects/food-master/program/README_files/image-20210706230542227.png)

```html
<swiper indicator-dots="{{true}}" autoplay="{{false}}" interval="{{false}}" duration="{{true}}"
  indicator-active-color="#ffbc0d">
  <swiper-item>
    <image src="../../images/food-1.png"></image>
  </swiper-item>
</swiper>
```

- 动态循环获取轮播图数据

  - 利用云开发cms管理系统创建轮播图数据表，并上传轮播图图片

  ![image-20210706235714680](E:/WebstormProjects/food-master/program/README_files/image-20210706235714680.png)

  ![image-20210706235729551](C:/Users/Administrator/Desktop/image-20210706235729551.png)

  - 创建轮播图模型（该模型就是云控制台数据库中的集合）

  ![image-20210707000035130](E:/WebstormProjects/food-master/program/README_files/image-20210707000035130.png)

  ![image-20210707000253291](E:/WebstormProjects/food-master/program/README_files/image-20210707000253291.png)

  ![image-20210707000635306](E:/WebstormProjects/food-master/program/README_files/image-20210707000635306.png)

  - 上传图片到轮播图集合中

  ![image-20210707001115097](E:/WebstormProjects/food-master/program/README_files/image-20210707001115097.png)

  - 在home.js中创建数据库查询语句

  ```js
  Page({
    onLoad() {
      // 从数据库获取轮播图
      wx.cloud.database().collection('swiper').get()
        .then(res => {
          console.log(res, '获取成功')
  
        })
        .catch(res => {
          console.log(res, '获取失败')
        })
    }
  })
  ```

  注意：要开启数据库所有用户可读权限

  ![image-20210707001806768](E:/WebstormProjects/food-master/program/README_files/image-20210707001806768.png)

  ![image-20210707001948731](E:/WebstormProjects/food-master/program/README_files/image-20210707001948731.png)

  - 把获取到的图片路径赋值给data，并渲染到页面

  ```js
  Page({
    data: {
      swiper: []
    },
    onLoad() {
      // 从数据库获取轮播图
      wx.cloud.database().collection('swiper').get()
        .then(res => {
          console.log(res, '获取成功')
          this.setData({
            swiper: res.data
          })
        })
        .catch(res => {
          console.log(res, '获取失败')
        })
    }
  })
  ```

  ```html
  <swiper indicator-dots="{{true}}" autoplay="{{false}}" interval="{{false}}" duration="{{true}}"
    indicator-active-color="#ffbc0d">
    <swiper-item wx:for="{{swiper}}">
      <image src="{{item.img}}"></image>
    </swiper-item>
  </swiper>
  ```

  ![image-20210707002432212](E:/WebstormProjects/food-master/program/README_files/image-20210707002432212.png)

  - [ ] 注意，当前轮播图是动态请求过来的数据，如果断网状态将显示空界面
  - [ ] 为了界面友好，需要再配置本地轮播图图片
  - [ ] ![image-20210707003217386](E:/WebstormProjects/food-master/program/README_files/image-20210707003217386.png)
  - [ ] 

```js
Page({
  data: {
    swiper: []
  },
  onLoad() {
    // 从数据库获取轮播图
    wx.cloud.database().collection('swipe').get()
      .then(res => {
        console.log(res, '获取成功')
        this.setData({
          swiper: res.data
        })
      })
      .catch(res => {
        console.log(res, '获取失败')
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
  }
})
```

## 2.搜索区域开发

### 1.页面布局

```html
<!-- 轮播图区域 -->
<swiper indicator-dots="{{true}}" autoplay="{{false}}" interval="{{false}}" duration="{{true}}"
  indicator-active-color="#ffbc0d">
  <swiper-item wx:for="{{swiper}}" wx:key="*this">
    <image mode="widthFix" src="{{item.img}}"></image>
  </swiper-item>
</swiper>

<!-- 搜索区域 -->
<view class="search_root">
  <input placeholder="搜索菜品" class="search_input" type="text" />
  <image class="search_icon" src="../../images/search-1.png" />
</view>
```

```css
/* 轮播图 */
image {
  width: 100%;
}

/* 搜索区域 */
page {
  background-color: #fff;
}

.search_root {
  display: flex;
  flex-direction: row;
  padding: 20rpx;
  /* 设置垂直居中 */
  align-items: center;
}

.search_input {
  border: 1px solid #ffbc0d;
  flex: 1;
  border-radius: 15rpx;
  height: 75rpx;
  padding-left: 35rpx;
  font-size: 32rpx;
}

.search_icon {
  width: 80rpx;
  height: 80rpx;
  margin-left: 20rpx;
}
```

### 2.功能部分

```html
<!-- 轮播图区域 -->
<swiper indicator-dots="{{true}}" autoplay="{{false}}" interval="{{false}}" duration="{{true}}"
  indicator-active-color="#ffbc0d">
  <swiper-item wx:for="{{swiper}}" wx:key="*this">
    <image mode="widthFix" src="{{item.img}}"></image>
  </swiper-item>
</swiper>

<!-- 搜索区域 -->
<view class="search_root">
  <input bindinput="getInput" placeholder="搜索菜品" class="search_input" type="text" />
  <image bindtap="goSearch" class="search_icon" src="../../images/search-1.png" />
</view>
```

```js
let seaarchKey = ''
Page({
  data: {
    swiper: []
  },

  onLoad() {
    // 从数据库获取轮播图
    wx.cloud.database().collection('swiper').get()
      .then(res => {
        // console.log(res, '获取成功')
        this.setData({
          swiper: res.data
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

  // 获取用户输入数据
  getInput(e) {
    // console.log(e.detail.value)
    seaarchKey = e.detail.value
  },

  // 用户点击搜搜按钮，触发搜索事件
  goSearch() {
    console.log('点击了搜索', seaarchKey)
    // 判断用户是否在输入框输入了内容
    if (seaarchKey && seaarchKey.length > 0) {
      // 执行搜索事件，跳转到菜品列表

    } else {
      wx.showToast({
        icon: 'none',
        title: '请输入菜品',
      })
    }
  }
})
```

### 3.创建数据库查询模糊搜索

[参考文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/Database.RegExp.html)

```js
// 原生 JavaScript 对象
db.collection('todos').where({
  description: /miniprogram/i
})

// 数据库正则对象
db.collection('todos').where({
  description: db.RegExp({
    regexp: 'miniprogram',
    options: 'i',
  })
})

// 用 new 构造也是可以的
db.collection('todos').where({
  description: new db.RegExp({
    regexp: 'miniprogram',
    options: 'i',
  })
})
```

```js
// pages/home/home.js
const db = wx.cloud.database()
let searchKey = ''
Page({
  data: {
    swiper: []
  },

  onLoad() {
    // 从数据库获取轮播图
    db.collection('swiper').get()
      .then(res => {
        // console.log(res, '获取成功')
        this.setData({
          swiper: res.data
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

  // 获取用户输入数据
  getInput(e) {
    // console.log(e.detail.value)
    searchKey = e.detail.value
  },

  // 用户点击搜搜按钮，触发搜索事件
  goSearch() {

    // console.log('点击了搜索', searchKey)
    // 判断用户是否在输入框输入了内容
    if (searchKey && searchKey.length > 0) {
      // 搜索触发事件
      db.collection('food').where({
          // 模糊搜索 搜索菜品名称
          name: db.RegExp({
            regexp: searchKey,
            options: 'i' //不区分大小写
          })
        }).get()
        .then(res => {
          console.log(res, '搜索到了')
        })
        .catch(res => {
          console.log(res, '没有搜索到')
        })
    } else {
      wx.showToast({
        icon: 'none',
        title: '请输入菜品',
      })
    }
  }
})
```

### 4.实现手机界面点击搜索触发搜索事件

![image-20210707030727358](E:/WebstormProjects/food-master/program/README_files/image-20210707030727358.png)

![image-20210707031112128](E:/WebstormProjects/food-master/program/README_files/image-20210707031112128.png)

![image-20210707031143634](E:/WebstormProjects/food-master/program/README_files/image-20210707031143634.png)

![image-20210707031617885](E:/WebstormProjects/food-master/program/README_files/image-20210707031617885.png)

```html
<!-- 轮播图区域 -->
<swiper indicator-dots="{{true}}" autoplay="{{false}}" interval="{{false}}" duration="{{true}}"
  indicator-active-color="#ffbc0d">
  <swiper-item wx:for="{{swiper}}" wx:key="*this">
    <image mode="widthFix" src="{{item.img}}"></image>
  </swiper-item>
</swiper>

<!-- 搜索区域 -->
<view class="search_root">
  <input bindconfirm="goSearch" confirm-type="search" bindinput="getInput" placeholder="搜索菜品" class="search_input"
    type="text" />
  <image bindtap="goSearch" class="search_icon" src="../../images/search-1.png" />
</view>
```

### 5.携带搜索参数跳转到food页面进行搜索并显示搜索结果

```js
// pages/home/home.js
const db = wx.cloud.database()
let searchKey = ''
Page({
  data: {
    swiper: []
  },

  onLoad() {
    // 从数据库获取轮播图
    db.collection('swiper').get()
      .then(res => {
        // console.log(res, '获取成功')
        this.setData({
          swiper: res.data
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
  }
})
```

```js
// pages/food/food.js
const db = wx.cloud.database()
Page({
  onLoad(options) {
    console.log(options, 'food页面')
    let searchKey = options.searchKey
    db.collection('food').where({
        // 模糊搜索
        name: db.RegExp({
          regexp: searchKey,
          options: 'i' //不区分大小写
        })
      }).get()
      .then(res => {
        console.log(res.data, '搜索到了')

      })
      .catch(res => {
        console.log(res, '没有搜索到')
      })
  }
})
```

## 3.首页9宫格布局部分

![image-20210707045605386](E:/WebstormProjects/food-master/program/README_files/image-20210707045605386.png)

### 1.去图标库下载图标保存至本地images/home文件夹

### 2.布局加样式，点击图标跳转到对应页面

```xml
<!-- 九宫格区域 -->
<view class="cotainer">

  <view bindtap="click1" class="item">
    <image class="item_img" src="../../images/home/diancan.png" />
    <text class="item_text">扫码点餐</text>
  </view>
  <view bindtap="click2" class="item">
    <image class="item_img" src="../../images/home/menu.png" />
    <text class="item_text">浏览菜单</text>
  </view>
  <view bindtap="click3" class="item">
    <image class="item_img" src="../../images/home/paidui.png" />
    <text class="item_text">排队取号</text>
  </view>
  <view bindtap="click4" class="item">
    <image class="item_img" src="../../images/home/info.png" />
    <text class="item_text">关于我们</text>
  </view>
</view>
```

```css
/* 九宫格区域 */
.cotainer {
  display: flex;
  padding: 20rpx;
  justify-content: space-around;
  justify-items: center;
}

.cotainer .item {
  font-size: 28rpx;
  display: flex;
  flex-direction: column;
  text-align: center;
}

.cotainer .item .item_img {
  width: 100rpx;
  height: 100rpx;
}

.cotainer .item .item_text {
  text-align: center;
  color: rgb(131, 127, 127);
}
```

```js
 // 点击事件,去菜品分类页
  click1() {
    wx.navigateTo({
      url: '/pages/food2/food2',
    })
  },
  // 点击事件,去菜品列表页
  click2() {
    wx.navigateTo({
      url: '/pages/food/food',
    })
  },
  // 点击事件,去排号页
  click3() {
    wx.navigateTo({
      url: '/pages/paihao/paihao',
    })
  },
  // 点击事件,去关于我们页
  click4() {
    wx.navigateTo({
      url: '/pages/address/address',
    })
  }
```

## 4.首页热门推荐区域

### 1.标题区域

<img src="E:/WebstormProjects/food-master/program/README_files/image-20210707051629830.png" alt="image-20210707051629830" style="zoom:75%;" />

```html
<!-- 热门推荐 -->
<view>
  <!-- 标题区域 -->
  <view>
    <view class="hot_tip">
      <text class="hot_tip_title">热门推荐</text>
      <text bindtap="click2">更多></text>
    </view>
  </view>
  <!-- 内容区域 -->
</view>
```

```css
/* 热门推荐 */
.hot_tip {
  color: #ffbc0d;
  font-weight: 600;
  padding: 20rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* justify-content: center; */
}
.hot_tip_title {
  font-size: 40rpx;
}
```

### 2.列表内容区域

#### 1.创建数据表

![image-20210707051915955](E:/WebstormProjects/food-master/program/README_files/image-20210707051915955.png)

![image-20210707051958251](E:/WebstormProjects/food-master/program/README_files/image-20210707051958251.png)

![image-20210707052018171](E:/WebstormProjects/food-master/program/README_files/image-20210707052018171.png)



- [ ] 优化代码-把获取轮播图代码抽离出来定义成方法

![image-20210707054319986](E:/WebstormProjects/food-master/program/README_files/image-20210707054319986.png)

![image-20210707054717969](E:/WebstormProjects/food-master/program/README_files/image-20210707054717969.png)

#### 2.页面加载时调用数据,定义单独的调用方法

```js
  // 获取热门推荐菜品列表
  getHotList() {
    db.collection('food')
      .where({
        status: '上架' //只拿状态为上架的菜品
      })
      .orderBy('sell', 'desc') //desc销量按照降序排列，asc按照升序排列
      .limit(5) //只拿5条数据
      .get()
      .then(res => {
        console.log(res, '获取热门菜品列表ok')

      })
      .catch(res => {
        console.log(res, '获取热门菜品列表失败')
      })
  }
```

#### 3.新建云函数，通过云函数调用数据库数据

![image-20210707055100277](E:/WebstormProjects/food-master/program/README_files/image-20210707055100277.png)

- 初始化云环境，用常量

  [参考文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/constant/constant.html)

![image-20210707055335092](E:/WebstormProjects/food-master/program/README_files/image-20210707055335092.png)

```js
//云函数getFoodList

// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
}
```

```js
//云函数getFoodList
// 云函数入口文件 
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database() //注意：const db = wx.cloud.database()不要wx.
// 云函数入口函数
exports.main = async (event, context) => {
  // const wxContext = cloud.getWXContext()
  return await db.collection('food')
    .where({
      status: '上架' //只拿状态为上架的菜品
    })
    .orderBy('sell', 'desc') //desc销量按照降序排列，asc按照升序排列
    .limit(5) //只拿5条数据
    .get()
}
```

```js
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
    name:'getFoodList'  //云函数的名称
  })
  .then(res => {
    console.log(res, '获取热门菜品列表ok')
  })
  .catch(res => {
    console.log(res, '获取热门菜品列表失败')
  })

  }
```

- [ ] 注意：云函数编辑过必须上传部署才会生效

#### 4.把云函数获取到的数据渲染到页面

- 在data中定义foodList数组变量接收

![image-20210707061742398](E:/WebstormProjects/food-master/program/README_files/image-20210707061742398.png)

- ```js
  //  2. 通过云函数查询数据库
    
  wx.cloud.callFunction({
    name:'getFoodList'  //云函数的名称
  })
  .then(res => {
    console.log(res.result.data, '获取热门菜品列表ok')
    this.setData({
      foodList:res.result.data
    })
  })
  .catch(res => {
    console.log(res, '获取热门菜品列表失败')
  })
    
  }
  ```

  ![image-20210707062030584](E:/WebstormProjects/food-master/program/README_files/image-20210707062030584.png)

- 写热门推荐菜品列表样式页面

![image-20210707211934875](E:/WebstormProjects/food-master/program/README_files/image-20210707211934875.png)

```html
  <!-- 内容区域 -->
  <view class="content">
    <view bindtap="click2" class="content_item" wx:for="{{foodList}}">
      <image class="item_right" src="{{item.icon}}"></image>
      <view class="item_left">
        <view class="item_name">{{item.name}}</view>
        <view class="item_sell">销量: {{item.sell}}</view>
        <view class="price item_price"> {{item.price}}</view>
      </view>
    </view>
  </view>
</view>

```

```css

/* 内容 */
.content {
  padding: 20rpx;
}

.content_item {
  display: flex;
  /* justify-content: center; */
  align-items: center;
  border-bottom: 1px solid rgb(238, 233, 233);
}

.item_right {
  width: 140rpx;
  height: 140rpx;
  margin-right: 20rpx;
  min-width: 140rpx;

}

.item_sell {
  font-size: 30rpx;
  color: #aaa;
}

.item_price {
  color: #f40;
}

.item_name {
  width: 500rpx;
  /* 文字超出不换行，自动加省略号 */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

```css
/* app.wxss */
/* 定义人民币符号 */
.price::before{
  content: '¥';
  color: #f40;
}
```

## 5.关于我们address页面布局样式+首页按钮跳转+地图导航功能实现

### 1.点击关于我们按钮跳转地址页面

![image-20210707232219781](E:/WebstormProjects/food-master/program/README_files/image-20210707232219781.png)

### 2.创建address页面布局样式

![image-20210707213404572](E:/WebstormProjects/food-master/program/README_files/image-20210707213404572.png)

### 3.地址经纬度查询+导航功能[腾讯位置服务](https://lbs.qq.com/getPoint)

![image-20210707214156420](E:/WebstormProjects/food-master/program/README_files/image-20210707214156420.png)

```html
<!--pages/address/address.wxml-->

<!-- 25.51693,103.79632 -->

<map bindmarkertap="clickMap" data-marker="{{markers[0]}}" class="map" longitude="103.79632" latitude="25.51693"
  scale="17" show-location="" markers="{{markers}}" name="name"></map>

<!--  bindmarkertap="clickMap" 绑定地图点击事件 -->
<!-- data-marker="{{markers[0]}}"  传值给点击事件 -->
```

```js
// pages/address/address.js
Page({

  data: {
    // 标记点
    markers: [{
      id: 0,
      name: '愤豆科技',
      address: '曲靖白石江公园',
      latitude: 25.51693,
      longitude: 103.79632,
      width: 100,
      height: 100
    }]
  },
  // 点击标记点完成导航
  clickMap(e) {
    let marker = e.currentTarget.dataset.marker
    // 获取自己的位置
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        // 目的地位置
        console.log(res)
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
  }
})
```

- [ ] 注意：getLocation( )需要再app.json中声明permission才可以使用

```json
  "permission": {
    "scope.userLocation": {
      "desc": "导航需要"
    }
  },
  "sitemapLocation": "sitemap.json"
}
```

<img src="E:/WebstormProjects/food-master/program/README_files/image-20210707231847134.png" alt="image-20210707231847134" style="zoom:50%;" />

### 4.关于我们页面底部地址电话

![image-20210708013829708](E:/WebstormProjects/food-master/program/README_files/image-20210708013829708.png)

```html
<!-- 地址-拨打电话 -->
<view class="address">
  <view>地址：{{address}}</view>
  <view data-phone="{{phone}}" bindtap="callPhone">电话：{{phone}}（可点击拨打）</view>
  <view data-weixin="{{weixin}}" bindtap="copyWechat">微信：{{weixin}}（可点击复制）</view>
</view>
```

```css
/* pages/address/address.wxss */

.map {
  height: 80vh;
  width: 100%;
}

.address {
  padding: 0 20rpx;
  color: rgb(71, 70, 70);
  font-size: 35rpx;
  display: flex;
  flex-direction: column;
  height: 20vh;
  justify-content: flex-end;
  line-height: 1.75;
}
```

### 5.实现商家信息云函数调用动态渲染

- 创建getInfo云函数

```js
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database() //注意：const db = wx.cloud.database()不要wx.

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  return await db.collection('info')
    .get()
}
```

- 页面加载时动态调用并渲染+拨打电话+复制微信号功能

```js
// pages/address/address.js
Page({
  // 页面默认商家信息
  data: {
    address: "云南曲靖",
    phone: "13013451000",
    weixin: "y13013451000",
    // 标记点
    markers: [{
      id: 0,
      name: '愤豆科技',
      address: '曲靖白石江公园',
      latitude: 25.51693,
      longitude: 103.79632,
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
```

# 4.我的页面-授权登录退出与缓存

## 1.授权获取用户信息

![image-20210708071331485](E:/WebstormProjects/food-master/program/README_files/image-20210708071331485.png)

![image-20210708071345313](E:/WebstormProjects/food-master/program/README_files/image-20210708071345313.png)

![image-20210708071358056](E:/WebstormProjects/food-master/program/README_files/image-20210708071358056.png)

```html
<!--pages/me/me.wxml-->
<view wx:if="{{!userInfo}}" class="login">
  <button type="default" bindtap="getUserInfo">授权登录</button>
</view>
<view wx:else class="touxiang">
  <image src="{{userInfo.avatarUrl}}"></image>
  <text>{{userInfo.nickName}}</text>
</view>
```

```js
// pages/me/me.js
Page({
  data: {
    userInfo: ''
  },
  onLoad() {

  },
  // 授权获取用户信息
  getUserInfo(e) {
    wx.getUserProfile({
      desc: '必须授权才可以继续',
      success: res => {
        console.log('授权', res.userInfo.nickName) //avatarUrl
        this.setData({
          userInfo: res.userInfo
        })
      },
      fail: res => {
        console.log('授权', res)
      }
    })
  }
})
```

```css
/* pages/me/me.wxss */
.login {
  text-align: center;
  width: 100%;
  margin-top: 60rpx;
}

.login button {
  width: 400rpx;
}

.touxiang {
  display: flex;
  flex-direction: column;
  /* justify-content: center; */
  align-items: center;
}

.touxiang image {
  width: 200rpx;
  height: 200rpx;
  border-radius: 50%;
  margin-top: 30rpx;
  margin-bottom: 10rpx
}

.touxiang text {}
```

## 2.退出登录

```js
  // 退出登录
  logOut(){
    this.setData({
      userInfo:''
    })
  }

```

![image-20210708073639151](E:/WebstormProjects/food-master/program/README_files/image-20210708073639151.png)

## 3.缓存

### 1.授权成功后把用户数据存入缓存

![image-20210708072541226](E:/WebstormProjects/food-master/program/README_files/image-20210708072541226.png)

### 2.加载页面之后把用户数据从缓存取出渲染到页面

![image-20210708073335593](E:/WebstormProjects/food-master/program/README_files/image-20210708073335593.png)

# 5.个人中心页面

## 1.个人中心条目布局

![image-20210708165950467](E:/WebstormProjects/food-master/program/README_files/image-20210708165950467.png)

```html
<!--pages/me/me.wxml-->
<!-- 用户信息 -->
<view class="header">
  <view wx:if="{{!userInfo}}" class="login">
    <button size="mini" type="default" bindtap="getUserInfo">授权登录</button>
  </view>
  <view wx:else class="touxiang">
    <image src="{{userInfo.avatarUrl}}"></image>
    <text>{{userInfo.nickName}}</text>
    <text class="logOut" type="default" bindtap="logOut">退出登录</text>
  </view>
</view>
<!-- 条目布局 -->
<view class="item">
  <text>我的订单</text>
  <view class="right_arrow">
  </view>
</view>
<view class="item">
  <text>我的排号</text>
  <view class="right_arrow">
  </view>
</view>
<view class="item">
  <text>评价列表</text>
  <view class="right_arrow">
  </view>
</view>
<view class="item">
  <text>反馈建议</text>
  <view class="right_arrow">
  </view>
</view>
<view class="item">
  <text>在线客服</text>
  <view class="right_arrow">
  </view>
</view>
<view class="item">
  <text>管理员登录</text>
  <view class="right_arrow">
  </view>
</view>
```

```css
/* pages/me/me.wxss */
/* 个人信息 */
.header {
  height: 400rpx;
  background-color: #ffbc0d;
}

.login {
  text-align: center;
  width: 100%;
  padding-top: 60rpx;
}

.login button {
  width: 400rpx;
}

.touxiang {
  display: flex;
  flex-direction: column;
  /* justify-content: center; */
  align-items: center;
}

.touxiang image {
  width: 200rpx;
  height: 200rpx;
  border-radius: 50%;
  margin-top: 30rpx;
  margin-bottom: 10rpx
}

.touxiang text {}

.logOut {
  font-size: 33rpx;
  color: rgb(68, 66, 66);
  margin-top: 20rpx;
}

/* 条目布局 */
/* 用css画的箭头 */
.right_arrow {
  border: solid rgb(71, 71, 71);
  border-width: 0 3rpx 3rpx 0;
  padding: 3px;
  position: absolute;
  right: 15px;
  /* margin-left:66%; */
  transform: rotate(-45deg);
  -webkit-transform: rotate(-45deg);
}

.item {
  background-color: rgb(255, 255, 255);
  padding: 22rpx;
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgb(230, 224, 224)
}
```

## 2.设置个人信息登录可见

![image-20210708170818943](E:/WebstormProjects/food-master/program/README_files/image-20210708170818943.png)

```css
<!-- 条目布局 -->
<block wx:if="{{userInfo}}">
  <view class="item">
    <text>我的订单</text>
    <view class="right_arrow">
    </view>
  </view>
  <view class="item">
    <text>我的排号</text>
    <view class="right_arrow">
    </view>
  </view>
  <view class="item">
    <text>评价列表</text>
    <view class="right_arrow">
    </view>
  </view>
</block>
```

## 3.在线客服和意见反馈功能实现

![image-20210708171038228](E:/WebstormProjects/food-master/program/README_files/image-20210708171038228.png)

- 用小程序button组件实现

![image-20210708171337723](E:/WebstormProjects/food-master/program/README_files/image-20210708171337723.png)

![image-20210708171356907](E:/WebstormProjects/food-master/program/README_files/image-20210708171356907.png)

- 修改button样式-消除button默认样式

```css
/* 意见反馈 */
/* 在线客服 */
/* 消除button默认样式 */
.item button {
  width: 100%;
  background-color: #fff;
  border: none;
  text-align: left;
  padding: 0px;
  margin: 0px;
  line-height: 1.3;
  font-size: 16px;
}

/* 去除button边框 */
.item button::after {
  border: none;
  border-radius: 0;
}
```

![image-20210708172411900](E:/WebstormProjects/food-master/program/README_files/image-20210708172411900.png)

- [x] 注意：消除不了的话得把app.json里面的"style":"v2"删除

![image-20210708172713165](E:/WebstormProjects/food-master/program/README_files/image-20210708172713165.png)

# 6.搜索页面的开发

## 1.搜索页面顶部搜索框与首页一样，直接复制首页html，css到搜索列表页面

![image-20210708180721316](E:/WebstormProjects/food-master/program/README_files/image-20210708180721316.png)

![image-20210708180828583](E:/WebstormProjects/food-master/program/README_files/image-20210708180828583.png)

## 2.搜索页面列表部分与首页热门推荐一样，直接复制首页html，css到搜索列表页面

![image-20210707211934875](E:/WebstormProjects/food-master/program/README_files/image-20210707211934875.png)

## 2.添加搜索框功能-与首页一致

![image-20210708195331265](E:/WebstormProjects/food-master/program/README_files/image-20210708195331265.png)

```html
<!--pages/food/food.wxml-->

<!-- 搜索区域 -->
<view class="search_root">
  <input bindconfirm="goSearch" confirm-type="go" bindinput="getInput" placeholder="搜索菜品" class="search_input"
    type="text" />
  <image bindtap="goSearch" class="search_icon" src="../../images/search-1.png" />
</view>

<!-- 内容区域 -->
<view class="content">
  <view bindtap="click2" class="content_item" wx:key="*this" wx:for="{{foodList}}">
    <image class="item_right" src="{{item.icon}}"></image>
    <view class="item_left">
      <view class="item_name">{{item.name}}</view>
      <view class="item_sell">销量: {{item.sell}}</view>
      <view class="price item_price"> {{item.price}}</view>
    </view>
  </view>
</view>
```

```js
// pages/food/food.js
const db = wx.cloud.database()
let searchKey = ''
let searchKey2 = {}
Page({
  data: {
    foodList: [],
  },
  onLoad(options) {
    // 调用pushList方法把首页搜索结果数据渲染到页面
    this.pushList(options);
  },
  // 渲染首页搜索结果数据到页面
  pushList(options) {
    // console.log(options, 'food页面')
    let searchKey = options.searchKey
    db.collection('food').where({
        // 模糊搜索
        name: db.RegExp({
          regexp: searchKey,
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
          this.setData({
            foodList: res.data
          })
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
})
```

## 2.添加搜索列表页面菜品加减功能

![image-20210708234545154](E:/WebstormProjects/food-master/program/README_files/image-20210708234545154.png)

```html
<!--pages/food/food.wxml-->

<!-- 搜索区域 -->
<view class="search_root">
  <input bindconfirm="goSearch" confirm-type="go" bindinput="getInput" placeholder="搜索菜品" class="search_input"
    type="text" />
  <image bindtap="goSearch" class="search_icon" src="../../images/search-1.png" />
</view>

<!-- 内容区域 -->
<view class="content">
  <view class="content_item" wx:key="*this" wx:for="{{foodList}}">
    <image class="item_right" src="{{item.icon}}"></image>
    <view class="item_left">
      <view class="item_name">{{item.name}}</view>
      <view class="item_sell">销量: {{item.sell}}</view>
      <view class="item_button">
        <view class="price item_price"> {{item.price}}</view>
        <image bindtap="jian" data-id="{{item._id}}" class="jiajian" src="../../images/jian.png"></image>
        <text>{{item.num}}</text>
        <image bindtap="jia" data-id="{{item._id}}" class="jiajian" src="../../images/jia.png"></image>
      </view>
    </view>
  </view>
</view>
```

```css
/* pages/food/food.wxss */
/* 搜索区域 */
page {
  background-color: #fff;
}

.search_root {
  display: flex;
  flex-direction: row;
  padding: 20rpx;
  /* 设置垂直居中 */
  align-items: center;
}

.search_input {
  border: 1px solid #ffbc0d;
  flex: 1;
  border-radius: 15rpx;
  height: 75rpx;
  padding-left: 35rpx;
  font-size: 32rpx;
}

.search_icon {
  width: 80rpx;
  height: 80rpx;
  margin-left: 20rpx;
}

/* 内容 */
.content {
  padding: 20rpx;
}

.content_item {
  display: flex;
  /* justify-content: center; */
  align-items: center;
  border-bottom: 1px solid rgb(238, 233, 233);
}

.item_right {
  width: 140rpx;
  height: 140rpx;
  margin-right: 20rpx;
  min-width: 140rpx;

}

.item_sell {
  font-size: 30rpx;
  color: #aaa;
}

.item_button {
  display: flex;
  align-items: center;
}


.item_button text {
  margin: 0 20rpx;
}

.item_price {
  color: #f40;
  flex: 1;
}

.jiajian {
  width: 40rpx;
  height: 40rpx;
}


.item_name {
  width: 500rpx;
  /* 文字超出不换行，自动加省略号 */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

```js
// pages/food/food.js
const db = wx.cloud.database()
let searchKey = ''
let searchKey2 = {}
Page({
  data: {
    foodList: [],
  },
  onLoad(options) {
    // 调用pushList方法把首页搜索结果数据渲染到页面
    this.pushList(options);
  },
  // 渲染首页搜索结果数据到页面
  pushList(options) {
    // console.log(options, 'food页面')
    let searchKey = options.searchKey
    db.collection('food').where({
        // 模糊搜索
        name: db.RegExp({
          regexp: searchKey,
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
          })
          this.setData({
            foodList: res.data
          })
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
  // 需要传入商品id，才知道是加了哪个商品
  jia(e) {
    let list = this.data.foodList
    // console.log('点击了加', e.currentTarget.dataset.id)
    // 循环数组每一项，找到对应id的商品
    list.forEach(item => {
      // 当id相等  给该id对应的商品 num + 1
      if (item._id == e.currentTarget.dataset.id) {
        item.num += 1
      }
      this.setData({
        foodList: list
      })
    })
  },
  // 减操作
  jian(e) {
    let list = this.data.foodList
    // console.log('点击了减', e.currentTarget.dataset.id)
    // 循环数组每一项，找到对应id的商品
    list.forEach(item => {
      // 当id相等  给该id对应的商品 num - 1  判断num值是否大于0 大于0就减1
      if (item._id == e.currentTarget.dataset.id && item.num == 0) {
        wx.showToast({
          icon: 'none',
          title: '不能再减啦!',
        })
      }
      if (item._id == e.currentTarget.dataset.id && item.num > 0) {
        item.num -= 1
      }
      this.setData({
        foodList: list
      })
    })
  }
})
```

- 注意事项：
- 渲染首页搜索结果数据到页面时就要循环数组每一项，给foodList每一项多加一个属性num，用于后面购物车功能使用

![image-20210708235026970](E:/WebstormProjects/food-master/program/README_files/image-20210708235026970.png)

![image-20210708235118719](E:/WebstormProjects/food-master/program/README_files/image-20210708235118719.png)

# 7.实现首页浏览菜品按钮跳转到菜品列表页

![image-20210709004822353](E:/WebstormProjects/food-master/program/README_files/image-20210709004822353.png)

![image-20210709004557500](E:/WebstormProjects/food-master/program/README_files/image-20210709004557500.png)

```js
// pages/food/food.js
const db = wx.cloud.database()
let searchKey = ''
let searchKey2 = {}
Page({
  data: {
    foodList: [],
    op: {
      searchKey: ''
    }
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
  },
  // 渲染首页搜索结果数据到页面
  pushList(options) {
    // console.log(options, 'food页面')
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
          })
          this.setData({
            foodList: res.data
          })
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
  // 需要传入商品id，才知道是加了哪个商品
  jia(e) {
    let list = this.data.foodList
    // console.log('点击了加', e.currentTarget.dataset.id)
    // 循环数组每一项，找到对应id的商品
    list.forEach(item => {
      // 当id相等  给该id对应的商品 num + 1
      if (item._id == e.currentTarget.dataset.id) {
        item.num += 1
      }
      this.setData({
        foodList: list
      })
    })
  },
  // 减操作
  jian(e) {
    let list = this.data.foodList
    // console.log('点击了减', e.currentTarget.dataset.id)
    // 循环数组每一项，找到对应id的商品
    list.forEach(item => {
      // 当id相等  给该id对应的商品 num - 1  判断num值是否大于0 大于0就减1
      if (item._id == e.currentTarget.dataset.id && item.num == 0) {
        wx.showToast({
          icon: 'none',
          title: '不能再减啦!',
        })
      }
      if (item._id == e.currentTarget.dataset.id && item.num > 0) {
        item.num -= 1
      }
      this.setData({
        foodList: list
      })
    })
  }
})
```

# 8.实现菜品列表底部购物车

## 1.购物车区域基本布局

![image-20210709015102983](E:/WebstormProjects/food-master/program/README_files/image-20210709015102983.png)

```xml
<!--pages/food/food.wxml-->

<!-- 搜索区域 -->
<view class="search_root">
  <input bindconfirm="goSearch" confirm-type="go" bindinput="getInput" placeholder="搜索菜品" class="search_input"
    type="text" />
  <image bindtap="goSearch" class="search_icon" src="../../images/search-1.png" />
</view>

<!-- 内容区域 -->
<view class="tools">
  <view class="content">
    <view class="content_item" wx:key="*this" wx:for="{{foodList}}">
      <image class="item_right" src="{{item.icon}}"></image>
      <view class="item_left">
        <view class="item_name">{{item.name}}</view>
        <view class="item_sell">销量: {{item.sell}}</view>
        <view class="item_button">
          <view class="price item_price"> {{item.price}}</view>
          <image bindtap="jian" data-id="{{item._id}}" class="jiajian" src="../../images/jian.png"></image>
          <text>{{item.num}}</text>
          <image bindtap="jia" data-id="{{item._id}}" class="jiajian" src="../../images/jia.png"></image>
        </view>
      </view>
    </view>
  </view>
</view>
<!-- 底部区域 -->
<view class="bottom_all">
  <view class="left_cart">
    <image src="../../images/cart.png"></image>
  </view>
  <view class="total_money">总计321元，3件</view>
  <view class="choose_ok">选好了</view>
</view>
```

```css
/* pages/food/food.wxss */
/* 搜索区域 */
page {
  background-color: #fff;
}

.search_root {
  display: flex;
  flex-direction: row;
  padding: 20rpx;
  /* 设置垂直居中 */
  align-items: center;

}

.search_input {
  border: 1px solid #ffbc0d;
  flex: 1;
  border-radius: 15rpx;
  height: 75rpx;
  padding-left: 35rpx;
  font-size: 32rpx;
}

.search_icon {
  width: 80rpx;
  height: 80rpx;
  margin-left: 20rpx;
}

/* 内容 */
.tools {
  margin-bottom: 80rpx;
}

.content {
  padding: 0 20rpx;

}

.content_item {
  display: flex;
  /* justify-content: center; */
  align-items: center;
  border-bottom: 1px solid rgb(238, 233, 233);
}

.item_right {
  width: 140rpx;
  height: 140rpx;
  margin-right: 20rpx;
  min-width: 140rpx;

}

.item_sell {
  font-size: 30rpx;
  color: #aaa;
}

.item_button {
  display: flex;
  align-items: center;
}


.item_button text {
  margin: 0 20rpx;
}

.item_price {
  color: #f40;
  flex: 1;
}

.jiajian {
  width: 40rpx;
  height: 40rpx;
}


.item_name {
  width: 500rpx;
  /* 文字超出不换行，自动加省略号 */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 底部区域 */
.bottom_all {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 80rpx;
  background-color: #fef4de;
  z-index: 100;
  display: flex;
}

.left_cart {
  height: 100rpx;
  width: 100rpx;
  border-radius: 50%;
  background-color: #ff9600;

  position: relative;
  left: 20px;
  bottom: 30rpx;
  display: flex;
  align-items: center;
}

.left_cart image {
  height: 90rpx;
  width: 90rpx;
  align-items: center;
}

.total_money {
  flex: 1;
  text-align: center;
  line-height: 80rpx;
  font-size: 34rpx;
}

.choose_ok {
  background-color: #ffbc0d;
  width: 200rpx;
  text-align: center;
  line-height: 80rpx;
  color: #fff;
}
```

## 2.购物车功能实现

![image-20210709020511111](E:/WebstormProjects/food-master/program/README_files/image-20210709020511111.png)

```js
  // 加操作
  // 需要传入商品id，才知道是加了哪个商品
  jia(e) {
    let list = this.data.foodList
    // console.log('点击了加', e.currentTarget.dataset.id)
    // 循环数组每一项，找到对应id的商品
    list.forEach(item => {
      // 当id相等  给该id对应的商品 num + 1
      if (item._id == e.currentTarget.dataset.id) {
        item.num += 1
        // 同时让购物车菜品件数加 1
        // 同时计算总计价格
        this.setData({
          totalNum: this.data.totalNum += 1,
          totalMoney: this.data.totalMoney += item.price
        })
      }
      this.setData({
        foodList: list
      })
    })
  },
  // 减操作
  jian(e) {
    let list = this.data.foodList
    // console.log('点击了减', e.currentTarget.dataset.id)
    // 循环数组每一项，找到对应id的商品
    list.forEach(item => {
      // 当id相等  给该id对应的商品 num - 1  判断num值是否大于0 大于0就减1
      if (item._id == e.currentTarget.dataset.id && item.num == 0) {
        wx.showToast({
          icon: 'none',
          title: '不能再减啦!',
        })
      }
      if (item._id == e.currentTarget.dataset.id && item.num > 0) {
        item.num -= 1
        // 同时让购物车菜品件数减 1
        // 同时计算总计价格
        this.setData({
          totalNum: this.data.totalNum -= 1,
          totalMoney: this.data.totalMoney -= item.price
        })
      }
      this.setData({
        foodList: list
      })
    })
  }
```

## 3.把购物车数据追加到数组

![image-20210709034917832](E:/WebstormProjects/food-master/program/README_files/image-20210709034917832.png)

```js
// pages/food/food.js
const db = wx.cloud.database()
let searchKey = ''
let searchKey2 = {}
Page({
  data: {
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
  },
  // 渲染首页搜索结果数据到页面
  pushList(options) {
    // console.log(options, 'food页面')
    let searchKey = options.searchKey
    db.collection('food').where({
        // 模糊搜索
        name: db.RegExp({
          regexp: '',
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
          })
          this.setData({
            foodList: res.data
          })
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
    let totalMoney = this.data.totalMoney
    let totalNum = this.data.totalNum
    let id = e.currentTarget.dataset.id

    // console.log('点击了加', e.currentTarget.dataset.id)
    // 循环数组每一项，找到对应id的商品
    list.forEach(item => {
      // 当id相等  给该id对应的商品 num + 1
      if (item._id == id) {
        item.num += 1
        totalNum += 1, // 同时让购物车菜品件数加 1
          totalMoney += item.price // 同时计算总计价格
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
        totalMoney,
        totalNum
      })
    })
  },
  // 减操作
  jian(e) {
    let list = this.data.foodList
    let cartList = this.data.cartList
    let totalMoney = this.data.totalMoney
    let totalNum = this.data.totalNum
    let id = e.currentTarget.dataset.id

    // console.log('点击了加', e.currentTarget.dataset.id)
    // 循环数组每一项，找到对应id的商品
    list.forEach(item => {
      if (item._id == id && item.num == 0) {
        wx.showToast({
          icon: "none",
          title: '不能再减啦！',
        })
      }
      // 当id相等  给该id对应的商品 num - 1
      if (item._id == id && item.num > 0) {
        item.num -= 1
        totalNum -= 1, // 同时让购物车菜品件数加 1
          totalMoney -= item.price // 同时计算总计价格
        // this.data.cartList.push(item)
        if (cartList && cartList.length > 0) {
          // 查询购物车数组里面是否存在当前点击的菜品
          var result = cartList.find(cart => {
            return cart._id == id
          })
          // console.log("当前点击的菜品在购物车吗？", result.num)
          if (result.num == 0) { //如果点击的菜品在购物车的数量为0，就移除
            cartList.pop(result)
          }
        }
        // console.log('遍历后的数组-----', cartList)
      }
      this.setData({
        foodList: list,
        cartList,
        totalMoney,
        totalNum
      })
    })
  }
})
```

## 4.把购物车数据缓存到本地存储

![image-20210709043117008](E:/WebstormProjects/food-master/program/README_files/image-20210709043117008.png)

![image-20210709043155175](E:/WebstormProjects/food-master/program/README_files/image-20210709043155175.png)

![image-20210709043237493](E:/WebstormProjects/food-master/program/README_files/image-20210709043237493.png)

## 5.实现购物车蒙层



![image-20210709043031212](E:/WebstormProjects/food-master/program/README_files/image-20210709043031212.png)

## 6.购物车整体页面加功能代码

![image-20210709224538224](E:/WebstormProjects/food-master/program/README_files/image-20210709224538224.png)

- [ ] 此处主要用到数组的遍历查询方法和删除单条数据方法

```html
<!--pages/food/food.wxml-->

<!-- 搜索区域 -->
<view class="search_root">
  <input bindconfirm="goSearch" confirm-type="go" bindinput="getInput" placeholder="搜索菜品" class="search_input"
    type="text" />
  <image bindtap="goSearch" class="search_icon" src="../../images/search-1.png" />
</view>

<!-- 内容区域 -->
<view class="tools">
  <view class="content">
    <view class="content_item" wx:key="*this" wx:for="{{foodList}}">
      <image class="item_right" src="{{item.icon}}"></image>
      <view class="item_left">
        <view class="item_name">{{item.name}}</view>
        <view class="item_sell">销量: {{item.sell}}</view>
        <view class="item_button">
          <view class="price item_price"> {{item.price}}</view>
          <image bindtap="jian" data-id="{{item._id}}" class="jiajian" src="../../images/jian.png"></image>
          <text>{{item.num}}</text>
          <image bindtap="jia" data-id="{{item._id}}" class="jiajian" src="../../images/jia.png"></image>
        </view>
      </view>
    </view>
  </view>
</view>
<!-- 底部区域 -->
<view class="bottom_all">
  <view bindtap="openMask" class="left_cart">
    <image src="../../images/cart.png"></image>
  </view>
  <view class="total_money">总计{{totalMoney}}元，{{totalNum}}件</view>
  <view class="choose_ok">选好了</view>
</view>

<!-- 购物车蒙层 -->
<view hidden="{{isHiddMask}}" class="mask_bg"></view>
<!-- 购物车列表 -->
<view hidden="{{isHiddMask}}" class="cart_content">
  <view class="cart_content_top">
    <view bindtap="closeMask">返回</view>
    <view class="top_title">购物车</view>
    <view bindtap="clearCart">清空购物车</view>
  </view>

  <scroll-view class="cart_content_list">
    <view wx:for="{{cartList}}" wx:key="*this">
      <view class="cart_item">
        <view class="cart_item_left">
          <view>{{item.name}}</view>
          <view class="cart_item_price">{{item.price}}元</view>
        </view>
        <view class="cart_item_right">
          <image bindtap="jian" data-id="{{item._id}}" class="jiajian" src="../../images/jian.png"></image>
          <text>{{item.num}}</text>
          <image bindtap="jia" data-id="{{item._id}}" class="jiajian" src="../../images/jia.png"></image>
          <image bindtap="closeCartItem" data-index="{{index}}" class="close_cart" src="../../images/close.png"></image>
        </view>
      </view>
    </view>
  </scroll-view>
</view>
```

```js
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
```

```css
/* pages/food/food.wxss */
/* 搜索区域 */
page {
  background-color: #fff;
}

.search_root {
  display: flex;
  flex-direction: row;
  padding: 20rpx;
  /* 设置垂直居中 */
  align-items: center;

}

.search_input {
  border: 1px solid #ffbc0d;
  flex: 1;
  border-radius: 15rpx;
  height: 75rpx;
  padding-left: 35rpx;
  font-size: 32rpx;
}

.search_icon {
  width: 80rpx;
  height: 80rpx;
  margin-left: 20rpx;
}

/* 内容 */
.tools {
  margin-bottom: 80rpx;
}

.content {
  padding: 0 20rpx;

}

.content_item {
  display: flex;
  /* justify-content: center; */
  align-items: center;
  border-bottom: 1px solid rgb(238, 233, 233);
}

.item_right {
  width: 140rpx;
  height: 140rpx;
  margin-right: 20rpx;
  min-width: 140rpx;

}

.item_sell {
  font-size: 30rpx;
  color: #aaa;
}

.item_button {
  display: flex;
  align-items: center;
}


.item_button text {
  margin: 0 20rpx;
}

.item_price {
  color: #f40;
  flex: 1;
}

.jiajian {
  width: 40rpx;
  height: 40rpx;
}


.item_name {
  width: 500rpx;
  /* 文字超出不换行，自动加省略号 */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 底部区域 */
.bottom_all {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 80rpx;
  background-color: #fef4de;
  z-index: 100;
  display: flex;
}

.left_cart {
  height: 100rpx;
  width: 100rpx;
  border-radius: 50%;
  background-color: #ff9600;

  position: relative;
  left: 20px;
  bottom: 30rpx;
  display: flex;
  align-items: center;
}

.left_cart image {
  height: 90rpx;
  width: 90rpx;
  align-items: center;
}

.total_money {
  flex: 1;
  text-align: center;
  line-height: 80rpx;
  font-size: 34rpx;
}

.choose_ok {
  background-color: #ffbc0d;
  width: 200rpx;
  text-align: center;
  line-height: 80rpx;
  color: #fff;
}

/* 购物车区域 */
/* 蒙层 */
.mask_bg {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  /* 设置背景颜色的透明度 */
  opacity: 0.5;
  background-color: #000;
  /* 设置组件层级 */
  z-index: 100;
}

/* 购物车列表 */
.cart_content {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #fff;
  height: 600rpx;
  z-index: 200;
  /* 解决滑动冲突 */
  overflow: auto;

}

/* 购物车顶部标题 */
.cart_content_top {
  display: flex;
  justify-content: space-between;
  height: 60rpx;
  background-color: #ff9600;
  color: #fff;
  padding: 5rpx 15rpx;
  position: fixed;
  left: 0;
  right: 0;
  overflow: auto;
  z-index: 201;

}

.top_title {
  font-size: 45rpx;
}

.cart_content_list {
  margin-top: 65rpx;
}

.cart_item {
  display: flex;
  border-bottom: 1px solid gainsboro;
  align-items: center;
  padding: 5rpx 20rpx;
}

.cart_item_left {
  flex: 1;
}

.close_cart {
  height: 45rpx;
  width: 45rpx;
}

.cart_item_price {
  color: #ff9600;
  font-size: 33rpx;
}

.cart_item_right image {
  margin: 0 25rpx;
}
```



