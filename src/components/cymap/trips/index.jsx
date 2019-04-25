import 'maptalks/dist/maptalks.css';
import './index.scss';
import axios from 'axios';
import * as React from 'react';
import { message } from 'antd';
import { PolygonLayer } from '@deck.gl/layers';
import { TripsLayer } from '@deck.gl/experimental-layers';
import * as maptalks from 'maptalks';
import DeckGLLayer from '@/plugin/deck-layer';

// const Trip_JSONURL = 'https://raw.githubusercontent.com/uber-common/deck.gl-data/master/examples/trips/trips.json';
// const Building_JSONURL = 'https://raw.githubusercontent.com/uber-common/deck.gl-data/master/examples/trips/buildings.json';
const Trip_JSONURL = 'public/data/trip/trip.json';
const Building_JSONURL = 'public/data/trip/building.json';

const elevationScale = { min: 1, max: 150 };

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
      center: [-74.00833043131627, 40.71075554599386],
      zoom: 15,
      pitch: 50.5,
      bearing: 14.4,
      attribution: false,
      baseLayer: new maptalks.TileLayer('tile', {
        urlTemplate: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png',
        subdomains: ['a', 'b', 'c', 'd'],
      }),
    });
    this.map.on('click', (e) => {
      console.log(e);
    });

    const road = axios.get(Trip_JSONURL);
    const building = axios.get(Building_JSONURL);
    Promise.all([
      road,
      building,
    ]).then(res => {
      if (res && res.length > 0) {
        this.setState({
          tripdata: res[0].data,
          buildingdata: res[1].data,
        });
        this._animate();
        this._renderLayers();
      }
    }).catch(error => {
      message.error(error);
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

  _animate() {
    this._stopAnimate();
    // wait 1.5 secs to start animation so that all data are loaded
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
    // eslint-disable-next-line react/destructuring-assignment
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
      tripdata,
      buildingdata,
    } = this.state;
    if (tripdata && buildingdata) {
      // eslint-disable-next-line
      const [loopLength, animationSpeed] = [1800, 30];
      const timestamp = Date.now() / 1000;
      const loopTime = loopLength / animationSpeed;
      const time = ((timestamp % loopTime) / loopTime) * loopLength;
      const props = {
        layers: [
          new TripsLayer({
            id: 'trips',
            data: tripdata,
            getPath: d => d.segments,
            getColor: d => (d.vendor === 0 ? [253, 128, 93] : [23, 184, 190]),
            opacity: 0.3,
            strokeWidth: 2,
            trailLength: 180,
            currentTime: time,
          }),
          new PolygonLayer({
            id: 'buildings',
            data: buildingdata,
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
              numberOfLights: 2,
            },
          }),
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
