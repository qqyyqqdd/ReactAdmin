// 发送异步ajax请求的函数模块
// 封装axios库

import axios from 'axios'
// import qs from 'qs'
import {message} from 'antd'

// 1. axios请求返回promise对象，在请求处理错误时不reject，而是显示错误提示
// 2. 异步得到的不是response，而是response的data
//  在请求成功resolve时，resolve.data

/* 
const instance = axios.create({
    timeout:10000,
    headers: {
        'Content-Type': 'application/json;charset=utf-8'
    }
}) */

export default function ajax(url, data={}, method="GET") {
    // let params = qs.stringify(data)

    return new Promise((resolve,reject) => {
        let promise
        // 1. 执行异步ajax请求
        console.log('ajax: ',url, data)
        if(method === 'GET') { //发GET请求
            promise = axios.get(url, { //配置对象
                params: data // 指定请求参数
            })
            // promise = instance.get(url, {params:data})
        } else { // 发POST请求
            promise = axios.post(url, data)
            // promise = instance.post(url, {params:data})
        }
        // 2. 如果成果，调用resolve
        promise.then(response => {
            resolve(response.data)
        // 3. 如果失败，不调用reject，而是提示异常信息
        }).catch(error => {
            // reject(error)
            message.error('请求出错了：'+error.message)
        })
        
        

    })

    
}

// 请求登录接口
// ajax('/login',{username:'Tom',password:'123456'},'POST').then()
// 添加用户
// ajax('/manage/user/add',{username:'Tom',password:'123456',phone:'12345678910'})