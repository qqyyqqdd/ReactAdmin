import React from 'react'
import {
    Card,
    Form,
    Input,
    Cascader,
    Button,
    message,
} from 'antd'
import { LeftOutlined } from '@ant-design/icons'
import LinkButton from '../../components/link-button'
import PicturesWall from './pictures-wall'
import RichTextEditor from './rich-text-editor'
import { reqCategorys, reqAddOrUpdateProduct } from '../../api'

const {Item} = Form
const { TextArea } = Input

/* 
Product的添加和修改子路由
 */


export default class ProductAddUpdate extends React.Component {
    formRef = React.createRef();


    constructor(props){
        super(props)
        this.state = {
            options:[],

        }
        this.pw = React.createRef()
        this.editor = React.createRef()
    }

    initOptions = async (categorys) => {
        const options = categorys.map(c => ({
            value:c._id,
            label:c.name,
            isLeaf:false,
        }))

        // 如果是一个二级分类商品的更新
        const {isUpdate, product} = this
        const {pCategoryId} = product
        if(isUpdate && pCategoryId !== '0') {
            // 获取二级分类列表
            const subCategory = await this.getCategorys(pCategoryId)
            // 生成二级列表
            const childOptions = subCategory.map(c=> ({
                value: c._id,
                label: c.name,
                isLeaf:true
            }))
            // 找到当前商品的一级option对象
            const targetOption = options.find(option => option.value === pCategoryId)
            // 关联到一级option
            targetOption.children = childOptions
        }
        this.setState({options})
    }


    getCategorys = async(parentId) => {
        const response = await reqCategorys(parentId) 
        if(response.status === 0) {
            const categorys = response.data
            if(parentId === '0') {
                this.initOptions(categorys)
            }else {
                return categorys
            }
            
        }
    }   
 
    submit = async() => {
        this.formRef.current.validateFields().then(() => {
            message.success('表单填写成功')
        }).catch(() =>{
            message.error('表单填写不完整')
        })
        // 收集数据并封装
        const imgs = this.pw.current.getImgs()
        const detail = this.editor.current.getDetail()
        const { name, desc, price, categoryIds} = this.formRef.current.getFieldsValue()
        console.log(this.formRef.current.getFieldsValue())
        let pCategoryId, categoryId
        if( categoryIds.length ===1) {
            pCategoryId = '0'
            categoryId = categoryIds[0]
        }else {
            pCategoryId = categoryIds[0]
            categoryId = categoryIds[1]
        }
        const product = { name, desc, price, imgs, detail, pCategoryId, categoryId }
        // 如果是更新
        if(this.isUpdate) {
            product._id = this.product._id
            product.isUpdate = true
        } else {
            product.isUpdate = false
        }
        // 调用接口
        console.log(product)
        const response = await reqAddOrUpdateProduct(product)
        // 接收结果
        if(response.status === 0) {
            message.success(this.isUpdate? '修改成功':'添加成功')
            this.props.history.goBack()
        }else {
            message.error(this.isUpdate? '修改失败':'添加失败')
        }
    }

    loadData = async selectedOptions => {
        const targetOption = selectedOptions[0];
        targetOption.loading = true;

        const subCategorys = await this.getCategorys(targetOption.value)
        targetOption.loading = false
        if(subCategorys && subCategorys.length > 0) {
            const childOptions = subCategorys.map(c=>({
                value:c._id,
                label:c.name,
                isLeaf:true,
            }))
            targetOption.children = childOptions
        }else {
            targetOption.isLeaf = true
        }
    
        this.setState({options:[...this.state.options]})

      };


    componentWillMount = () => {
        // 取出携带的数据
        const product = this.props.location.state
        this.isUpdate = !!product // 强制转换boolean类型
        // 保存商品
        this.product = product || {}
    }

    componentDidMount = () => {
        this.getCategorys('0')
    }
    
      
    render() {
        const {isUpdate, product} = this
        const {pCategoryId, categoryId, imgs, detail} = product
        const categoryIds = [] //接受分类级联的数组
        if(isUpdate) {
            // 一级分类商品
            if(pCategoryId === '0') {
                categoryIds.push(categoryId)
            }else {// 二级分类商品
                categoryIds.push(pCategoryId)
                categoryIds.push(categoryId)
            }
            
        }
        
        const title = (
            <span>
                <LinkButton onClick={() => this.props.history.goBack()}>
                    <LeftOutlined  style={{marginRight:10}}/>{isUpdate? '修改商品信息':'添加商品信息'}
                </LinkButton>
            </span>
        )
        
        const formItemLayout = {
            labelCol: {span: 2}, //指定label宽度
            wrapperCol: {span: 12} //指定右侧包裹宽度
        }
        return (
        <Card title={title}>
            <Form {...formItemLayout} ref={this.formRef}>
                <Item label="商品名称" name='name' initialValue={product.name}
                    rules={[
                        {
                        required: true,
                        message: '商品名称为必填项',
                        },
                    ]}>
                    <Input placeholder='请输入商品名称'/>
                </Item>
                <Item label="商品描述" name='desc' initialValue={product.desc}
                    rules={[
                        {
                        required: true,
                        message: '商品描述为必填项',
                        },
                    ]}>
                    <TextArea autoSize={{ minRows: 2, maxRows: 6 }} placeholder='请输入商品名称' />
                </Item>
                <Item label="商品价格" name='price' initialValue={product.price}
                    rules={[
                        {
                          required: true,
                          message: '商品价格为必填项',
                        },
                        ({ getFieldValue }) => ({
                          validator(rule, value,callback) {
                            if(value*1 >0) {

                            }else{
                                callback('价格必须大于0')
                            }
                          },
                        }),
                      ]}>
                    <Input type="number" addonAfter="元" placeholder='请输入商品价格'/>
                </Item>
                <Item label="商品分类" name='categoryIds' initialValue={categoryIds}
                     rules={[
                        {
                          required: true,
                          message: '商品分类为必填项',
                        },
                      ]}
                >
                    <Cascader
                        name='商品分类' 
                        options={this.state.options}
                        loadData={this.loadData}
                        placeholder='商品分类'
                    />
                </Item>
                <Item label="商品图片">
                    <PicturesWall ref={this.pw} imgs={imgs}></PicturesWall>
                </Item>
                <Item label="商品详情" labelCol={{span:2}} wrapperCol={{span: 20}}>
                    <RichTextEditor ref={this.editor} detail={detail}></RichTextEditor>
                </Item>
                <Item >
                    <Button type='primary' onClick={this.submit}>提交</Button>
                </Item>
            </Form>
        </Card>
        )
    }
}