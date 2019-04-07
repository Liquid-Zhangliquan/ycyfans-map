import './index.scss';
import * as React from 'react';
import {
  CSSTransition,
} from 'react-transition-group';
import Time from 'components/Time';
import Weather from 'components/Weather';
import CymapStatic from 'components/static';
import EchartChinaMap from 'components/echartComponents/echartChinaMap';
import Hexagon from 'components/cymap/Hexagon';
import Trips from 'components/cymap/trips';
import FansProportion from 'components/echartComponents/fans-proportion';
import FansIncrease from 'components/echartComponents/fans-increase';
import RegionalRanking from 'components/echartComponents/regional-ranking';
import CareerAnalysis from 'components/echartComponents/career-analysis';
import HotWords from 'components/echartComponents/hot-words';


class CymapMain extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      type: 1,
    };
    this.changeMap = this.changeMap.bind(this);
    this.getCitycode = this.getCitycode.bind(this);
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  // eslint-disable-next-line consistent-return
  getItem() {
    // eslint-disable-next-line react/destructuring-assignment
    if (this.state.type === 1) {
      return (
        // eslint-disable-next-line react/no-string-refs
        <EchartChinaMap key={1} changeMap={this.changeMap} getCitycode={this.getCitycode} />
      );
    }
    // eslint-disable-next-line react/destructuring-assignment
    if (this.state.type === 2) {
      return (
        <Hexagon key={2} />
      );
    }
    // eslint-disable-next-line react/destructuring-assignment
    if (this.state.type === 3) {
      return (
        <Trips key={3} />
      );
    }
  }

  getButtons() {
    const buttons = [
      {
        id: 'echartmap',
        title: 'echart中国',
        className: 'tab-item',
      },
      {
        id: 'heatmap',
        title: '3D热力图',
        className: 'tab-item',
      },
      {
        id: 'tripmap',
        title: '三维城市',
        className: 'tab-item',
      },
    ];
    return buttons.map((item, index) => (
      // eslint-disable-next-line
      <div {...item} key={item.id} onClick={() => this.changeMap(index + 1)} />
    ));
  }

  onRef = (ref) => {
    this.WeatherComp = ref;
  }

  getCitycode(code) {
    this.WeatherComp.getCurrentWeather(code);
  }

  changeMap(parm) {
    if (parm) {
      if (parm === 1) {
        this.setState({
          type: 1,
        });
      }
      if (parm === 2) {
        this.setState({
          type: 2,
        });
      }
      if (parm === 3) {
        this.setState({
          type: 3,
        });
      }
    } else {
      this.setState({
        type: 1,
      });
    }
  }

  render() {
    const item = this.getItem();
    return (
      <div className="cymap-main">
        <div className="cymap-logo" />
        <div className="cymap-static">
          <CymapStatic />
        </div>
        <div className="TimeAndWeather">
          <Time />
          <Weather onRef={this.onRef} getCitycode={this.getCitycode} />
        </div>
        <div className="cymap-tab">
          {
            this.getButtons()
          }
        </div>
        <div className="cymap-contain">
          <CSSTransition
            key="ec"
            timeout={500}
            classNames="item"
          >
            {item}
          </CSSTransition>
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
