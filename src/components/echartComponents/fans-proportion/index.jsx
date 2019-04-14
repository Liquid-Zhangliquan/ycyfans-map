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

  render() {
    const { echartsData = {} } = this.props;
    console.log(echartsData);
    return (
      <div className="fans-proportion">
        <div className="fans-proportion-echarts">
          <CrescentMoonEcharts
            data={Object.keys(echartsData).length
              ? [echartsData.woman, echartsData.man] : undefined}
          />
        </div>
        <div className="fans-proportion-echarts">
          <VillageNameEcharts
            data={Object.keys(echartsData).length
              ? [echartsData.man, echartsData.woman] : undefined}
          />
        </div>
        <div className="fans-proportion-echarts">
          <FansEcharts data={Object.keys(echartsData).length
            ? echartsData.nation : undefined}
          />
        </div>
        <div className="fans-proportion-echarts">
          <NationEcharts data={Object.keys(echartsData).length
            ? echartsData.age : undefined}
          />
        </div>
      </div>
    );
  }
}

export default FansProportion;
