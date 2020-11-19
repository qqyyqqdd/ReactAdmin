import React from 'react'
import { Card, Button } from 'antd'
import ReactEcharts from 'echarts-for-react'

export default class Bar extends React.Component {
    
    state = {
        sales:[5, 20, 36, 10, 10, 20],
        storages:[6, 12, 30, 14, 15, 2]
    }

    update = () => {
        this.setState(state => ({
            sales:state.sales.map(sale => sale+1),
            storages:state.storages.map(storage => storage+1)
        }))
    }

    getOption = (sales, storages) => {
        return {title: {
            text: 'ECharts 入门示例'
        },
        tooltip: {},
        legend: {
            data:['销量','库存']
        },
        xAxis: {
            data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
        },
        yAxis: {},
        series: [{
            name: '销量',
            type: 'bar',
            data: sales
        },
        {
            name: '库存',
            type: 'bar',
            data: storages
        }
        ]}
    }

    render() {

        const { sales, storages } = this.state

        return (
            <div>
                <Card>
                    <Button type='primary' onClick = {this.update}>更新</Button>
                </Card>
                <Card title='柱状图1'>
                    <ReactEcharts option={this.getOption(sales, storages)}></ReactEcharts>
                </Card>
            </div>
        )
    }
}