import * as React from 'react';
import EchartsReact from 'echarts-for-react';
import echarts from 'echarts';
import './index.scss';

// 职业分析
class CareerAnalysis extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      option: {},
    };
  }

  componentDidMount() {
    const data = [];
    this.getOtionTem(data);
  }

  componentWillUnmount() {}

  getOtionTem = data => {
    data = [
      {
        name: '程序员',
        value: 750,
      },
      {
        name: '设计师',
        value: 350,
      },
      {
        name: '策划',
        value: 650,
      },
      {
        name: '程序员',
        value: 450,
      },
      {
        name: '设计师',
        value: 550,
      },
    ];
    const xData = [];
    const yData = [];
    data.forEach(v => {
      xData.push(v.value);
      yData.push(v.name);
    });
    const option = {
      // backgroundColor: '#202f34',
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        formatter: '{b} <br> 人数: {c}',
      },
      grid: {
        left: '16%',
        right: '4%',
        bottom: '8%',
        top: '30%',
        height: '60%',
        containLabel: true,
      },
      xAxis: {
        type: 'value',
        boundaryGap: [0, 0.01],
        axisLine: {
          show: false,
          lineStyle: {
            color: '#fff',
          },
        },
        splitLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },

        axisLabel: {
          show: false,
          formatter: '{value}',
          textStyle: {
            fontWeight: '80',
          },
        },
      },
      yAxis: {
        type: 'category',
        data: yData,
        offset: 70,
        axisLine: {
          show: false,
          lineStyle: {
            color: '#0c3b71',
          },
        },
        splitLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          show: true,
          interval: 0,
          rotate: 0,
          inside: false,
          align: 'left',
          textStyle: {
            color: '#fff',
            fontSize: 12,
            fontWeight: '50',
          },
        },
      },
      series: [
        {
          type: 'bar',
          barWidth: '8',
          itemStyle: {
            normal: {
              barBorderRadius: 30,
              color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
                {
                  offset: 0,
                  color: '#2f555d',
                },
                {
                  offset: 0.5,
                  color: '#61c4d7',
                },
                {
                  offset: 1,
                  color: '#6adcf1',
                },
              ]),
            },
          },
          label: {
            normal: {
              show: false,
              formatter: '{c}',
              // formatter: function(v) {
              //     var val = v.data;
              //     return val;
              // },
              color: '#fff',
            },
          },
          data: xData,
        },
      ],
    };
    this.setState({
      option,
    });
  };

  render() {
    const { option } = this.state;
    if (Object.keys(option).length === 0) {
      return <div />;
    }
    return (
      <div className="career-analysis">
        <div className="career-analysis-title">粉丝职业分析</div>
        <EchartsReact option={option} style={{ height: '100%', width: '100%' }} />
      </div>
    );
  }
}

export default CareerAnalysis;
