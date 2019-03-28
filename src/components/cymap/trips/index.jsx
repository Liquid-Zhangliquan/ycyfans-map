import 'maptalks/dist/maptalks.css';
import './index.scss';
import * as React from 'react';
import { PolygonLayer } from '@deck.gl/layers';
import { TripsLayer } from '@deck.gl/experimental-layers';
import * as maptalks from 'maptalks';
import DeckGLLayer from '@/plugin/deck-layer';

// const DATA_URL = 'https://raw.githubusercontent.com/uber-common/deck.gl-data/master/examples/3d-heatmap/heatmap-data.csv';
const DATA_JSONURL = 'public/data/heatmap-datajson.json';

const elevationScale = { min: 1, max: 50 };

class Trips extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {};

    this.container = null;
    this.map = null;
    this.deckLayer = null;

    this.state = {
      elevationScale: elevationScale.min,
    };

    this.startAnimationTimer = null;
    this.intervalTimer = null;

    this._startAnimate = this._startAnimate.bind(this);
    this._animateHeight = this._animateHeight.bind(this);
  }

  componentDidMount() {
    this.map = new maptalks.Map(this.container, {
      center: [-74.00216099707364, 40.71357905656234],
      zoom: 15,
      pitch: 58.9,
      bearing: 53.4,
      attribution: false,
      baseLayer: new maptalks.TileLayer('tile', {
        'urlTemplate': 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png',
        'subdomains': ['a', 'b', 'c', 'd']
      })
    });
    this.map.on('click',function(e){
      console.log(e)
    })

    require('d3-request').json(DATA_JSONURL, (error, response) => {
      if (!error) {
        const data = response.map(d => [Number(d.lng), Number(d.lat)]);
        this._animate(data);
        //console.log(data); // eslint-disable-line
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

  _animate(data) {
    this.setState({
      data,
    });
    this._stopAnimate();
    //wait 1.5 secs to start animation so that all data are loaded
    this.startAnimationTimer = window.setTimeout(this._startAnimate, 1500);
  }

  _startAnimate() {
    this.intervalTimer = window.setInterval(this._animateHeight, 20);
  }

  _stopAnimate() {
    window.clearTimeout(this.startAnimationTimer);
    window.clearTimeout(this.intervalTimer);
  }

  _animateHeight() {
    // eslint-disable-next-line
    // this.setState({
    //   // eslint-disable-next-line
    //   elevationScale: this.state.elevationScale + 1,
    // });
    if (elevationScale.max === this.state.elevationScale) {
      this.setState({
        // eslint-disable-next-line
        elevationScale: 0,
      });
    } else {
      this.setState({
        // eslint-disable-next-line
        elevationScale: this.state.elevationScale + 1,
      });
    }
  }

  _renderLayers() {
    const {
      data
    } = this.state;
    if (data) {
      // eslint-disable-next-line
      const [loopLength, animationSpeed] = [1800, 30];
      const timestamp = Date.now() / 1000;
      const loopTime = loopLength / animationSpeed;
      const time = ((timestamp % loopTime) / loopTime) * loopLength;
      const props = {
        layers: [
          new TripsLayer({
            id: 'trips',
            data: 'https://raw.githubusercontent.com/uber-common/deck.gl-data/master/examples/trips/trips.json',
            getPath: d => d.segments,
            getColor: d => (d.vendor === 0 ? [253, 128, 93] : [23, 184, 190]),
            opacity: 0.3,
            strokeWidth: 2,
            trailLength: 180,
            currentTime: time
          }),
          new PolygonLayer({
            id: 'buildings',
            data: 'https://raw.githubusercontent.com/uber-common/deck.gl-data/master/examples/trips/buildings.json',
            extruded: true,
            wireframe: false,
            fp64: true,
            opacity: 0.5,
            getPolygon: f => f.polygon,
            getElevation: f => f.height,
            getFillColor: [74, 80, 87],
            lightSettings: {
              lightsPosition: [-74.05, 40.7, 8000, -73.5, 41, 5000],
              ambientRatio: 0.05,
              diffuseRatio: 0.6,
              specularRatio: 0.8,
              lightsStrength: [2.0, 0.0, 0.0, 0.0],
              numberOfLights: 2
            }
          })
        ],
      };
      if (!this.inited) {
        this.inited = true;
        this.deckLayer = new DeckGLLayer('deck', props, {
          animation: true,
          renderer: 'webgl',
        });
        this.map.addLayer(this.deckLayer);
      } else if (this.deckLayer) {
        this.deckLayer.setProps(props);
      }
    }
  }

  render() {
    this._renderLayers();
    return (<div ref={this.setRef} className="map-content" />);
  }
}

export default Trips;
