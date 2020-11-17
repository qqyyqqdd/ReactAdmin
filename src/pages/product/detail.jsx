import React from 'react'
import {
    Card,
    List
} from 'antd'
import { LeftOutlined } from '@ant-design/icons'
import LinkButton from '../../components/link-button'
import { BASE_IMG_URL } from '../../utils/constant'

import { reqCategory } from '../../api'

const Item = List.Item
/* 
Product的详情子路由组件
 */

export default class ProductDetail extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            cName1:'', // 一级分类名称
            cName2:'', // 二级分类名称
        }
    }

    componentDidMount = async() => {
        const { pCategoryId, categoryId } = this.props.location.state
       if(pCategoryId === '0') {
        const response = await reqCategory(categoryId)
        const cName1 = response.data.name
        this.setState({cName1})
       }else {
        //    通过多个await方法发多个请求，后面的请求是在前一个请求成功返回后才发送，效率低

        /* const response1 = await reqCategory(pCategoryId)
        const response2 = await reqCategory(categoryId) */

        // 一次性发送多个请求
        const responses = await Promise.all([reqCategory(pCategoryId),reqCategory(categoryId)])
        const cName1 = responses[0].data.name
        const cName2 = responses[1].data.name
        this.setState({
            cName1,
            cName2
        })
       }
    }

    render() {
        // 读取携带来的state属性
        const { name, desc, price, detail,imgs } = this.props.location.state
        const { cName1,cName2 } = this.state
        const title =(
            <span>
                <LinkButton onClick= {() => this.props.history.goBack()} style={{marginRight:10}}><LeftOutlined /></LinkButton>
                <span>商品详情</span>
            </span>
        )

        return (
        <Card title={title} className="product-detail">
            <List>
                <Item>
                    <span className='left'>商品名称：</span>
                    <span>{name}</span>
                </Item>
                <Item>
                    <span className='left'>商品描述：</span>
                    <span className='right'>{desc}</span>
                </Item>
                <Item>
                    <span className='left'>商品价格：</span>
                    <span>{price}</span>
                </Item>
                <Item>
                    <span className='left'>所属分类：</span>
                    <span>{cName1} {cName2? '--> '+cName2:''}</span>
                </Item>
                <Item>
                    <span className='left'>商品图片：</span>
                    <span>
                        {
                            imgs.map(img => <img key={img} className="product-img" src={BASE_IMG_URL+img} alt='img' />)
                        }
                    </span>
                </Item>
                <Item>
                    <span className='left' >商品详情：</span>
                    <span dangerouslySetInnerHTML={{__html:detail}}></span>
                </Item>
            </List>
        </Card>
        )
    }
}