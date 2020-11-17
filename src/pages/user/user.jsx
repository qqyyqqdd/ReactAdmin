import React from 'react'
import { Card, Button, Table, Modal, message } from 'antd' 
import { PAGE_SIZE } from '../../utils/constant'
import { formateDate } from '../../utils/dateUtils'
import LinkButton from '../../components/link-button'
import { ExclamationCircleOutlined } from '@ant-design/icons'

import UserForm from './user-form'

import { reqDeleteUser, reqUsers, reqAddOrUpdateUser } from '../../api'

export default class User extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            users:[],
            roles:[],
            user: {},
            isShow: false,
        }
    }

    initColumns = () => {
        this.columns = [
            {
                title:'用户名',
                dataIndex: 'username',
            },
            {
                title:'邮箱',
                dataIndex:'email'
            },
            {
                title:'电话',
                dataIndex:'phone'
            },
            {
                title:'注册时间',
                dataIndex:'create_time',
                render: formateDate
            },
            {
                title:'所属角色',
                dataIndex:'role_id',
                render: (role_id) => this.roleNames[role_id]
            },
            {
                title:'操作',
                render: (record) =>(
                    <span>
                        <LinkButton onClick={() => this.showUpdate(record)}>修改</LinkButton>
                        <LinkButton onClick ={() => this.deleteUser(record)}>删除</LinkButton>
                    </span>
                )
            }
        ]
    }

    initRoleNames = (roles) => {
        const roleNames = roles.reduce((pre,role) => {
            pre[role._id] = role.name
            return pre
        },{})
        this.roleNames = roleNames
    }

    getUsers = async() => {
        const response = await reqUsers()
        if(response.status === 0) {
            const { users, roles }= response.data
            this.initRoleNames(roles)
            this.setState({users, roles})
        }else {
            message.error('加载用户列表失败，请检查网络配置')
        }
    }

    addOrUpdateUser = async() => {
        console.log('add or update ',this.user)
        const user = this.form.current.getFieldsValue()
        this.form.current.resetFields()
        if(this.user) {
            user._id = this.user._id
        }

        const response = await reqAddOrUpdateUser(user)
        if(response.status === 0) {
            message.success(user._id? '修改用户成功':'添加用户成功')
            this.setState({isShow:false})
            this.getUsers()
        }else {
            message.error(user._id?'修改用户失败，请稍后重试':'添加用户失败，请稍后重试')
            console.log(response)
        }
    }

    showUpdate = (record) => {
        console.log("showUpdate:" ,record)
        this.user = record
        this.setState({isShow:true})
    }

    showAdd = () => {
        this.user = null
        this.setState({isShow:true})
    }
    
    handleCancel = () => {

    }


    deleteUser = (record) => {
        Modal.confirm({
            title: '确认删除',
            icon: <ExclamationCircleOutlined />,
            content: '确认删除用户？',
            okText: '确认',
            cancelText: '取消',
            onOk: async() => {
                const response = await reqDeleteUser(record._id)
                if(response.status === 0) {
                    message.success('删除用户成功')
                    this.getUsers()
                }else{
                    message.error('删除用户失败，请稍后重试')
                }
            }
        })
    }

    componentWillMount() {
        this.initColumns()
    }

    componentDidMount() {
        this.getUsers()
    }
     
    render() {
        const title = (<Button type='primary' onClick={()=>this.showAdd()}>创建用户</Button>)

        const  { users,isShow, roles } = this.state
        const user = this.user || {}

        return (
            <Card title={title}>
                <Table 
                    bordered
                    rowKey='_id'
                    dataSource={users}
                    columns={this.columns}
                    pagination={{ defaultPageSize:PAGE_SIZE}}
                />
                <Modal
                    title={user? '修改用户':'添加用户'}
                    visible={isShow}
                    onOk={this.addOrUpdateUser}
                    onCancel={() => {
                        this.form.current.resetFields()
                        this.setState({isShow:false})
                    }}
                    >
                    <UserForm setForm={(form) => this.form = form} roles={roles} user={user}></UserForm>
                </Modal>
            </Card>
        )
    }
}