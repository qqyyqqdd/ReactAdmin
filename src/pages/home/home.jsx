import React from 'react'
import './home.less'

/* 
首页路由
 */

export default class Home extends React.Component {
    constructor(props){
        super(props)
        this.state = {

        }
    }

    render() {
        return (
        <div className="home">
            欢迎使用硅谷后台管理系统
        </div>
        )
    }
}