import './index.scss';
import * as React from 'react';
import Hexagon from 'components/cymap/Hexagon';
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
        <div className="cymap-contain">
          <Hexagon />
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
