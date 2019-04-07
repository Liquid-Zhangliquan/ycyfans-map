import * as React from 'react';
import EchartsReact from 'echarts-for-react';
import echarts from 'echarts';
import './index.scss';


// 涨粉情况
class FansIncrease extends React.Component {
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

  componentWillUnmount() {

  }

  getOtionTem = (data) => {
    // eslint-disable-next-line max-len
    data = [3156, 2127, 2890, 2643, 2368, 3936, 3754, 3389, 2898, 2278, 2344, 1945];
    const xdata = ['02', '04', '06', '08', '10', '12', '14', '16', '18', '20', '22', '24'];
    const option = {
      grid: {
        left: '4%',
        top: '25%',
        right: '6%',
        bottom: '5%',
        height: '70%',
        containLabel: true,
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow', // hover 半透明阴影
          // lineStyle: {
          //     opacity: 0
          // }
        },
      },
      xAxis: {
        type: 'category',
        boundaryGap: true,
        data: xdata,
        triggerEvent: true,
        splitLine: {
          show: false,
        },
        axisLine: {
          show: false,
          lineStyle: {
            width: 0.5,
            color: 'rgba(255,255,255,.6)',
          },
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          color: 'rgba(255,255,255,.6)',
        },
      },
      yAxis: {
        show: true,
        position: 'right',
        name: '单位（个）',
        nameTextStyle: {
          color: '#fff',
          fontSize: 12,
          textShadowColor: '#000',
          textShadowOffsetY: 2,
        },
        type: 'value',
        splitLine: {
          show: false,
          lineStyle: {
            color: 'rgba(255,255,255,.2)',
          },
        },
        axisLine: {
          show: false,
          lineStyle: {
            width: 0.5,
            color: 'rgba(255,255,255,.6)',
          },
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          show: false,
          color: '#000',
        },
      },
      series: [{
        data,
        type: 'line',
        symbol: 'image://data:image/png;base64,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',
        symbolSize: 30,
        color: '#fff',
        smooth: true,
        lineStyle: {
          color: 'transparent',
        },
        label: {
          show: false,
          position: 'top',
          textStyle: {
            color: '#7B86F9',
          },
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: '#b9a6f3',
          }, {
            offset: 1,
            color: '#6369eb',
          }]),
        },
      }],
      // {
      //   type: 'bar',
      //   animation: true,
      //   barWidth: 1,
      //   hoverAnimation: true,
      //   data,
      //   tooltip: {
      //     show: false,
      //   },
      //   itemStyle: {
      //     normal: {
      //       color: {
      //         type: 'linear',
      //         x: 0,
      //         y: 0,
      //         x2: 0,
      //         y2: 1,
      //         colorStops: [{
      //           offset: 0,
      //           color: '#fff', // 0% 处的颜色
      //         }, {
      //           offset: 1,
      //           color: '#fff', // 100% 处的颜色
      //         }],
      //         globalCoord: false, // 缺省为 false
      //       },
      //       label: {
      //         show: false,
      //       },
      //     },
      //   },
      // }
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
      <div className="fans-increase">
        <div className="fans-increase-title">昨日涨粉情况</div>
        <EchartsReact option={option} style={{ height: '100%', width: '100%' }} />
      </div>
    );
  }
}

export default FansIncrease;
