import React from 'react';
import { Card,Table, message,Button,Modal } from 'antd';
import { PlusOutlined,RightOutlined } from '@ant-design/icons';

import LinkButton from '../../components/link-button'

import {reqCategorys, reqUpdateCategory,reqAddCategory } from '../../api'

import AddForm from './add-form'
import UpdateForm from './update-form'



export default class Category extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '分类名称',
        dataIndex: 'name', // 显示数据对应的属性名
      },
      {
        title: '操作',
        dataIndex: 'opration',
        width: 300,
        render: (text,record) =>   // 返回需要显示的界面标签
            <span>
                <LinkButton onClick={() => this.showUpdate(record)}>修改分类</LinkButton>
                {/* 如何向事件回调函数传递参数：先定义一个匿名函数，在函数中调用处理函数并传递数据 */}
                {this.state.parentId === '0'?<LinkButton onClick={() => this.showSubCategorys(record)}>查看子分类</LinkButton>:null }
                
            </span>, 
      },
    ];
    this.state = {
      dataSource: [],
      loading: false,
      parentId: '0',
      parentName: '',
      subCategorys: [],
      showStatus:'0', //确认框是否显示，0不显示，1显示添加，2显示更新
    };
    this.record = {}
    this.form = {}
  }


  /* 
  异步获取一级/二级分类列表显示
   */
  getCategorys = async() => {
    // 在发请求前显示loading
    this.setState({loading:true})
    const {parentId} = this.state
    // 发异步ajax请求
    const response = await reqCategorys(parentId)

    // 请求结束后，隐藏loading
    this.setState({loading:false})
    if(response.status === 0) {
      // 取出分类数组（可能一级也可能二级）
      const dataSource = response.data.slice(0,30)
      if(parentId === '0') {
        this.setState({dataSource})
      } else {
        this.setState({
          subCategorys:dataSource
        })
      }
      // 更新状态
      this.setState({
        dataSource
      })
    } else {
      message.error('获取分类列表失败')
    }
  }

  /* 
    显示指定一级分类对象的二级子列表
     */
    showSubCategorys = (category) => {
      // 更新状态,异步的
      this.setState({
        parentId:category._id,
        parentName:category.name
      },() => {
        console.log(this.state.parentId)
        // 获取二级分类列表
        this.getCategorys()
      })
      
    }

    /* 
    返回一级分类列表
     */
    showFirstCategorys = () => {
      this.setState({
        parentId:'0',
        parentName:'',
        subCategorys:[]
      }, () => {
        this.getCategorys()
      })
    }
    
    /* 
    响应对话框点击取消：隐藏对话框
     */
    handleCancel = () => {
      if(this.form.current) {
        this.form.current.resetFields()
      }
      this.setState({
        showStatus:0
      })
    }
    /* 
    显示添加
     */
    showAdd = () => {
      this.setState({
        showStatus:1
      })
    }

    /* 
    添加分类 
    */
    addCategory = () => {
      console.log('addCategory()')
      this.form.current.validateFields().then(async(values) =>{
        // 发请求
        const {parentId,categoryName} = this.form.current.getFieldsValue()
        // 清除输入数据
        this.form.current.resetFields()
        const response = await reqAddCategory(categoryName,parentId)
        if(response.status === 0) {
          // 重新显示列表
          this.getCategorys()
        }
      }).catch(err => {
        message.error('表单输入有误')
      })      
      // 隐藏对话框
      this.setState({
        showStatus:0
      })
    }

    /* 
    显示修改对话框
     */
    showUpdate = (record) => {
      this.record = record
      this.setState({
        showStatus:2
      })
    }
    /* 
    更新分类
     */
    updateCategory = () => {
      console.log('updateCategory')
      // 进行表单验证
      this.form.current.validateFields().then(async(values) =>{
        // 发请求
        const categoryId = this.record._id
        const categoryName = this.form.current.getFieldValue('newName')
        // 清楚输入数据
        this.form.current.resetFields()
        const response = await reqUpdateCategory({categoryId,categoryName})
        if(response.status === 0) {
          // 重新显示列表
          this.getCategorys()
        }
      }).catch(err => {
        message.error('表单输入有误')
      })      
      // 隐藏对话框
      this.setState({
        showStatus:0
      })
    }


  componentDidMount() {
    this.getCategorys()
  }


  render() {
    const { dataSource,showStatus,parentId } = this.state;
    // 读取指定分类
    const categoryName = this.record.name || {}
    const columns = this.columns.map((col) => {
      if (!col.editable) {
        return col;
      }

      return {
        ...col,
        onCell: (record) => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
        }),
      };
    });
    const title = this.state.parentId === '0'? '一级分类标题':(
      <span>
        <LinkButton onClick={this.showFirstCategorys}>一级分类列表</LinkButton>
        <RightOutlined style={{marginRight: '5px'}}/>
        <span>{this.state.parentName}</span>
      </span>
    )
        // card的右侧按钮
        const extra = (
            <Button type='primary' onClick={this.showAdd}>
                <PlusOutlined />
                添加
            </Button>
            
        )
    return (
      <div>
        <Card title={title} extra={extra} style={{ width: '100%' }}>
          <Table
          rowClassName={() => 'editable-row'}
          bordered
          rowKey="_id"
          dataSource={dataSource}
          columns={columns}
        />      
        </Card>
        <Modal
          title="添加分类"
          visible={showStatus === 1}
          onOk={this.addCategory}
          onCancel={this.handleCancel}
        >
          <AddForm categorys={dataSource} parentId={parentId} setForm={form => this.form = form}/>
        </Modal>

        <Modal
          title="更新分类"
          visible={showStatus === 2}
          onOk={this.updateCategory}
          onCancel={this.handleCancel}
        >
          <UpdateForm categoryName={categoryName} setForm={form => this.form = form}></UpdateForm>
        </Modal>
      </div>
    );
  }
}
