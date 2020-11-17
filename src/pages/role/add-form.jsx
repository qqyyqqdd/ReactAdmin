import React from 'react'
import PropTypes from 'prop-types'
import { Form,Input } from 'antd'



/* 
添加角色组件
 */



export default class AddForm extends React.Component {
    constructor(props){
        super(props)
        this.state = {

        }
    }

    static propTypes = {
      setForm: PropTypes.func.isRequired,
    }
    
    componentWillMount = () => {
      this.props.setForm(this.formRef)
    }

    formRef = React.createRef();
  render() {

    return (
      <Form ref={this.formRef} name="control-ref" onFinish={this.onFinish} initialValues=''>
        <Form.Item
          name="roleName"
          label="角色名称"
          rules={[
            {
              required: true,
              message:'角色名必须输入'
            },
          ]}
        >
          <Input placeholder="请输入角色名称" allowClear/>
        </Form.Item>
      </Form>
    );
  }
}
