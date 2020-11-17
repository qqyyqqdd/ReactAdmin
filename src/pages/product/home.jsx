import React from 'react'
import {
    Card,
    Select,
    Table,
    Input,
    Button,
    message
} from 'antd'
import { PlusOutlined } from '@ant-design/icons';
import LinkButton from '../../components/link-button'
import {PAGE_SIZE} from '../../utils/constant'

import { reqProducts,reqSearchProducts,reqUpdateStatus } from '../../api'

/* 
Product默认子路由组件
 */

const Option = Select.Option

export default class ProductHome extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            total:0, 
            products:[],
            loading: false,
            searchName: '',
            searchType: 'productName'
        }
    }

    
    initColumns = () => {
        this.columns = [
            {
              title: '商品名称',
              dataIndex: 'name',
            },
            {
              title: '商品描述',
              dataIndex: 'desc',
            },
            {
              title: '价格',
              dataIndex: 'price',
              render: (text) => '￥'+text
            },
            {
                title: '状态',
                width: 100,
                dataIndex: 'record',
                render: (text,record) => {
                    const {status, _id} = record
                    const newStatus = status === 1 ? 2:1
                    return (
                        <span>
                            <Button
                            type='primary'
                            onClick= {() => this.updateStatus(_id, newStatus)}>
                            {status === 1? '下架':'上架'}
                            </Button>
                            <span>{status === 1? '在销售':'已下架'}</span>
                        </span>
                    )
                }
            },
            {
                title: '操作',
                width: 100,
                render: (record) => {
                    return (<span>
                        <LinkButton onClick={() => this.props.history.push('/product/detail',record)}>详情</LinkButton>
                        <LinkButton onClick={() => this.props.history.push('/product/addupdate',record)}>修改</LinkButton>
                    </span>)
                    
                }
            }
          ];
          
    }

    /* 
    获取指定页码的列表数据显示
     */
    getProducts = async(pageNum) => {
        this.pageNum = pageNum // 保存pageNum，使别的方法看得到
        this.setState({loading:true})
        const { searchName, searchType } = this.state
        let response
        if(searchName) { // 搜索分页
            response = await reqSearchProducts({pageNum,pageSize:PAGE_SIZE,searchName,searchType})
        }else { // 一般分页
            response = await reqProducts(pageNum, PAGE_SIZE)
        }
        this.setState({loading:false})
        // 显示分页列表
        if(response.status === 0)    {
            console.log('response:', response)
            const { total, list } = response.data
            this.setState({
                total,
                products: list
            })
        } else {
            message.error('数据请求失败')
        }
    }

    /* 
    更新指定商品的状态
     */ 
    updateStatus = async(productId, status) => {
        console.log('productid:',productId)
        console.log('status:',status)
        const response = await reqUpdateStatus(productId,status)
        if(response.status === 0) {
            message.success('更新商品状态成功')
            this.getProducts(this.pageNum)
        } else {
            message.error('更新商品状态失败')
        }
    }

    componentWillMount = () => {
        this.initColumns()
    }

    componentDidMount = () => {
        this.getProducts(1)
    }

    render() {
        const { products,total,loading,searchType,searchName } = this.state
          
        const title = (
            <span>
                <Select defaultValue='1' value={searchType} onChange={value => this.setState({searchType:value})}> 
                    <Option value='productName'>按名称搜索</Option>
                    <Option value='productDesc'>按描述搜索</Option>
                </Select>
                <Input placeholder='关键字' style={{width:150,margin:'0 15px'}} value={searchName} 
                onChange={e => this.setState({searchName:e.target.value})}
                />
                <Button type='primary' onClick={() => this.getProducts(1)}>搜索</Button>
            </span>
        )
        const extra = (
            <Button type='primary' onClick={() => this.props.history.push('/product/addupdate')}>
                <PlusOutlined />添加商品
            </Button>
        )

        return (
        <Card title={title} extra = {extra}>
            <Table 
            loading={loading}
            bordered
            rowKey='_id'
            dataSource={products}
            columns={this.columns} 
            pagination={{
                total, 
                defaultPageSize:PAGE_SIZE, 
                showQuickJumper: true,
                onChange: this.getProducts
            }}
            />
        </Card>
        )
    }
}