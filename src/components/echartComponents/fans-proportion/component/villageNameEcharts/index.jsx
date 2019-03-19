import * as React from 'react';
import EchartsReact from 'echarts-for-react';
// import echarts from 'echarts';
import { array } from 'prop-types';

class VillageNameEcharts extends React.Component {
  static propTypes = {
    data: array,
  };

  constructor(props) {
    super(props);
    this.state = {
      option: {},
    };
  }

  componentDidMount() {
    const { data } = this.props;
    this.getOtionTem(data);
  }

  componentWillReceiveProps(nextProps) {
    const { data } = this.props;
    if (nextProps.data !== data) {
      this.getOtionTem(nextProps.data);
    }
  }

  getOtionTem = (parms = [80, 30]) => {
    const option = {
      graphic: [{
        type: 'text',
        left: 'center',
        top: '43%',
        style: {
          text: '45%',
          fill: '#fff',
          fontSize: 34,
        },
      }, {
        type: 'text',
        left: 'center',
        top: '59%',
        style: {
          text: '村民人数占比',
          fill: '#fff',
          font: 'normal 14px "Microsoft YaHei", sans-serif',
        },
      }],
      color: ['rgba(176, 212, 251, 1)'],
      series: [{
        name: 'Line 1',
        type: 'pie',
        clockWise: true,
        radius: ['72%', '84%'],
        center: ['50%', '53%'],
        startAngle: 15,
        itemStyle: {
          normal: {
            label: {
              show: false,
            },
            labelLine: {
              show: false,
            },
          },
        },
        hoverAnimation: true,
        data: [{
          value: parms[0],
          name: '01',
          itemStyle: {
            normal: {
              color: { // 完成的圆环的颜色
                colorStops: [{
                  offset: 0,
                  color: '#9366f4', // 0% 处的颜色
                }, {
                  offset: 1,
                  color: '#6b6df6', // 100% 处的颜色
                }],
              },
              label: {
                show: false,
              },
              labelLine: {
                show: false,
              },
            },
          },
        }, {
          name: '02',
          value: parms[1],
          itemStyle: {
            normal: {
              color: { // 完成的圆环的颜色
                colorStops: [{
                  offset: 0,
                  color: 'transparent', // 0% 处的颜色
                }, {
                  offset: 1,
                  color: 'transparent', // 100% 处的颜色
                }],
              },
              label: {
                show: false,
              },
              labelLine: {
                show: false,
              },
            },
          },
        }],
      }],
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
      <EchartsReact option={option} style={{ height: '100%', width: '100%' }} />
    );
  }
}

export default VillageNameEcharts;
