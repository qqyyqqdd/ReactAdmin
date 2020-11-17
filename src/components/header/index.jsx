import React from 'react'
import './index.less'
import {withRouter}  from 'react-router-dom'

import menuList from '../../config/menuConfig'
import {formateDate} from '../../utils/dateUtils'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import sunny from '../../assets/WeatherIcon/100.png'
import {reqLocId, reqWeather} from '../../api'

// 退出框
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

// 链接
import LinkButton from '../link-button'

const { confirm } = Modal;

const IconBase = '../../assets/WeatherIcon/'

class Header extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            currentTime: formateDate(Date.now()), // 当前时间字符串格式
            weather: '', // 天气文本
            weatherIcon: '', // 天气图标
            locid: '', // 位置id
        }
    }

    getTime = () => {
        // 每隔1s获取当前时间
        this.intervalId = setInterval(() => {
            const currentTime = formateDate(Date.now())
            this.setState({currentTime})
        }, 1000)
    }

    getWeather = async() => {
        const loc = await reqLocId('beijing')
        const locid = loc.location[0].id
        const resp = await reqWeather(locid)
        const weather = resp.now.text
        const weatherIcon = IconBase +resp.now.icon +'.png'
        this.setState({weather, weatherIcon})
    }

    getTitle = () => {
        const path = this.props.location.pathname
        let title
        menuList.forEach(item => {
            if(item.key === path ) {
                title = item.title
            } else if(item.children) {
                const cItem = item.children.find(cItem => path.indexOf(cItem.key) === 0)
                if(cItem) {
                    title = cItem.title
                }
            }
        })
        return title
    }

    /* 
    退出登录
    */
    logOut = () => {
        // 显示确认框
        confirm({
            // title: 'Do you Want to delete these items?',
            icon: <ExclamationCircleOutlined />,
            content: '确定退出吗？',
            onOk: () => {
                // 删除保存的user数据
                storageUtils.removeUser()
                memoryUtils.user = {}
                // 跳转到login界面
                this.props.history.replace('/login')
            },
          });
    }

    /* 
    在第一次render之后执行
    一般在此执行一般操作：发ajax请求，启动定时器
    */
    componentDidMount() {
        // 获取当前时间
        this.getTime() 
        // 获取当前天气
        this.getWeather()
    }

    /* 
    在当前组件卸载之前调用
    */
    componentWillUnmount() {
        // 清除定时器
        clearInterval(this.intervalId)
    }

    render() {
        const currentTime = this.state.currentTime
        const weather = this.state.weather

        const title = this.getTitle()
        // const username = memoryUtils.user.username
        return (
            <div className="header">
                <div className="header-top">
                    {/* admin 替换为{username} */}
                    <span>欢迎， {}</span>
                    <LinkButton onClick={this.logOut}>退出</LinkButton>
                </div>
                <div className="header-bottom">
                    <div className="header-bottom-left">{title}</div>
                    <div className="header-bottom-right">
                        <span>{currentTime}</span>
                        <img src={sunny} alt=""/>
                        <span>{weather}</span>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Header)