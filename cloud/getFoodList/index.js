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