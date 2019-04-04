import * as React from 'react';
import EchartsReact from 'echarts-for-react';
// import echarts from 'echarts';
import { array } from 'prop-types';

class FansEcharts extends React.Component {
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

  getOtionTem = (parms = [80, 30, 60]) => {
    const option = {
      graphic: [{
        type: 'text',
        left: 'center',
        top: '36%',
        style: {
          text: '40%',
          fill: '#fff',
          fontSize: 34,
        },
      }, {
        type: 'text',
        left: 'center',
        top: '50%',
        style: {
          text: '民族分布比例',
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
        center: ['50%', '46%'],
        startAngle: 115,
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
                  color: '#5d98f1', // 0% 处的颜色
                }, {
                  offset: 1,
                  color: '#5dafe2', // 100% 处的颜色
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
                  color: '#d48ded', // 0% 处的颜色
                }, {
                  offset: 1,
                  color: '#7163f6', // 100% 处的颜色
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
          value: parms[2],
          itemStyle: {
            normal: {
              color: { // 完成的圆环的颜色
                colorStops: [{
                  offset: 0,
                  color: '#f185c9', // 0% 处的颜色
                }, {
                  offset: 1,
                  color: '#e9547a', // 100% 处的颜色
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

export default FansEcharts;
