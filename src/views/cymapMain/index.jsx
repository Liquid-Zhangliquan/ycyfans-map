import './index.scss';
import * as React from 'react';
import Time from 'components/Time';
import Weather from 'components/Weather';
import CymapStatic from 'components/static';
import EchartChinaMap from 'components/echartComponents/echartChinaMap';
// import Hexagon from 'components/cymap/Hexagon';
// import Trips from 'components/cymap/trips';
// import SzBuilding from 'components/cymap/SzBuilding';
import FansProportion from 'components/echartComponents/fans-proportion';
import FansIncrease from 'components/echartComponents/fans-increase';
import RegionalRanking from 'components/echartComponents/regional-ranking';
import CareerAnalysis from 'components/echartComponents/career-analysis';
import HotWords from 'components/echartComponents/hot-words';


class CymapMain extends React.Component {
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
      <div className="cymap-main">
        <div className="cymap-logo" />
        <div className="cymap-static">
          <CymapStatic />
        </div>
        <div className="TimeAndWeather">
          <Time />
          <Weather />
        </div>
        <div className="cymap-contain">
          <EchartChinaMap />
          {/* <Hexagon /> */}
          {/* <Trips/> */}
          {/* <SzBuilding /> */}
        </div>
        <div className="cymap-left">
          <div className="cymap-left__content">
            <FansProportion />
            <FansIncrease />
          </div>
        </div>
        <div className="cymap-right">
          <div className="cymap-right__content">
            <RegionalRanking />
            <CareerAnalysis />
            <HotWords />
          </div>
        </div>
      </div>
    );
  }
}

export default CymapMain;
