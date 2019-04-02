import * as React from 'react';
import { number } from 'prop-types';

import './index.scss';

class CymapStatic extends React.Component {
  static propTypes = {
    weiboTotal: number,
    catTotal: number,
    allTotal: number,
  };

  static thousand(num) {
    return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { weiboTotal, catTotal, allTotal } = this.props;
    return (
      <div className="static">
        <div className="static-content">
          <div className="static-title">微博粉丝数</div>
          <div className="static-total red">{CymapStatic.thousand(weiboTotal || 59584848)}</div>
        </div>
        <div className="static-content">
          <div className="static-title">猫眼人气值</div>
          <div className="static-total blue">{this.thousand(catTotal || 59584848)}</div>
        </div>
        <div className="static-content">
          <div className="static-title">总助燃次数</div>
          <div className="static-total yellow">{this.thousand(allTotal || 59584848)}</div>
        </div>
      </div>
    );
  }
}

export default CymapStatic;
