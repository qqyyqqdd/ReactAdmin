import React from 'react'
import { TreeSelect } from 'antd'
import PropTypes from 'prop-types'
import menuConfig from '../../config/menuConfig'

const { SHOW_PARENT } = TreeSelect;

export default class AuthForm extends React.Component {

    static propTypes = {
        role: PropTypes.object
    }

    constructor(props) {
        super(props)
        const {menus} = this.props.role
        this.state = {
            checkedKeys: menus
        }
    }
    
      onChange = value => {
        console.log('onChange ', value);
        this.setState({ checkedKeys:value });
      };

      getTreeNodes = (menuConfig) => {
        return menuConfig.reduce((pre, item) => {
            if(!item.children) {
                pre.push({
                    title: item.title,
                    key: item.key,
                    value: item.key
                })
            }else {
                pre.push({
                    title: item.title,
                    key: item.key,
                    value: item.key,
                    children: this.getTreeNodes(item.children)
                })
            }
            return pre
        },[])
      }

      /* 
      为父组件提供最新menus
       */

      getMenus = () => this.state.checkedKeys

      componentWillMount() {
        this.treeData = this.getTreeNodes(menuConfig)
      }
    
      /* 
      当组件接受到新的属性时自动调用 */
      UNSAFE_componentWillReceiveProps(nextProps) {
        const menus = nextProps.role.menus
        this.setState({
            checkedKeys:menus
        })
      }

      render() {
        const treeData = this.treeData
        const {checkedKeys} = this.state

        const tProps = {
          treeData,
          value: checkedKeys,
          onChange: this.onChange,
          treeCheckable: true,
          showCheckedStrategy: SHOW_PARENT,
          treeDefaultExpandAll:true,
          placeholder: '选择权限',
          style: {
            width: '100%',
          },
        };
        return <TreeSelect {...tProps} />;
      }
}