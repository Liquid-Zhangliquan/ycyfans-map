import 'maptalks/dist/maptalks.css';
import './index.scss';
import * as React from 'react';
import { HexagonLayer } from 'deck.gl';
import * as maptalks from 'maptalks';
import { DeckGLLayer } from '../../../plugin/maptalks-deckgl/index';

const DATA_URL = 'https://raw.githubusercontent.com/uber-common/deck.gl-data/master/examples/3d-heatmap/heatmap-data.csv';
//失败，返回的是document元素
const DATA_CSVURL = '../../../static/data/heatmap-data.csv';
//放置至public下成功
const DATA_JSONURL = '../../../../public/data/heatmap-datajson.json';



const elevationScale = { min: 1, max: 50 };

class Hexagon extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {};

    this.container = null;
    this.map = null;
    this.deckLayer = null;
    this.data = null;
    this.LIGHT_SETTINGS = {
      lightsPosition: [-0.144528, 49.739968, 8000, -3.807751, 54.104682, 8000],
      ambientRatio: 0.4,
      diffuseRatio: 0.6,
      specularRatio: 0.2,
      lightsStrength: [0.8, 0.0, 0.8, 0.0],
      numberOfLights: 2,
    };

    this.colorRange = [
      [1, 152, 189],
      [73, 227, 206],
      [216, 254, 181],
      [254, 237, 177],
      [254, 173, 84],
      [209, 55, 78],
    ];

    this.options = {
      radius: 1000,
      coverage: 1,
      upperPercentile: 100
    }

    this.state = {
      elevationScale: elevationScale.min,
    };
  }

  componentDidMount() {
    this.map = new maptalks.Map(this.container, {
      center: [-1.4157267858730052, 52.232395363869415],
      zoom: 7,
      pitch: 40.5,
      bearing: -27.396674584323023,
      centerCross: true,
      baseLayer: new maptalks.TileLayer('tile', {
        urlTemplate: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png',
        subdomains: ['a', 'b', 'c', 'd'],
      }),
    });
    //this.deckLayer = new DeckGLLayer('kkkk', {});
    //this.map.addLayer(this.deckLayer);
    // require('d3-request').csv(DATA_CSVURL, (error, response) => {
    //   debugger
    //   if (!error) {
    //     this.data = response.map(d => [Number(d.lng), Number(d.lat)]);
    //     // this._animate(data);
    //     //this.addHexagonLayer();
    //     console.log(this.data); // eslint-disable-line
    //   }
    // });
    require('d3-request').json(DATA_JSONURL, (error, response) => {
      if (!error) {
        this.data = response.map(d => [Number(d.lng), Number(d.lat)]);
        // this._animate(data);
        //this.addHexagonLayer();
        //console.log(this.data); // eslint-disable-line
      }
    });
  }

  componentWillUnmount() {
    // this.map.remove()
    if (this.deckLayer) {
      this.deckLayer.remove();
    }
  }

  setRef = (x = null) => {
    this.container = x;
  };

  addHexagonLayer() {
    debugger
    let _data = this.data
    let _COLOR_RANGE = this.colorRange
    let _LIGHT_SETTINGS = this.LIGHT_SETTINGS
    let _options = this.options
    const hexagonLayer = {
      layerType: "HexagonLayer",
      id: 'heatmap',
      colorRange: _COLOR_RANGE,
      _data,
      elevationRange: [0, 1000],
      elevationScale: 250,
      extruded: true,
      pickable: true,
      getPosition: d => d,
      onHover: info => { console.log(info) },
      lightSettings: _LIGHT_SETTINGS,
      opacity: 1,
      ..._options
    };
    this.deckLayer.setProps({
      layers: [hexagonLayer]
    });
  }
  render() {
    //this.addHexagonLayer();
    return (<div ref={this.setRef} className="map-content" />);
  }
}

export default Hexagon;
