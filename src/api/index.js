// 包含应用中所有接口请求函数的模块
// 每个函数的返回值都是promise
import ajax from './ajax'


// const BASE = ''
const key = 'e39be7595afc4a5282a8bcc24a9c93b2'

// 登录
export const reqLogin = (username, password) => ajax('http://39.100.225.255:5000/login',{username,password},'POST')

// 获取位置id
export const reqLocId = (location,number=1) => ajax('https://geoapi.qweather.com/v2/city/lookup?',{location,key,number},'GET')
// 获取天气信息
export const reqWeather = (location) => ajax('https://devapi.qweather.com/v7/weather/now',{location,key},'GET')

// 获取分类列表
export const reqCategorys = (parentId) => ajax('http://39.100.225.255:5000/manage/category/list',{parentId},'GET')

// 添加分类
export const reqAddCategory = (categoryName, parentId) => ajax('http://39.100.225.255:5000/manage/category/add',{categoryName, parentId},'POST')

// 修改分类
export const reqUpdateCategory = ({categoryId,categoryName}) => ajax('http://39.100.225.255:5000/manage/category/update',{categoryId,categoryName}, 'POST')

// 获取一个分类
export const reqCategory = (categoryId) => ajax('http://39.100.225.255:5000/manage/category/Info',{categoryId},'GET')

// 获取商品分页
export const reqProducts = (pageNum, pageSize) => ajax('http://39.100.225.255:5000/manage/product/list',{pageNum, pageSize},'GET')

// 更新商品的状态（上架/下架）
export const reqUpdateStatus = (productId, status) => ajax('http://39.100.225.255:5000/manage/product/updateStatus',{productId, status},'POST')

// 搜索商品分页列表,根据商品名称
// searchType: 搜索类型 productName/productDesc
export const reqSearchProducts = ({pageNum, pageSize,searchName,searchType}) => ajax('http://39.100.225.255:5000/manage/product/search',{pageNum, pageSize, [searchType]:searchName},'GET')

export const reqDeleteImg = (name) => ajax('http://39.100.225.255:5000/manage/img/delete',name,"POST")

// 添加商品
export const reqAddOrUpdateProduct = (product) => ajax(product.isUpdate?'http://39.100.225.255:5000/manage/product/update':'http://39.100.225.255:5000/manage/product/add', product, 'POST')

// 获取所有角色的列表
export const reqRoles = () => ajax('http://39.100.225.255:5000/manage/role/list','','GET')

// 添加角色
export const reqAddRole =(roleName) => ajax('http://39.100.225.255:5000/manage/role/add',{roleName},'POST')

// 更新角色权限
export const reqUpdateRole =(role) => ajax('http://39.100.225.255:5000/manage/role/update',role,'POST')

// 获取用户列表
export const reqUsers = () => ajax('http://39.100.225.255:5000/manage/user/list')

// 删除指定用户
export const reqDeleteUser = (userId) => ajax('http://39.100.225.255:5000/manage/user/delete',{userId},'POST')

// 添加用户
export const reqAddUser = (user) => ajax('http://39.100.225.255:5000/manage/user/add',user, 'POST')

// 添加或更新用户
export const reqAddOrUpdateUser = (user) => ajax(user._id? 'http://39.100.225.255:5000/manage/user/update':'http://39.100.225.255:5000/manage/user/add',user, 'POST')


// 
/* 
json请求的接口请求函数
1. jsonp处理一般的get请求
2. jsonp请求不是ajax请求，而是一般get请求
3. 原理：
    浏览器端：
    动态生成<script>来请求后台接口
    定义用户接收相应数据的函数，并将函数名通过请求参数提交给后台
    服务器端：
    接受到请求处理产生结果数据后，返回一个函数调用的js代码，并将结果数据作为实参传入函数调用
    浏览器端：
    收到响应自动执行函数调用的js代码，执行了定义的回调函数，得到结果数据
*/

// export const reqWeather = (city) => {
//     const locUrl = `https://geoapi.qweather.com/v2/city/lookup?location=${city}&number=1&key=e39be7595afc4a5282a8bcc24a9c93b2`
    
//     const url = `http://api.map.baidu.com/telematics/v3/weather?location=222405&output=json&ak=CxUcyY7ZsAg5Btqxm917EiyTsLft8NtI`

//     return new Promise ((resolve, reject) => {
//         // jsonp(url, opts, callback)
//         console.log(locUrl)
//         jsonp(locUrl,{timeout: '500'},(err, response) => {
//             console.log('jsonp(): ',err, response)
//         })
//         /* jsonp(url, {param:'callback'}, (err, data) => {
//             console.log('jsonp()',err,data)
//             if(data.status === 'success') {
//                 resolve(data)
//             }else {
//                 console.log('error: '+err)
//             }
//             // 请求成功
//             if(!err && data.status === '0') {
//                 // 取出需要的数据
//                 console.log(data)
//                 const weather = data.result.now[0]
//                 resolve({weather})
//             }else {
//                 // 失败了
//                 message.error('获取天气信息失败')
//             }
//         }) */
//     })

    
// }
