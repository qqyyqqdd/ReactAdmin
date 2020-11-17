import React from 'react'
import PropTypes from 'prop-types'
import { Form,Input,Select } from 'antd'



/* 
添加修改用户的组件
 */


const Option = Select.Option

export default class User extends React.Component {
    constructor(props){
        super(props)
        this.state = {

        }
    }

    static propTypes = {
      setForm: PropTypes.func.isRequired,
      roles: PropTypes.array.isRequired,
      user: PropTypes.object
    }
    
    componentWillMount = () => {
      this.props.setForm(this.formRef)
    }

    formRef = React.createRef();
  render() {

    const { roles,user } = this.props

    const formItemLayout = {
      labelCol:{span:4},
      wrapperCol:{span:12}
    }

    return (
      <Form ref={this.formRef} name="control-ref" onFinish={this.onFinish} initialValues='' {...formItemLayout}>
        <Form.Item
          name="username"
          initialValue={user.username}
          label="用户名"
          rules={[
            {
              required: true,
              message:'角色名必须输入'
            },
          ]}
        >
          <Input placeholder="请输入角色名称" allowClear/>
        </Form.Item>
        {
          user._id ? null:<Form.Item
          name="password"
          label="密码"
          rules={[
            {
              required: true,
              message:'密码必须输入'
            },
          ]}
        >
          <Input type='password' placeholder="请输入密码" allowClear/>
        </Form.Item>
        }
        
        <Form.Item
          name="phone"
          initialValue={user.phone}
          label="手机号"
          rules={[
            {
              required: true,
              message:'手机号必须输入'
            },
          ]}
        >
          <Input placeholder="请输入手机号" allowClear/>
        </Form.Item>
        <Form.Item
          name="email"
          initialValue={user.email}
          label="邮箱"
          rules={[
            {
              required: true,
              message:'邮箱必须输入'
            },
          ]}
        >
          <Input placeholder="请输入邮箱" allowClear/>
        </Form.Item>
        <Form.Item 
          name="role"
          initialValue={user.role_id}
          label="角色"
          rules={[
            {
              required: true,
              message:'请选择角色'
            },
          ]}
        >
          <Select placeholder='请选择分类'>
            {
              roles.map(role => <Option key={role._id} value={role._id}> {role.name}</Option>)
            }
          </Select>
        </Form.Item>
      </Form>
    );
  }
}
