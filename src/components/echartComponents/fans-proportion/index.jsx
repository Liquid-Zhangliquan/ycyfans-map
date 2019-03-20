import * as React from 'react';
import CrescentMoonEcharts from './component/crescentMoonEcharts';
import VillageNameEcharts from './component/villageNameEcharts';
import NationEcharts from './component/nationEcharts';
import FansEcharts from './component/fansEcharts';
import './index.scss';


// 粉丝占比
class FansProportion extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {};
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render() {
    return (
      <div className="fans-proportion">
        <div className="fans-proportion-echarts">
          <CrescentMoonEcharts />
        </div>
        <div className="fans-proportion-echarts">
          <VillageNameEcharts />
        </div>
        <div className="fans-proportion-echarts">
          <FansEcharts />
        </div>
        <div className="fans-proportion-echarts">
          <NationEcharts />
        </div>
      </div>
    );
  }
}

export default FansProportion;
