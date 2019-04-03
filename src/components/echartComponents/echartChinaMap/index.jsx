/* eslint-disable react/sort-comp */
import * as React from 'react';
import EchartsReact from 'echarts-for-react';
import echarts from 'echarts';
import axios from 'axios';
import { message } from 'antd';
import provinceProper from './provinceProper';
// import geoCoordMap from './geoCoordMap';
// import fans_data from './fans-data';
import './index.scss';

// echart地图
class EchartChina extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      option: {},
    };
    this.database = null;
    this.mapStack = [];
    this.curMap = {};
    this.onEvents = {
      // eslint-disable-next-line quote-props
      'click': this.onChartClick,
      // eslint-disable-next-line quote-props
      'dblclick': this.onChartDbClick,
    };
  }

  componentDidMount() {
    this.loadMap(provinceProper['中国'], 'china');
    // const data = [];
    // this.getOtionTem(data);
  }

  componentWillUnmount() { }

  getOtionTem = (mapname) => {
    const option = {
      backgroundColor: '#000',
      geo: {
        show: true,
        width: '90%',
        map: mapname,
        showLegendSymbol: false,
        zoom: 0.7,
        label: {
          normal: {
            show: true,
            textStyle: {
              color: 'none',
            },
          },
          emphasis: {
            show: true,
            textStyle: {
              color: 'none',
            },
          },
        },
        roam: true,
        itemStyle: {
          normal: {
            borderColor: '#ef0b4b',
            borderWidth: 1,
            shadowColor: '#ef0b4b',
            shadowBlur: 150,
            areaColor: '#112246',
            opacity: 0.3,
          },
          emphasis: {
            itemStyle: {
              borderColor: '#0ba3ae',
              borderWidth: 1,
              shadowColor: '#ef0b4b',
              shadowBlur: 50,
              areaColor: '#112246',
              opacity: 0.5,
            },
          },
        },
      },
    };
    this.setState({
      option,
    });
  }

  // convertData(data) {
  //   const res = [];
  //   for (let i = 0; i < data.length; i++) {
  //     const geoCoord = geoCoordMap[data[i].name];
  //     if (geoCoord) {
  //       res.push({
  //         name: data[i].name,
  //         value: geoCoord.concat(data[i].value),
  //         boy: data[i].boy,
  //         province: data[i].province,
  //       });
  //     }
  //   }
  //   database = res;
  //   return res;
  // }

  // filterdata(data, mapname) {
  //   // 下钻到省份时，过滤掉不属于该省的粉丝
  //   let res = [];
  //   if (mapname === 'china') {
  //     res = data;
  //     return res;
  //   }
  //   for (let i = 0; i < data.length; i++) {
  //     const geoCoord = geoCoordMap[data[i].name];
  //     if (geoCoord && ((data[i].province === mapname) || (data[i].name === mapname))) {
  //       res.push({
  //         name: data[i].name,
  //         value: data[i].value,
  //         boy: data[i].boy,
  //       });
  //     }
  //   }
  //   return res;
  // }

  loadMap = (url, mapname) => {
    const me = this;
    axios.get(url).then(res => {
      echarts.registerMap(mapname, res.data);
      me.getOtionTem(mapname);
      me.curMap = {
        // eslint-disable-next-line object-shorthand
        url: url,
        mapName: mapname,
      };
      me.mapStack.push({
        url: me.curMap.url,
        mapName: me.curMap.mapName,
      });
    }).catch(error => {
      message.error(error);
    });
  }

  onChartClick = (params) => {
    const mapname = params.name;
    if (mapname === '' || provinceProper[mapname] === undefined) {
      if (mapname === '深圳市') {
        return;
      }
      return;
    }
    this.loadMap(provinceProper[mapname], mapname);
  }

  // eslint-disable-next-line class-methods-use-this
  onChartDbClick = (params) => {
    console.log(params);
    if (this.mapStack.length === 1) {
      return;
    }
    this.loadMap(provinceProper['中国'], 'china');
  }

  render() {
    const { option } = this.state;
    if (Object.keys(option).length === 0) {
      return <div />;
    }
    return (
      <div className="echartChina">
        <EchartsReact option={option} style={{ height: '100%', width: '100%' }} onEvents={this.onEvents} />
      </div>
    );
  }
}

export default EchartChina;
