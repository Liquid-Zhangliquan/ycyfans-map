import 'maptalks/dist/maptalks.css';
import './index.scss';
import axios from 'axios';
import * as React from 'react';
import { message } from 'antd';
import { PolygonLayer } from '@deck.gl/layers';
import { TripsLayer } from '@deck.gl/experimental-layers';
import * as maptalks from 'maptalks';
import DeckGLLayer from '@/plugin/deck-layer';

import randomColor from 'randomcolor';
import * as maptalksgl from '@/plugin/maptalksgl/maptalksgl';

import { GlowRingLayer, GlowRing } from '@/plugin/glowring';

import vert from '@/shader/ring.vertex.glsl';
import frag from '@/shader/ring.fragment.glsl';

import { animateInfo } from '@/utils/window-popover';

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

    this.glowringLayer = null;

    this.glowFeature = null;

    this.popover = null;

    this.popoverTimer = null;

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

    this.addGrowRingLayer();

    this.popoverTimer = window.setInterval(() => {
      this._showWindowPopover();
    }, 3000);
  }

  componentWillUnmount() {
    // this.map.remove()
    if (this.deckLayer) {
      this.deckLayer.remove();
    }
    if (this.popoverTimer) {
      window.clearInterval(this.popoverTimer);
      this.popoverTimer = null;
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

  _showWindowPopover() {
    this._removeFeaturePopover();
    this.popover = animateInfo(this.map, true); // 地图实例和是否自动定位
    this.addGlowRing({
      center: this.popover._coordinate,
      // center: new maptalks.Coordinate([-74.00833043131627, 40.71075554599386]),
      // color: [0.1, 0.9, 0.1],
      radius: 2.5,
      speed: 10.0,
      // type: 'radar',
    });
  }

  _removeFeaturePopover() {
    if (this.glowFeature) {
      this.glowFeature.remove();
    }
    if (this.popover) {
      this.popover.remove();
    }
  }

  addGrowRingLayer() {
    const { map } = this;
    // from https://github.com/liubgithub/maptalks.glowring
    const shader = {
      vert,
      frag,
      // 着色器程序中的uniform变量
      uniforms: [
        'iResolution',
        'iTime',
        'center',
        'iRadius',
        {
          name: 'projViewModelMatrix',
          type: 'function',
          fn(context, props) {
            console.log(maptalksgl);
            return maptalksgl.mat4.multiply([], props.projViewMatrix, props.modelMatrix);
          },
        },
      ],
      defines: {},
      extraCommandProps: {
        // transparent:true,
        depth: {
          enable: false,
        },
        blend: {
          enable: true,
          func: {
            srcRGB: 'src alpha',
            srcAlpha: 1,
            dstRGB: 'one',
            dstAlpha: 1,
          },
          equation: {
            rgb: 'add',
            alpha: 'add',
          },
          color: [0, 0, 0, 0],
        },
      },
    };
    const uniforms = {
      iResolution: [map.width, map.height],
      iTime: 0.0,
      center: [0, 0, 0],
      iRadius: 6.0,
    };
    this.glowringLayer = new GlowRingLayer('glowring').addTo(map);
    this.glowringLayer.registerShader('radar', 'MeshShader', shader, uniforms);
  }

  addGlowRing(config = {}) {
    const {
      center, color, radius, speed, type,
    } = config;
    const rc = randomColor({
      format: 'rgb', // e.g. 'rgb(225,200,20)'
    });
    const rgb = rc.toString().match(/\d+/g);
    const fogColor = rgb.map(item => Number((Number(item) / 255).toFixed(2)));
    if (type === 'radar') {
      const radar = new GlowRing(center, {
        shader: 'radar',
      }).addTo(this.glowringLayer);
      radar.setColor(color || fogColor);
      radar.setRadius(radius);
      if (speed) radar.setSpeed(speed);
      this.glowFeature = radar;
    } else {
      const ring = new GlowRing(center).addTo(this.glowringLayer);
      ring.setColor(color || fogColor);
      ring.setRadius(radius);
      ring.setSpeed(speed);
      this.glowFeature = ring;
    }
  }

  render() {
    this._renderLayers();
    return (<div ref={this.setRef} className="map-content" />);
  }
}

export default Trips;
