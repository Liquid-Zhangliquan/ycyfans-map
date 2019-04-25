import './index.scss';
import React from 'react';
import axios from 'axios';

class WeatherBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = { weather: {} };
  }

  componentWillMount() { }

  componentDidMount() {
    // eslint-disable-next-line react/destructuring-assignment
    this.props.onRef(this);
    this.getCurrentWeather('101010100');
  }

  getCurrentCity() { // eslint-disable-line
    // 根据ip定位，如果定位失败，默认北京
    axios.get('https://api.map.baidu.com/location/ip?&ak=yG5PPp07M54yW2Qb1ZUIXhjR22V13TOw&coor=bd09ll', {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'X-Requested-With,Content-Type',
      'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS',
    })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  getCurrentWeather(citycode) {
    const me = this;
    const url = `http://t.weather.sojson.com/api/weather/city/${citycode}`;
    // 获取武汉市天气
    axios.get(url)
      .then((response) => {
        // console.log(response);
        if (response.status === 200) {
          let img = '../../assets/img/weather/太阳.png';
          switch (response.data.data.forecast[0].type) {
            case '晴': img = require('../../assets/images/weather/太阳.png'); break;
            case '多云': img = require('../../assets/images/weather/多云.png'); break;
            case '阴': img = require('../../assets/images/weather/阴天.png'); break;
            case '小雨': img = require('../../assets/images/weather/下雨.png'); break;
            case '中雨': img = require('../../assets/images/weather/下雨.png'); break;
            case '大雨': img = require('../../assets/images/weather/下雨.png'); break;
            default:
              img = '../../assets/img/weather/太阳.png';
              break;
          }
          const _weather = {
            city: response.data.cityInfo.city,
            type: response.data.data.forecast[0].type,
            img,
            lowp: response.data.data.forecast[0].low.replace('低温', ''),
            highp: response.data.data.forecast[0].high.replace('高温', ''),
          };
          // console.log(_weather);
          me.setState({
            weather: _weather,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    const { weather } = this.state;
    return (
      <div className="weather-div">
        {weather.city}
        <img alt="天气图标" src={weather.img} />
        {weather.highp}
      </div>
    );
  }
}

export default WeatherBox;
