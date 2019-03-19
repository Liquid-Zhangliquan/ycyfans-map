import * as React from 'react';
import CrescentMoonEcharts from './component/crescentMoonEcharts';
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
          {/* <EchartsReact /> */}
        </div>
        <div className="fans-proportion-echarts">
          {/* <EchartsReact /> */}
        </div>
        <div className="fans-proportion-echarts">
          {/* <EchartsReact /> */}
        </div>
      </div>
    );
  }
}

export default FansProportion;
