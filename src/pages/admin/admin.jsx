import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { Layout } from 'antd';

// import memoryUtils from '../../utils/memoryUtils'
import LeftNav from '../../components/left-nav'
import Header from '../../components/header'
import Home from '../home/home'
import Category from '../category/category'
import Bar from '../charts/bar'
import Line from '../charts/line'
import Pie from '../charts/pie'
import Product from '../product/product'
import Role from '../role/role'
import User from '../user/user'
import NotFound from '../not-found/not-found'


const { Footer, Sider, Content } = Layout;




// 管理路由组件
export default class Admin extends React.Component {
    constructor(props){
        super(props)
        this.state = {

        }
    }
    
    render() {
        // const user = memoryUtils.user
        // // 如果内存中没有user =>  当前没有登录
        // if(!user || !user._id) {
        //     // 自动跳转到登录
        //     return <Redirect to='/login'></Redirect>
        // }
        return (
            <Layout style={{height:'100%'}}>
                <Sider><LeftNav></LeftNav></Sider>
                <Layout>
                    <Header>Header</Header>
                    <Content style={{margin: '20px',backgroundColor:'#fff'}}>
                        <Switch>
                            <Redirect exact={true} from='/' to='/home' />
                            <Route path='/home' component={Home}></Route>
                            <Route path='/category' component={Category}></Route>
                            <Route path='/product' component={Product}></Route>
                            <Route path='/role' component={Role}></Route>
                            <Route path='/user' component={User}></Route>
                            <Route path='/charts/bar' component={Bar}></Route>
                            <Route path='/charts/line' component={Line}></Route>
                            <Route path='/charts/pie' component={Pie}></Route>
                            <Route component={NotFound} />
                        </Switch>
                    </Content>
                    <Footer style={{textAlign:'center', color:'#ccc'}}>推荐使用谷歌浏览器，获得更佳的页面操作体验</Footer>
                </Layout>
            </Layout>
        )
    }
}