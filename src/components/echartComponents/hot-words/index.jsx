import * as React from 'react';
import './index.scss';


// 热词云图
class HotWords extends React.Component {
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
      <div className="hot-words">
        <div className="hot-words-title">热词云图展示</div>
      </div>
    );
  }
}

export default HotWords;
