import React from 'react'
import PropTypes from 'prop-types'
import { Form,Select,Input } from 'antd'

/* 
添加分类组件
 */

const Option = Select.Option

export default class AddForm extends React.Component {
    constructor(props){
        super(props)
        this.state = {

        }
    }

    static propTypes = {
      categorys: PropTypes.array.isRequired,
      prarentId: PropTypes.string.isRequired,
      setForm: PropTypes.func.isRequired,
    }
    
    componentWillMount = () => {
      this.props.setForm(this.formRef)
    }

    formRef = React.createRef();

  render() {
    const {categorys, parentId} = this.props

    return (
      <Form ref={this.formRef} name="control-ref" onFinish={this.onFinish} initialValues=''>
        <Form.Item
          name="parentId"
          label=""
          rules={[
            {
              required: true,
            },
          ]}
          initialValue={parentId}
        >
          <Select
            placeholder="上级分类"
            onChange={this.onSelectChange}
            defaultValue={parentId}
          >
            <Option value="0">一级分类</Option>
            {
              categorys.map(item => <Option value={item._id}>{item.name}</Option>)
            }
          </Select>
        </Form.Item>
        <Form.Item
          name="categoryName"
          label=""
          rules={[
            {
              required: true,
              message:'分类名必须输入'
            },
          ]}
        >
          <Input placeholder="请输入分类名称" allowClear/>
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
