import './index.scss';
import React from 'react';
import axios from 'axios';

class WeatherBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = { weather: {} };
  }

  componentDidMount() {
    this.getCurrentWeather();
  }

  componentWillMount() { }

  getCurrentCity() {
    //根据ip定位，如果定位失败，默认北京
    axios.get('https://api.map.baidu.com/location/ip?&ak=yG5PPp07M54yW2Qb1ZUIXhjR22V13TOw&coor=bd09ll', {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "X-Requested-With,Content-Type",
      "Access-Control-Allow-Methods": "PUT,POST,GET,DELETE,OPTIONS"
    })
      .then(function (response) {
        console.log(response);
        if (response.status == 0) {

        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  getCurrentWeather() {
    let me = this;
    //获取武汉市天气
    axios.get('http://t.weather.sojson.com/api/weather/city/101200101')
      .then(function (response) {
        //console.log(response);
        if (response.status == 200) {
          let img='../../assets/img/weather/太阳.png';
          switch (response.data.data.forecast[0].type) {
            case "晴": img = require('../../assets/images/weather/太阳.png'); break;
            case "多云": img =  require('../../assets/images/weather/多云.png'); break;
            case "阴": img =  require('../../assets/images/weather/阴天.png'); break;
            case "小雨": img =  require('../../assets/images/weather/下雨.png'); break;
            case "中雨": img =  require('../../assets/images/weather/下雨.png'); break;
            case "大雨": img =  require('../../assets/images/weather/下雨.png'); break;
          }
          let _weather = {
            city: response.data.cityInfo.city,
            type: response.data.data.forecast[0].type,
            img: img,
            lowp: response.data.data.forecast[0].low.replace("低温", ""),
            highp: response.data.data.forecast[0].high.replace("高温", "")
          }
          //console.log(_weather);
          me.setState({
            weather: _weather
          })
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  render() {
    return (
      <div className="weather-div">
        {this.state.weather.city}
        <img src={this.state.weather.img}/>
        {this.state.weather.lowp}
      </div>
    );
  }
}

export default WeatherBox;
