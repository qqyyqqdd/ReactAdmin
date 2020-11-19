import React from 'react'
import { Button, Row, Col } from 'antd'
import './not-found.less'


export default class NotFound extends React.Component {
    constructor(props){
        super(props)
        this.state = {

        }
    }

    goHome = () => {
        this.props.history.replace('/home')
    }

    render() {
        return (
            <Row className="not-found">
                <Col className="left" span={12}></Col>
                <Col className="right" span={12}>
                    <h1>404</h1>
                    <h2>抱歉，您访问的页面不存在</h2>
                    <div>
                        <Button type='primary' onClick={this.goHome}>
                            回到首页
                        </Button>
                    </div>
                </Col>
            </Row>
        )
    }
}