import * as React from 'react';
import EchartsReact from 'echarts-for-react';
import echarts from 'echarts';
import './index.scss';

const DATA = [{
  name: '广东',
  value: 480,
}, {
  name: '北京',
  value: 282,
}, {
  name: '广西',
  value: 710,
}, {
  name: '湖北',
  value: 800,
}, {
  name: '四川',
  value: 660,
}, {
  name: '江苏',
  value: 380,
}, {
  name: '湖南',
  value: 440,
}, {
  name: '山东',
  value: 870,
}, {
  name: '内蒙古',
  value: 880,
}];
// 区域排行
class RegionalRanking extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      option: {},
    };
  }

  componentDidMount() {
    const { echartsData = {} } = this.props;
    const city = echartsData.city || undefined;
    this.getOtionTem(city);
  }

  componentWillReceiveProps(nextProps) {
    const { echartsData = {} } = nextProps;
    const city = echartsData.city || undefined;
    this.getOtionTem(city);
  }

  componentWillUnmount() {

  }

  getOtionTem = (data = DATA) => {
    const xData = [];
    const yData = [];
    data.forEach((a) => {
      xData.push(a.name);
      yData.push(a.value);
    });
    const option = {
      // backgroundColor: '#072331',
      color: ['#3398DB'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow', // hover 半透明阴影
          // lineStyle: {
          //     opacity: 0
          // }
        },
      },
      grid: {
        left: '4%',
        right: '4%',
        bottom: '5%',
        top: '20%',
        height: '75%',
        containLabel: true,
        z: 22,
      },
      xAxis: [{
        type: 'category',
        gridIndex: 0,
        data: xData,
        axisTick: {
          show: false,
        },
        axisLine: {
          show: false,
          lineStyle: {
            color: '#0c3b71',
          },
        },
        axisLabel: {
          show: true,
          color: 'rgb(170,170,170)',
          fontSize: 12,
        },
      }],
      yAxis: [{
        type: 'value',
        gridIndex: 0,
        position: 'right',
        splitLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },

        axisLine: {
          show: false,
          lineStyle: {
            color: '#0c3b71',
          },
        },
        axisLabel: {
          color: 'rgb(170,170,170)',
          formatter: '{value}',
        },
      },
      ],
      series: [{
        name: '人数',
        type: 'bar',
        barWidth: '24%',
        xAxisIndex: 0,
        yAxisIndex: 0,
        itemStyle: {
          normal: {
            barBorderRadius: 30,
            color: new echarts.graphic.LinearGradient(
              0, 0, 1, 1, [{
                offset: 0,
                color: '#ff49b3',
              },
              {
                offset: 0.5,
                color: '#c3418f',
              },
              {
                offset: 1,
                color: '#5b3455',
              },
              ],
            ),
          },
        },
        data: yData,
        zlevel: 11,

      },
      ],
    };
    this.setState({
      option,
    });
  }

  render() {
    const { option } = this.state;
    if (Object.keys(option).length === 0) {
      return <div />;
    }
    return (
      <div className="regional-ranking">
        <div className="regional-ranking-title">粉丝区域排行榜</div>
        <EchartsReact option={option} style={{ height: '100%', width: '100%' }} />
      </div>
    );
  }
}

export default RegionalRanking;
