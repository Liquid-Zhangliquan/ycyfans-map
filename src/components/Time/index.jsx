import './index.scss';
import React from 'react';

class TimeBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = { date: new Date(), weather: null };
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }

  componentWillMount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({
      date: new Date()
    });
  }

  getCurrentHour() {
    let hour = this.state.date.getHours();
    hour < 10 ? hour = "0" + hour : null;
    return hour;
  }

  getCurrentMinute() {
    let minute = this.state.date.getMinutes();
    minute < 10 ? minute = "0" + minute : null;
    return minute;
  }

  getCurrentSecond() {
    let seconde = this.state.date.getSeconds();
    seconde < 10 ? seconde = "0" + seconde : null;
    return seconde;
  }
  render() {
    return (
      <div className="clock-div">
        {this.getCurrentHour().toString()}:
        {this.getCurrentMinute().toString()}:
        {this.getCurrentSecond().toString()}
      </div>
    );
  }
}

export default TimeBox;
