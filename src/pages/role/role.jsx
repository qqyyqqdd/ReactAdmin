import React from 'react'
import { Card, Button, Table, Modal, message } from 'antd'

import { PAGE_SIZE } from '../../utils/constant'

import { reqRoles, reqAddRole, reqUpdateRole } from '../../api'
import AddForm from './add-form'
import AuthForm from './auth-form'
import { formateDate } from '../../utils/dateUtils'


export default class Role extends React.Component {

    constructor(props) {
        super(props) 

        this.auth = React.createRef()
    }
    
    state = {
        roles: [],
        role:{}, // 选中对象
        isShowAdd: false,
        isShowAuth: false,

    }

    initColunms = () => {
        this.columns = [
            {
                title:'角色名称',
                dataIndex:'name',
            },
            {
                title:'创建时间',
                dataIndex:'create_time',
                render:(create_time) => formateDate(create_time)
            },
            {
                title:'授权时间',
                dataIndex:'auth_time',
                render: formateDate
            },
            {
                title:'授权人',
                dataIndex:'auth_name',
            },
        ]
    }

    getRoles = async() => {
        const response = await reqRoles()
        if(response.status === 0) {
            const roles = response.data
            this.setState({roles})
        }
    }

    onRow = (role) => {
        return {
            onClick: event => {
                this.setState({role})
            }
        }
    }

    addRole = async() => {
        this.form.current.validateFields().catch(error=>{
            message.error('输入不合法 ',error)
        })
        const {roleName} = this.form.current.getFieldsValue()
        this.form.current.resetFields()
        const response = await reqAddRole(roleName)
        this.setState({isShowAdd:false})
        if(response.status === 0) {
            message.success('添加角色成功')
            const role = response.data
            // 更新roles状态
            this.setState(state=> ({
                roles:[...state.roles, role]
            }))
        }else {
            message.error('添加角色失败，请稍后重试')
        }
    }

    updateRole = async() => {
        const role = this.state.role
        const menus = this.auth.current.getMenus()
        role.menus = menus
        const response = await reqUpdateRole(role)
        this.setState({isShowAuth:false})
        if(response.status === 0) {
            message.success('设置成功')
            this.getRoles()
        }else {
            message.error('设置失败，请稍后重试')
        }
    }


    componentWillMount() {
        this.initColunms()
    }

    componentDidMount() {
        this.getRoles()
    }

    render() {

        const { roles,role, isShowAdd, isShowAuth } = this.state

        const title = (
            <span>
                <Button 
                    type='primary' 
                    style={{marginRight: 10}}
                    onClick={()=> this.setState({isShowAdd:true})}
                    >创建角色
                </Button>
                <Button type='primary' disabled={!role._id}
                    onClick={()=> this.setState({isShowAuth:true})}
                    >设置角色权限</Button>
            </span>
        )


        return (
        <Card title={title}>
            <Table 
                rowSelection={{type:'radio', selectedRowKeys:[role._id]}}
                bordered
                rowKey='_id'
                loading={false}
                dataSource={roles}
                columns={this.columns}
                pagination={{defaultPageSize:PAGE_SIZE}}
                onRow={this.onRow}
            />

            <Modal
                title = '添加角色'
                visible={isShowAdd}
                onOk={this.addRole}
                onCancel={()=> {
                    this.form.current.resetFields()
                    this.setState({isShowAdd:false})
                }}
            >
                <AddForm 
                    setForm={(form)=>this.form = form}
                /> 
            </Modal>
            <Modal
                title = '设置角色权限'
                visible={isShowAuth}
                onOk={this.updateRole}
                onCancel={()=> {
                    this.setState({isShowAuth:false})
                }}
            >
                <AuthForm role={role} ref={this.auth}/>
            </Modal>
        </Card>
        )
    }
}