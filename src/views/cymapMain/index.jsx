import './index.scss';
import * as React from 'react';
import Hexagon from '../../components/cymap/Hexagon';
import Fszb from '../../components/echartComponents/FansRatio';
import Zfqk from '../../components/echartComponents/Zfqk';
import Qyph from '../../components/echartComponents/Qyph';
import Zyfx from '../../components/echartComponents/Zyfx';
import Rcyt from '../../components/echartComponents/Rcyt';


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
    <div className="cymapMain">
        
        <div className="cymapLogo"/> 
        <div className="cymap_mapcontain">
          <Hexagon/>
        </div>
        <div className="fszb_contain">
          <Fszb/>
        </div>
        <div className="zfqk_contain">
          <Zfqk/>
        </div>
        <div className="qyph_contain">
          <Qyph/>
        </div>
        <div className="zyfx_contain">
          <Zyfx/>
        </div>
        <div className="rcyt_contain">
          <Rcyt/>
        </div>
    </div>);
  }
}

export default CymapMain;
