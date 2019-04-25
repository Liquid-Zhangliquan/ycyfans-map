import './index.scss';
import React from 'react';
import { string } from 'prop-types';

/**
 * 0 123456
 * 1 23
 * 2 12457
 * 3 12347
 * 4 2367
 * 5 1367
 * 6 134567
 * 7 123
 * 8 1234567
 * 9 123467
 */
const ZERO = '123456';
const ONE = '23';
const TWO = '12457';
const THREE = '12347';
const FOUR = '2367';
const FIVE = '13467';
const SIX = '134567';
const SEVEN = '123';
const EIGHT = '1234567';
const NINE = '123467';

class TimeBox extends React.Component {
  static propTypes = {
    color: string,
  };

  constructor(props) {
    super(props);
    this.state = { times: ['0', '0', '0', '0', '0', '0'] };
  }

  componentWillMount() {
    clearInterval(this.timerID);
  }

  componentDidMount() {
    this.timerID = setInterval(() => this.getTime(), 1000);
  }

  getTime = () => {
    const DATE = new Date();
    let HOURS = DATE.getHours();
    if (HOURS < 10) {
      HOURS = `0${HOURS}`;
    }
    let MINUTES = DATE.getMinutes();
    if (MINUTES < 10) {
      MINUTES = `0${MINUTES}`;
    }
    let SECONDS = DATE.getSeconds();
    if (SECONDS < 10) {
      SECONDS = `0${SECONDS}`;
    }
    const times = `${HOURS}${MINUTES}${SECONDS}`;
    const arr = times.split('');
    const timeArr = [];
    arr.forEach(v => {
      timeArr.push(this.changeNumber(v));
    });
    this.setState({
      times: timeArr,
    });
  };

  changeNumber = (random = 0) => {
    random -= 0;
    let number = 0;
    switch (random) {
      case 0:
        number = ZERO;
        break;
      case 1:
        number = ONE;
        break;
      case 2:
        number = TWO;
        break;
      case 3:
        number = THREE;
        break;
      case 4:
        number = FOUR;
        break;
      case 5:
        number = FIVE;
        break;
      case 6:
        number = SIX;
        break;
      case 7:
        number = SEVEN;
        break;
      case 8:
        number = EIGHT;
        break;
      case 9:
        number = NINE;
        break;
      default:
        break;
    }
    return number;
  };

  // tick() {
  //   this.setState({
  //     date: new Date(),
  //   });
  // }

  // getCurrentHour() {
  //   let hour = this.state.date.getHours();
  //   hour < 10 ? hour = `0${hour}` : null;
  //   return hour;
  // }

  // getCurrentMinute() {
  //   let minute = this.state.date.getMinutes();
  //   minute < 10 ? minute = `0${minute}` : null;
  //   return minute;
  // }

  // getCurrentSecond() {
  //   let seconde = this.state.date.getSeconds();
  //   seconde < 10 ? seconde = `0${seconde}` : null;
  //   return seconde;
  // }

  render() {
    const { times } = this.state;
    const { color = '#26d5ec' } = this.props;
    return (
      <div className="number">
        <div className="digit minutes">
          {[1, 2, 3, 4, 5, 6, 7].map((v, index) => (
            <div
              key={`uuid_${index * 1}`}
              className={`segment ${times[0].includes(v) ? 'on' : ''}`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        <div className="digit minutes">
          {[1, 2, 3, 4, 5, 6, 7].map((v, index) => (
            <div
              key={`uuid_${index * 2}`}
              className={`segment ${times[1].includes(v) ? 'on' : ''}`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        <div className="circle">
          <div className="circle-boom" style={{ backgroundColor: color }} />
          <div className="circle-boom" style={{ backgroundColor: color }} />
        </div>
        <div className="digit minutes">
          {[1, 2, 3, 4, 5, 6, 7].map((v, index) => (
            <div
              key={`uuid_${index * 3}`}
              className={`segment ${times[2].includes(v) ? 'on' : ''}`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        <div className="digit minutes">
          {[1, 2, 3, 4, 5, 6, 7].map((v, index) => (
            <div
              key={`uuid_${index * 4}`}
              className={`segment ${times[3].includes(v) ? 'on' : ''}`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        <div className="circle">
          <div className="circle-boom" style={{ backgroundColor: color }} />
          <div className="circle-boom" style={{ backgroundColor: color }} />
        </div>
        <div className="digit minutes">
          {[1, 2, 3, 4, 5, 6, 7].map((v, index) => (
            <div
              key={`uuid_${index * 5}`}
              className={`segment ${times[4].includes(v) ? 'on' : ''}`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        <div className="digit minutes">
          {[1, 2, 3, 4, 5, 6, 7].map((v, index) => (
            <div
              key={`uuid_${index * 10}`}
              className={`segment ${times[5].includes(v) ? 'on' : ''}`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default TimeBox;
