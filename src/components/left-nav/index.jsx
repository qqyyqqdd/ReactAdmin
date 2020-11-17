import React from 'react'
import { Link, withRouter } from 'react-router-dom'

import { Menu } from 'antd';



import logo from '../../assets/images/logo.png'
import menuList from '../../config/menuConfig'
import './index.less'

const { SubMenu } = Menu;
/* 
左侧导航组件
*/

class leftNav extends React.Component {
    constructor(props){
        super(props)
        this.state = {

        }
    }

    /* 
     根据menu的数据数组，生成对应的标签数组
     使用map()+递归
    */
    getMenuNodes_map = (menuList) => {
        return menuList.map(item => {
            if(!item.children) {
                return (
                    <Menu.Item key={item.key} icon={null}>
                        <Link to={item.key}>
                            {item.title}
                        </Link>
                    </Menu.Item>
                )
            } else {
                return (
                    <SubMenu key={item.key} icon={null} title={item.title}>
                        {this.getMenuNodes_map(item.children)}
                    </SubMenu>
                )
            }
        })
    }

    /* 
     使用reduce完成生成标签数组

     */
    getMenuNodes = (menuList) => {
        const path = this.props.location.pathname
        return menuList.reduce((pre, item)=> {

            // 如果用户有对应权限才显示对应菜单项
            
            // 向pre中添加<Menu.item>或<Submenu>
            if(!item.children) {
                pre.push((
                    <Menu.Item key={item.key} icon={null}>
                        <Link to={item.key}>
                            {item.title}
                        </Link>
                    </Menu.Item>
                ))
            }else {
                // 查找一个与当前请求路径匹配的子item
                const cItem = item.children.find(cItem => path.indexOf(cItem.key) === 0)
                // 如果存在，说明当前item对应的子列表需要展开
                if(cItem) {
                    this.openKey = item.key
                }
                
                pre.push((
                    <SubMenu key={item.key} icon={null} title={item.title}>
                        {this.getMenuNodes(item.children)}
                    </SubMenu>
                ))
            }
            return pre
        }, [])
    }

    /* 
     在第一次render之前执行一次
     为第一次render准备数据，必须是同步的
    */
    componentWillMount () {
        this.menuNode = this.getMenuNodes(menuList)
    }

    render() {

        // 得到当前请求的路由路径
        let path = this.props.location.pathname
        const openKey = this.openKey
        if(path.indexOf('/product') === 0) {
            path = '/product'
        }
        return (
            <div>
               <div to="/" className="left-nav">
                    <Link className="left-nav-header" to='/'>
                        <img src={logo} alt=""/>
                        <h1>硅谷后台</h1>
                    </Link>
                </div> 
                <Menu
                    selectedKeys={[path]}
                    defaultOpenKeys={[openKey]}
                    mode="inline"
                    theme="dark"
                >
                    {this.menuNode}

                    
                </Menu> 
            </div>
            
        )
    }
}

/* 
 withRouter高阶组件
 包装非路由组件，返回一个新组件
 新的组件向非路由组件传递3个属性：history, location, match
*/
export default withRouter(leftNav) 