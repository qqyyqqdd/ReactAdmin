import React from 'react'
import { Upload, Modal, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'


import { reqDeleteImg } from '../../api'

import PropTypes from 'prop-types'
/* 
用于图片上传的组件
 */


function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

export default class PicturesWall extends React.Component {

    static propTypes = {
        imgs:PropTypes.array
    }

    state = {
        previewVisible: false, // 是否显示大图预览
        previewImage: '', // 大图的url
        previewTitle: '',
        fileList: []
      };
    constructor(props) {
        super(props)
        
        let fileList = []

        const {imgs} = this.props
        if(imgs && imgs.length > 0) {
            fileList = imgs.map((img,index) => ({
                uid: -index,
                name: img,
                status: 'done',
                url: 'http://39.100.225.255:5000/upload/'+img
            }))
        }

        this.state = {
            previewVisible: false, // 是否显示大图预览
            previewImage: '', // 大图的url
            previewTitle: '',
            fileList
        }
    }
    
      /* 
      隐藏预览图片的modal
       */
      handleCancel = () => this.setState({ previewVisible: false });
    
      handlePreview = async file => {
        if (!file.url && !file.preview) {
          file.preview = await getBase64(file.originFileObj);
        }
    
        this.setState({
          previewImage: file.url || file.preview,
          previewVisible: true,
          previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
        });
      };
    

      /* 
      file: 当前操作的文件
      fileList: 已上传的文件列表
       */
      handleChange = async({ file,fileList }) => {
          console.log('handleChange()')
        // 一旦上传成功，修正name url
        if(file.status === 'done') {
            const response = file.response
            if(response.status === 0) {
                message.success('图片上传成功')
                const { name, url } = response.data
                file = fileList[fileList.length-1]
                file.name = name
                file.url = url
            }else {
                message.error('图片上传失败')
            }
        } else if(file.status === 'removed') {
            console.log(file)
            const response = await reqDeleteImg('image-1605254406685.png')
            if(response.status === 0) {
                message.success('删除图片成功')
            }else {
                message.error('删除图片失败')
            }
        }
        this.setState({fileList})
      }
    
      /* 
      获取所有已上传的文件名数组
       */
      getImgs = () => {
          return this.state.fileList.map(file => file.name)
      }

      render() {
        const { previewVisible, previewImage, fileList, previewTitle } = this.state;
        const uploadButton = (
          <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
          </div>
        );
        return (
          <>
            <Upload
              name='image'
              accept='image/*'
              action="http://39.100.225.255:5000/manage/img/upload"
              listType="picture-card"
              fileList={fileList} // 上传文件的数组
              onPreview={this.handlePreview} // 显示大图
              onChange={this.handleChange} // 
            >
              {fileList.length >= 4 ? null : uploadButton}
            </Upload>
            <Modal
              visible={previewVisible}
              title={previewTitle}
              footer={null}
              onCancel={this.handleCancel}
            >
              <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
          </>
        );
      }
}