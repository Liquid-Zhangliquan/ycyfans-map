/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { Component } from 'react';
import './index.scss';

// eslint-disable-next-line react/prefer-stateless-function
class FansModal extends Component {
  constructor(props, context) {
    super(props, context);
    this.animateToView = this.animateToView.bind(this);
  }

  animateToView = (option) => {
    // 调用父组件方法
    // eslint-disable-next-line react/destructuring-assignment
    this.props.animateToView(option);
  }

  render() {
    const option1 = {
      name: '一生只够爱杨超越',
      sex: '女',
      birthday: '10-11',
      area: '深圳',
      hobby: '唱歌',
      style_lab: '超越冲鸭',
      location: [-73.99945670270819, 40.71011687983636],
      zoom: 16,
      pitch: 50.1,
      bearing: -10.8,
      img_url: require('../../../assets/images/girl-box.png'),
    };
    const option2 = {
      name: '换盏樱酒',
      sex: '女',
      birthday: '10-12',
      area: '深圳',
      hobby: '跳舞',
      style_lab: '超越冲鸭',
      location: [-74.00981836666949, 40.71931042243156],
      zoom: 16,
      pitch: 53.7,
      bearing: 169.8,
      img_url: require('../../../assets/images/girl-box.png'),
    };
    const option3 = {
      name: '则是一个小号',
      sex: '男',
      birthday: '10-18',
      area: '深圳',
      hobby: '旅游',
      style_lab: '超越冲鸭',
      location: [-74.01483796672744, 40.703115168018854],
      zoom: 16,
      pitch: 47.7,
      bearing: 60.6,
      img_url: require('../../../assets/images/boy-box.png'),
    };
    return (
      // eslint-disable-next-line react/jsx-filename-extension
      <div className="fans-modal">
        <div className="fans-modal-section" onClick={() => this.animateToView(option1)} />
        <div className="fans-modal-section" onClick={() => this.animateToView(option2)} />
        <div className="fans-modal-section" />
        <div className="fans-modal-section" />
        <div className="fans-modal-section" />
        <div className="fans-modal-section" onClick={() => this.animateToView(option3)} />
        <div className="fans-modal-more" />
      </div>
    );
  }
}

export default FansModal;
