import 'maptalks/dist/maptalks.css';
import './index.scss';
import * as React from 'react';
import { PolygonLayer } from '@deck.gl/layers';
import { TripsLayer } from '@deck.gl/experimental-layers';
import * as maptalks from 'maptalks';
import DeckGLLayer from '@/plugin/deck-layer';

const Road_JSONURL = 'public/data/FSroads.json';
const Building_JSONURL = 'public/data/round1km.json';

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
    //地王大厦[114.10625205333713, 22.54747332086984]
    //腾讯大厦[113.93070594705296,22.544716216831006]
    //深圳湾体育中心[113.9450917453687, 22.521191452244267]
    //世界之窗[113.97653011313696, 22.543954735805272]
    this.map = new maptalks.Map(this.container, {
      center: [113.93070594705296, 22.544716216831006],//腾讯大厦
      zoom: 16,
      pitch: 54.4,
      bearing: -37.19,
      attribution: false,
      baseLayer: new maptalks.TileLayer('tile', {
        'urlTemplate': 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png',
        'subdomains': ['a', 'b', 'c', 'd']
      })
    });
    this.map.on('click', function (e) {
      console.log(e)
    })

    let me = this;
    //加载道路
    require('d3-request').json(Road_JSONURL, (error, response) => {
      if (!error) {
        this.setState({
          roaddata: response,
        });
      }
    });

    //加载建筑
    require('d3-request').json(Building_JSONURL, (error, response) => {
      if (!error) {
        const data = response.map(d => {
          let geoobj = {}
          geoobj.fid = d.FID;
          geoobj.height = d.Floor * 10 + 20;
          geoobj.geometry = d.json_geometry.coordinates[0];
          return geoobj;
        });
        this._animate(data);
        console.log(data); // eslint-disable-line
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
      buildingdata: data,
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
      buildingdata,roaddata
    } = this.state;
    if (buildingdata&&roaddata) {
      // eslint-disable-next-line
      const [loopLength, animationSpeed] = [1800, 30];
      const timestamp = Date.now() / 1000;
      const loopTime = loopLength / animationSpeed;
      const time = ((timestamp % loopTime) / loopTime) * loopLength;
      //console.log(time);
      const props = {
        layers: [
          new TripsLayer({
            id: 'trips',
            data: roaddata,
            getPath: d => d.segments,
            getColor: d => (d.vendor === 0 ? [253, 128, 93] : [23, 184, 190]),
            opacity: 0.3,
            strokeWidth: 2,
            trailLength: 80,
            currentTime: 1500
          }),
          new PolygonLayer({
            id: 'buildings',
            data: buildingdata,
            extruded: true,
            wireframe: false,
            fp64: true,
            opacity: 0.5,
            getPolygon: f => f.geometry,
            getElevation: f => f.height,
            getFillColor: [214, 22, 111],
            lightSettings: {
              lightsPosition: [114.11, 22.53, 8000, 115.11, 23.03, 5000],//114.110412055,22.5387
              ambientRatio: 0.05,
              diffuseRatio: 0.6,
              specularRatio: 0.8,
              lightsStrength: [2.0, 0.0, 0.0, 0.0],
              numberOfLights: 2
            }
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
