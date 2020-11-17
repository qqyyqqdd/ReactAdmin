import React from 'react'
import {Redirect} from 'react-router-dom'
import { Form, Input, Button,message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

import './login.less'
import logo from '../../assets/images/logo.png'
import {reqLogin} from '../../api'
import memoryUtils from '../../utils/memoryUtils'
// 登录的路由组件


export default class Login extends React.Component {

    render() {

      // 如果用户已经登录，自动跳转到管理界面
      const user = memoryUtils.user
      if(user && user._id) {
        return <Redirect to='/'></Redirect>
      } 
      // 

        return <div className="login">
            <header className="login-header">
                <img src={logo} alt=""/>
                <h1>React项目：后台管理系统</h1>
            </header>


            <section className="login-content">
                <h2>用户登录</h2>
                {NormalLoginForm()}
            </section>

        </div>
    } 
}

const NormalLoginForm = () => {
    const onFinish = (async(values) => {
      console.log(values.username)
      try{
        const result = await reqLogin(values.username,values.password)
        console.log('请求成功',result)
        if(result.status === 0) { // 登录成功
          // 提示成功信息
          message.success('登录成功')

          // 保存user
          const user = result.data
          memoryUtils.user = user
          // 跳转到管理界面
          // 不需要回退，使用replace；需要回退，使用push
          console.log(this)
          this.props.history.replace('/home')

        }else { // 登录失败
          // 提示错误信息
          message.error(result.msg)
        }
      }catch (error) {
        console.log(error)
        alert('请求失败',error)
      }
      
      // console.log('Received values of form: ', values);

    });
  
    return (
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <Form.Item
          name="username"
          // 声明式验证
          rules={[
            { required: true, message: '请输入用户名' },
            { min:4, message:'用户名长度不能小于4位'},
            { max:12, message: '用户名至多12位'},
            { pattern:/^[a-zA-Z0-9_]+$/, message: '用户名必须是英文、数字或下划线的组合'}
          ]}
        >
          <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="用户名" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            { required: true, message: '请输入密码' },
            // ({ getFieldValue }) =>({
            //   validator(rules,value,callback) {
            //     if(!value) {
            //       callback("密码必须输入")
            //     }else if(value.length < 4) {
            //       callback("密码的长度不能小于4位")
            //     }else if(value.length > 12) {
            //       callback('密码的长度不能大于12位')
            //     }
            //   }
            // })
          ]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="密码"
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="login-form-button">
            登录
          </Button>
        </Form.Item>
      </Form>
    );
  };


  /*
  
  */