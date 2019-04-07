import * as React from 'react';
import { number } from 'prop-types';
import $ from 'jquery';

import '@/plugin/numberAnimate/numberAnimate.css';

import './index.scss';

require('@/plugin/numberAnimate');

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
    this.weibo = 6896902;
    this.cat = 2042710;
    this.tieba = 5958944;
  }

  componentDidMount() {
    this.dataAnimate();
  }

  dataAnimate = () => {
    const me = this;
    const weibofans = $('#weibofans').numberAnimate({ num: me.weibo, speed: 2000, symbol: ',' });
    setInterval(() => {
      me.weibo += 7;
      weibofans.resetData(me.weibo);
    }, 3800);
    const catfans = $('#catfans').numberAnimate({ num: me.cat, speed: 2000, symbol: ',' });
    setInterval(() => {
      me.cat += 3;
      catfans.resetData(me.cat);
    }, 5400);
    const tiebafans = $('#tiebafans').numberAnimate({ num: me.tieba, speed: 2000, symbol: ',' });
    setInterval(() => {
      me.tieba += 6;
      tiebafans.resetData(me.tieba);
    }, 4000);
  }

  render() {
    const { weiboTotal, catTotal, allTotal } = this.props;
    return (
      <div className="static">
        <div className="static-content">
          <div className="static-title">微博粉丝数</div>
          <div className="static-total red" id="weibofans">{CymapStatic.thousand(weiboTotal || this.weibo)}</div>
        </div>
        <div className="static-content">
          <div className="static-title">猫眼人气值</div>
          <div className="static-total blue" id="catfans">{CymapStatic.thousand(catTotal || this.cat)}</div>
        </div>
        <div className="static-content">
          <div className="static-title">总助燃次数</div>
          <div className="static-total yellow" id="tiebafans">{CymapStatic.thousand(allTotal || this.tieba)}</div>
        </div>
      </div>
    );
  }
}

export default CymapStatic;
