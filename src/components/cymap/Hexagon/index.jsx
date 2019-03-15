import 'maptalks/dist/maptalks.css';
import './index.scss';
import * as React from 'react';
// import { HexagonLayer } from 'deck.gl';
import * as maptalks from 'maptalks';
// import  '../../plugin/maptalks-deckgl/deckgl';
// import  '../../plugin/maptalks-deckgl/maptalks-deckgl';

// import DeckGLLayer from '../../plugin/deck-layer';

// const DATA_URL = 'https://raw.githubusercontent.com/uber-common/deck.gl-data/master/examples/3d-heatmap/heatmap-data.csv';

const LIGHT_SETTINGS = {
  lightsPosition: [-0.144528, 49.739968, 8000, -3.807751, 54.104682, 8000],
  ambientRatio: 0.4,
  diffuseRatio: 0.6,
  specularRatio: 0.2,
  lightsStrength: [0.8, 0.0, 0.8, 0.0],
  numberOfLights: 2,
};

const colorRange = [
  [1, 152, 189],
  [73, 227, 206],
  [216, 254, 181],
  [254, 237, 177],
  [254, 173, 84],
  [209, 55, 78],
];

const options = {
  radius: 1000,
  coverage: 1,
  upperPercentile: 100
}

const elevationScale = { min: 1, max: 50 };

class Hexagon extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {};

    this.container = null;
    this.map = null;
    this.deckLayer = null;
    this.data = null;

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
    // this.deckLayer = new maptalks.DeckGLLayer('kkkk', {});
    // this.map.addLayer(this.deckLayer);
    // require('d3-request').csv(DATA_URL, (error, response) => {
    //   debugger
    //   if (!error) {
    //     this.data = response.map(d => [Number(d.lng), Number(d.lat)]);
    //     // this._animate(data);
    //     console.log(this.data); // eslint-disable-line
    //   }
    // });
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
    const hexagonLayer = {
      layerType: "HexagonLayer",
      id: 'heatmap',
      colorRange: COLOR_RANGE,
      data,
      elevationRange: [0, 1000],
      elevationScale: 250,
      extruded: true,
      pickable: true,
      getPosition: d => d,
      onHover: info => { console.log(info) },
      lightSettings: LIGHT_SETTINGS,
      opacity: 1,
      ...options
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
