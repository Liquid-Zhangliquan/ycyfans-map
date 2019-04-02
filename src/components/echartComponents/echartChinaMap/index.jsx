import * as React from 'react';
import EchartsReact from 'echarts-for-react';
import echarts from 'echarts';
import axios from 'axios';
import { message } from 'antd';
import provinceProper from './provinceProper';
import geoCoordMap from './geoCoordMap';
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
    this.curMap = {}
  }

  componentDidMount () {
    this.loadMap(provinceProper["中国"], 'china');
    // const data = [];
    // this.getOtionTem(data);
  }

  componentWillUnmount () { }

  convertData (data) {
    var res = [];
    for (var i = 0; i < data.length; i++) {
      var geoCoord = geoCoordMap[data[i].name];
      if (geoCoord) {
        res.push({
          name: data[i].name,
          value: geoCoord.concat(data[i].value),
          boy: data[i].boy,
          province: data[i].province,
        });
      }
    }
    database = res;
    return res;
  }

  filterdata (data, mapname) {
    //下钻到省份时，过滤掉不属于该省的粉丝
    var res = [];
    if (mapname === 'china') {
      res = data;
      return res;
    }
    for (var i = 0; i < data.length; i++) {
      var geoCoord = geoCoordMap[data[i].name];
      if (geoCoord && ((data[i].province === mapname) || (data[i].name === mapname))) {
        res.push({
          name: data[i].name,
          value: data[i].value,
          boy: data[i].boy,
        })

      }
    }
    return res;
  }

  loadMap (url, mapname) {
    let me = this;
    axios.get(url).then(res => {
      echarts.registerMap(mapname, res.data);
      me.getOtionTem(mapname);
    }).catch(error => {
      message.error(error);
    });
  }

  getOtionTem (mapname) {
    const option = {
      backgroundColor: '#000',
      visualMap: [{
        min: 838,
        max: 3038,
        color: ['#d94e5d', '#eac736', '#50a3ba'],
      }],
      geo: {
        show: true,
        width: '90%',
        map: mapname,
        zoom: 0.7,
        label: {
          normal: {
            show: true,
            textStyle: {
              color: 'none',
            }
          },
          emphasis: {
            show: true,
            textStyle: {
              color: 'none',
            }
          }
        },
        roam: true,
        itemStyle: {
          normal: {
            borderColor: '#ef0b4b',
            borderWidth: 1,
            shadowColor: '#ef0b4b',
            shadowBlur: 150,
            areaColor: '#112246',
            opacity: 0.3
          },
          emphasis: {
            itemStyle: {
              borderColor: '#0ba3ae',
              borderWidth: 1,
              shadowColor: '#ef0b4b',
              shadowBlur: 50,
              areaColor: '#112246',
              opacity: 0.5
            }
          }
        }
      }
    };
    this.setState({
      option,
    });
  };

  render () {
    const { option } = this.state;
    if (Object.keys(option).length === 0) {
      return <div />;
    }
    return (
      <div className="echartChina">
        <EchartsReact option={option} style={{ height: '100%', width: '100%' }} />
      </div>
    );
  }
}

export default EchartChina;
