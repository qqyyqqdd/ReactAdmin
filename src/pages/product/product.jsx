import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import ProductHome from './home'
import ProductAddUpdate from './add-update'
import ProductDetail from './detail'

import './product.less'

export default class Product extends React.Component {
    constructor(props){
        super(props)
        this.state = {

        }
    }

    render() {
        return (
        <div>
            <Switch> {/* 逐层匹配，只匹配其中一个， 设置exact表示路径完全匹配 */}
                <Route path='/product' component={ProductHome} exact/>
                <Route path='/product/addupdate' component={ProductAddUpdate} exact/>
                <Route path='/product/detail' component={ProductDetail} exact/>
                <Redirect to="/product" />
            </Switch>
        </div>
        )
    }
}