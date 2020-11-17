import React from 'react'
import PropTypes from 'prop-types'
import { Form,Input } from 'antd'

export default class UpdateForm extends React.Component {
    constructor(props){
        super(props)
        this.state = {

        }
    }
    static propTypes = {
      recordName: PropTypes.string.isRequired,
      setForm: PropTypes.func.isRequired
    }

    componentWillMount = () => {
      // 将form对象通过setForm()传递给父组件
      this.props.setForm(this.formRef)
    }


    formRef = React.createRef();
    
  render() {
    const {categoryName} = this.props
    return (
      <Form ref={this.formRef} name="control-ref" onFinish={this.onFinish} initialValues={categoryName}>
        <Form.Item
          name="newName"
          label=""
          rules={[
            {
              required: true,
              message:'请输入新名称'
            },
          ]}
        >
          <Input placeholder="请输入分类名称" allowClear defaultValue={categoryName} initialvalue={categoryName}/>
        </Form.Item>
        
        
        {/* <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
          <Button htmlType="button" onClick={this.onReset}>
            Reset
          </Button>
          <Button type="link" htmlType="button" onClick={this.onFill}>
            Fill form
          </Button>
        </Form.Item> */}
      </Form>
    );
  }
}