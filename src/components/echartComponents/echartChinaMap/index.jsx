/* eslint-disable react/sort-comp */
import * as React from 'react';
import EchartsReact from 'echarts-for-react';
import echarts from 'echarts';
import axios from 'axios';
import { message } from 'antd';
import provinceProper from './provinceProper';
import geoCoordMap from './geoCoordMap';
import fans_data from './fans-data';
import './index.scss';

// echart地图
class EchartChina extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      option: {},
    };
    this.element = null;
    this.h1 = document.createElement('h1');

    this.database = null;
    this.mapStack = [];
    this.curMap = {};
    this.onEvents = {
      // eslint-disable-next-line quote-props
      'click': this.onChartClick,
      // eslint-disable-next-line quote-props
      'dblclick': this.onChartDbClick,
      // eslint-disable-next-line quote-props
      'mouseover': this.onChartMouseover,
      // eslint-disable-next-line quote-props
      'mouseout': this.onChartMouseout,
    };
  }

  componentDidMount() {
    this.loadMap(provinceProper['中国'], 'china');
    this.convertData(fans_data);
  }

  componentWillUnmount() {

  }

  getCitycode = (code) => {
    // 调用父组件方法
    // eslint-disable-next-line react/destructuring-assignment
    this.props.getCitycode(code);
  }

  changeMap = (type) => {
    // 调用父组件方法
    // eslint-disable-next-line react/destructuring-assignment
    this.props.changeMap(type);
  }

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
            areaColor: '#112246',
            borderColor: '#fd0404cc',
            borderWidth: 3,
            shadowColor: '#ef0b4b',
            shadowBlur: 350,
            shadowOffsetX: 50,
            shadowOffsetY: 50,
            opacity: 0.3,
          },
        },
        emphasis: {
          itemStyle: {
            areaColor: '#ef0b4b',
            borderColor: '#ff0c00d9',
            borderWidth: 5,
            shadowColor: '#fd044ae0',
            shadowBlur: 200,
            shadowOffsetX: 20,
            shadowOffsetY: 20,
            opacity: 0.5,
          },
        },
      },
    };
    this.setState({
      option,
    });
  }

  convertData = (data) => {
    const res = [];
    for (let i = 0; i < data.length; i++) {
      const geoCoord = geoCoordMap[data[i].name];
      if (geoCoord) {
        res.push({
          name: data[i].name,
          value: geoCoord.concat(data[i].value),
          boy: data[i].boy,
          province: data[i].province,
        });
      }
    }
    this.database = res;
  }

  filterdata = (data, mapname) => {
    // 下钻到省份时，过滤掉不属于该省的粉丝
    let res = [];
    if (mapname === 'china') {
      res = data;
      return res;
    }
    for (let i = 0; i < data.length; i++) {
      const geoCoord = geoCoordMap[data[i].name];
      if (geoCoord && ((data[i].province === mapname) || (data[i].name === mapname))) {
        res.push({
          name: data[i].name,
          value: data[i].value,
          boy: data[i].boy,
        });
      }
    }
    return res;
  }

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
        this.getCitycode('101280601');
        this.changeMap(2);
      }
      return;
    }
    this.loadMap(provinceProper[mapname], mapname);
  }

  onChartDbClick = () => {
    if (this.mapStack.length === 1) {
      return;
    }
    this.loadMap(provinceProper['中国'], 'china');
  }

  onChartMouseover = (params) => {
    if (params.name === 'china') {
      return;
    }
    const data = this.filterdata(this.database, params.name);
    let total = 0; let boys = 0; let girls = 0;
    for (let i = 0; i < data.length; i++) {
      if (data[i].value[2]) { total += data[i].value[2]; }
      if (data[i].boy) { boys += data[i].boy; }
    }
    girls = (total - boys);
    this.h1.style['boder-radius'] = '5px';
    this.h1.style['boder-bottom'] = '1px solid rgba(255,255,255,.3)';
    this.h1.style['font-size'] = '18px';
    this.h1.style.padding = '5px';
    this.h1.style['padding-bottom'] = '7px';
    this.h1.style.position = 'absolute';
    this.h1.style.left = `${params.event.event.clientX + 80}px`;
    this.h1.style.top = `${params.event.event.clientY}px`;
    this.h1.style['background-color'] = 'rgba(0, 0,0,.5)';
    // this.h1.style.width = '160px';
    // this.h1.style.height = '110px';
    this.h1.style.color = '#60cdda';
    // eslint-disable-next-line no-useless-concat
    this.h1.innerHTML = `${params.name}<hr style="background-color:#60cdda;">` + `总人数： ${total}<br>` + `村民数： ${boys}<br>` + `月芽数： ${girls}`;
    // eslint-disable-next-line no-unused-expressions
    this.element ? null : this.element = document.getElementById('echartChina');
    this.element.append(this.h1);
  }

  onChartMouseout = () => {
    if (this.h1) {
      const nodelist = this.element.childNodes;
      if (nodelist[1]) {
        this.element.removeChild(nodelist[1]);
      }
    }
  }

  render() {
    const { option } = this.state;
    if (Object.keys(option).length === 0) {
      return <div />;
    }
    return (
      <div className="echartChina" id="echartChina">
        <EchartsReact option={option} style={{ height: '100%', width: '100%' }} onEvents={this.onEvents} />
      </div>
    );
  }
}

export default EchartChina;
