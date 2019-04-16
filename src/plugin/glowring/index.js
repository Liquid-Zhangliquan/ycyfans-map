/*!
 * maptalks.glowring v0.1.0
 * LICENSE : MIT
 * (c) 2016-2019 maptalks.org
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('maptalks'), require('@/plugin/maptalksgl/maptalksgl')) :
  typeof define === 'function' && define.amd ? define(['exports', 'maptalks', '@/plugin/maptalksgl/maptalksgl'], factory) :
  (factory((global.maptalks = global.maptalks || {}),global.maptalks,global.maptalksgl));
}(this, (function (exports,maptalks,gl) { 'use strict';

  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    subClass.__proto__ = superClass;
  }

  var planes = [];

  for (var i = 0; i < 6; i++) {
    planes[i] = [];
  }
  var p = [];
  function intersectsBox(matrix, box, mask) {
    setPlanes(matrix);

    for (var i = 0; i < 6; i++) {
      if (mask && mask.charAt(i) === '0') {
        continue;
      }

      var plane = planes[i];
      p[0] = plane[0] > 0 ? box[1][0] : box[0][0];
      p[1] = plane[1] > 0 ? box[1][1] : box[0][1];
      p[2] = plane[2] > 0 ? box[1][2] : box[0][2];

      if (distanceToPoint(plane, p) < 0) {
        return false;
      }
    }

    return true;
  }

  function setPlanes(m) {
    var me = m;
    var me0 = me[0],
        me1 = me[1],
        me2 = me[2],
        me3 = me[3];
    var me4 = me[4],
        me5 = me[5],
        me6 = me[6],
        me7 = me[7];
    var me8 = me[8],
        me9 = me[9],
        me10 = me[10],
        me11 = me[11];
    var me12 = me[12],
        me13 = me[13],
        me14 = me[14],
        me15 = me[15];
    setComponents(planes[0], me3 - me0, me7 - me4, me11 - me8, me15 - me12);
    setComponents(planes[1], me3 + me0, me7 + me4, me11 + me8, me15 + me12);
    setComponents(planes[2], me3 + me1, me7 + me5, me11 + me9, me15 + me13);
    setComponents(planes[3], me3 - me1, me7 - me5, me11 - me9, me15 - me13);
    setComponents(planes[4], me3 - me2, me7 - me6, me11 - me10, me15 - me14);
    setComponents(planes[5], me3 + me2, me7 + me6, me11 + me10, me15 + me14);
  }

  var normalLength = 1.0 / 6;

  function setComponents(out, x, y, z, w) {
    out[0] = x * normalLength;
    out[1] = y * normalLength;
    out[2] = z * normalLength;
    out[3] = w * normalLength;
    return out;
  }

  function distanceToPoint(plane, p) {
    return plane[0] * p[0] + plane[1] * p[1] + plane[2] * p[2] + plane[3];
  }

  var vert = "#ifdef GL_ES\n\n    precision highp float;\n\n#endif\n\n    attribute vec3 aPosition;\n\n            \n\n    uniform vec3 center;\n\n    uniform mat4 projViewModelMatrix;\n\n    uniform mat4 modelMatrix;\n\n    varying vec3 v_FragPos; \n\n    varying vec3 v_center;\n\n    void main(){\n\n       gl_Position=projViewModelMatrix*vec4(aPosition,1.);\n\n       vec4 worldPos = modelMatrix * vec4(aPosition, 1.0);\n\n       v_FragPos = worldPos.xyz;\n\n       v_center = (modelMatrix * vec4(center, 1.0)).xyz;\n\n    }\n\n";

  var frag = "#ifdef GL_ES\n\n   precision highp float;\n\n#endif\n\n#define pi 3.14159\n\nconst float dotsnb = 30.0; // Number of dots\n\n\n\nvarying vec3 v_FragPos;\n\nvarying vec3 v_center;\n\nuniform vec2 iResolution;\n\nuniform float iTime;\n\nuniform float iRadius;\n\nuniform vec3 iColor;\n\nuniform float iSpeed;\n\nvec3 hsb2rgb(in vec3 c)\n\n{\n\n   vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0,0.0,1.0 );\n\n   rgb = rgb*rgb*(4.0-2.0*rgb);\n\n   return c.z * mix( vec3(1.0), rgb, c.y);\n\n}\n\n\n\nvoid main()\n\n{\n\n  float r = length(v_FragPos - v_center);\n\n  r = r*2.-1.;\n\n  if(r>iRadius) {\n\n    gl_FragColor = vec4(1.0,1.0,1.0, 0.0);\n\n  } else {\n\n    //vec3 color = hsb2rgb(vec3(fract(iTime*.1),.7,.4));\n\n    vec3 color = iColor;\n\n    float s = abs(sin(pow(r+5.0, 1.5)-iTime*iSpeed+sin(r*0.9))*sin(r+.99));\n\n    color *= (abs(1./(s*10.8))-.01);\n\n    gl_FragColor = vec4(color, (color.x + color.y + color.z) / 1.0);\n\n  }\n\n}";

  var GlowRingRenderer = function (_maptalks$renderer$Ca) {
    _inheritsLoose(GlowRingRenderer, _maptalks$renderer$Ca);

    function GlowRingRenderer() {
      return _maptalks$renderer$Ca.apply(this, arguments) || this;
    }

    var _proto = GlowRingRenderer.prototype;

    _proto.draw = function draw() {
      this.prepareCanvas();

      this._renderScene();
    };

    _proto.needToRedraw = function needToRedraw() {
      return true;
    };

    _proto.drawOnInteracting = function drawOnInteracting() {
      this._renderScene();
    };

    _proto.hitDetect = function hitDetect() {
      return false;
    };

    _proto.createContext = function createContext() {
      if (this.canvas.gl && this.canvas.gl.wrap) {
        this.gl = this.canvas.gl.wrap();
      } else {
        var layer = this.layer;
        var attributes = layer.options.glOptions || {
          alpha: true,
          depth: true,
          antialias: true,
          stencil: true
        };
        this.glOptions = attributes;
        this.gl = this.gl || this._createGLContext(this.canvas, attributes);
      }

      this.regl = gl.createREGL({
        gl: this.gl,
        extensions: ['OES_standard_derivatives'],
        optionalExtensions: this.layer.options['glExtensions'] || []
      });

      this._initRenderer();

      this._createAllScene();
    };

    _proto._initRenderer = function _initRenderer() {
      var map = this.layer.getMap();
      var renderer = new gl.reshader.Renderer(this.regl);
      this.renderer = renderer;
      this._uniforms = {
        'projViewMatrix': map.projViewMatrix
      };

      this._initDefaultShader();
    };

    _proto._createAllScene = function _createAllScene() {
      if (this.layer._ringList) {
        for (var name in this.layer._ringList) {
          var ring = this.layer._ringList[name];

          if (!ring.isCreatedScene) {
            this._createMesh(ring);
          }
        }
      }
    };

    _proto._createMesh = function _createMesh(ring) {
      var geometry = new gl.reshader.Geometry({
        aPosition: ring._vertices
      }, ring._indices, 0, {
        primitive: 'triangles',
        positionAttribute: 'aPosition'
      });
      geometry.generateBuffers(this.regl);
      var ringMesh = new gl.reshader.Mesh(geometry);
      var position = coordinateToWorld(this.layer.getMap(), ring.getCoordinates(), ring.getHeight());
      var transformMat = gl.mat4.identity([]);
      gl.mat4.translate(transformMat, transformMat, position);
      gl.mat4.scale(transformMat, transformMat, [5.0, 5.0, 5.0]);
      ringMesh.setLocalTransform(transformMat);
      var scene = new gl.reshader.Scene(ringMesh);
      ring._scene = scene;
      ring.isCreatedScene = true;
      this.setToRedraw();
    };

    _proto._initDefaultShader = function _initDefaultShader() {
      var defaultShader = this._getDefaultShader();

      this._registerShader('default', 'MeshShader', defaultShader.shader, defaultShader.uniforms);
    };

    _proto._registerShader = function _registerShader(name, type, config, uniforms) {
      this._shaderList = this._shaderList || {};
      this._shaderList[name] = {
        shader: new gl.reshader[type](config),
        uniforms: uniforms
      };
    };

    _proto.clearCanvas = function clearCanvas() {
      if (!this.canvas) {
        return;
      }

      this.regl.clear({
        color: [0, 0, 0, 0],
        depth: 1,
        stencil: 0
      });

      _maptalks$renderer$Ca.prototype.clearCanvas.call(this);
    };

    _proto._renderScene = function _renderScene() {
      for (var uid in this.layer._ringList) {
        var ring = this.layer._ringList[uid];

        if (!ring.isVisible()) {
          continue;
        }

        this._updateSceneMatrix(ring);

        var toRenderScene = this._createSceneInFrustum(ring._scene);

        if (!toRenderScene) {
          continue;
        }

        var shaderName = ring.getShader() || 'default';

        if (!ring.getShader()) {
          ring.setShader(shaderName);
        }

        var shaderItem = this._shaderList[shaderName];
        var markerUniforms = maptalks.Util.extend({}, shaderItem.uniforms, ring.getUniforms());
        markerUniforms.iTime += 0.01;
        var uniforms = maptalks.Util.extend({}, markerUniforms, this._uniforms);
        ring.setUniforms(uniforms);
        this.renderer.render(shaderItem.shader, uniforms, toRenderScene, null);
      }

      this.completeRender();
    };

    _proto._createSceneInFrustum = function _createSceneInFrustum(scene) {
      var meshes = scene.getMeshes();
      var len = meshes.length;
      var map = this.layer.getMap();
      var visibles = [];
      var v0 = [],
          v1 = [];

      for (var i = 0; i < len; i++) {
        var mesh = meshes[i];
        var box = mesh.geometry.boundingBox;
        var min = box.min;
        var max = box.max;
        gl.vec4.set(v0, min[0], min[1], min[2], 1);
        gl.vec4.set(v1, max[0], max[1], max[2], 1);
        var boxMin = gl.vec4.transformMat4(v0, v0, mesh.localTransform);
        var boxMax = gl.vec4.transformMat4(v1, v1, mesh.localTransform);

        if (intersectsBox(map.projViewMatrix, [boxMin, boxMax])) {
          visibles.push(mesh);
        }
      }

      return visibles.length ? new gl.reshader.Scene(visibles) : null;
    };

    _proto._updateSceneMatrix = function _updateSceneMatrix(ring) {
      var meshes = ring._scene.getMeshes();

      var position = coordinateToWorld(this.layer.getMap(), ring.getCoordinates(), ring.getHeight());
      var transformMat = gl.mat4.identity([]);
      gl.mat4.translate(transformMat, transformMat, position);
      gl.mat4.scale(transformMat, transformMat, [5.0, 5.0, 5.0]);
      meshes.forEach(function (mesh) {
        mesh.setLocalTransform(transformMat);
      });
    };

    _proto._deleteScene = function _deleteScene(ring) {
      if (defined(ring)) {
        this._disposeMesh(ring);

        this.setToRedraw();
      }
    };

    _proto._deleteAll = function _deleteAll() {
      for (var uid in this.layer._ringList) {
        this._disposeMesh(this.layer._ringList[uid]);
      }

      this.layer._ringList = {};
      this.layer._rings = [];
      this.setToRedraw();
    };

    _proto._disposeMesh = function _disposeMesh(ring) {
      var meshes = ring._scene.getMeshes();

      meshes.forEach(function (mesh) {
        mesh.geometry.dispose();

        if (mesh.material) {
          mesh.material.dispose();
        }

        mesh.dispose();
      });
    };

    _proto._createGLContext = function _createGLContext(canvas, options) {
      var names = ['webgl', 'experimental-webgl'];
      var context = null;

      for (var i = 0; i < names.length; ++i) {
        try {
          context = canvas.getContext(names[i], options);
        } catch (e) {}

        if (context) {
          break;
        }
      }

      return context;
    };

    _proto._getDefaultShader = function _getDefaultShader() {
      var map = this.layer.getMap();
      var shader = {
        vert: vert,
        frag: frag,
        uniforms: ['iResolution', 'iTime', 'center', 'iRadius', 'iColor', 'iSpeed', {
          name: 'projViewModelMatrix',
          type: 'function',
          fn: function fn(context, props) {
            return gl.mat4.multiply([], props['projViewMatrix'], props['modelMatrix']);
          }
        }],
        defines: {},
        extraCommandProps: {
          depth: {
            enable: false
          },
          blend: {
            enable: true,
            func: {
              srcRGB: 'src alpha',
              srcAlpha: 1,
              dstRGB: 'one',
              dstAlpha: 1
            },
            equation: {
              rgb: 'add',
              alpha: 'add'
            },
            color: [0, 0, 0, 0]
          }
        }
      };
      var uniforms = {
        'iResolution': [map.width, map.height],
        'iTime': 0.0,
        'center': [0, 0, 0],
        'iRadius': 1.0,
        'iColor': [1.0, 0.0, 0.0],
        'iSpeed': 3.0
      };
      return {
        shader: shader,
        uniforms: uniforms
      };
    };

    return GlowRingRenderer;
  }(maptalks.renderer.CanvasRenderer);

  function isNil(obj) {
    return obj === null || obj === undefined;
  }

  function defined(obj) {
    return !isNil(obj);
  }

  function coordinateToWorld(map, coordinate, z) {
    if (!map) {
      return null;
    }

    var p = map.coordinateToPoint(coordinate, getTargetZoom(map));
    return [p.x, p.y, z];
  }

  function getTargetZoom(map) {
    return map.getGLZoom();
  }

  var options = {
    renderer: 'gl',
    forceRenderOnZooming: true,
    forceRenderOnMoving: true,
    forceRenderOnRotating: true
  };
  var uid = 0;

  var GlowRingLayer = function (_maptalks$Layer) {
    _inheritsLoose(GlowRingLayer, _maptalks$Layer);

    function GlowRingLayer(id, options) {
      var _this;

      _this = _maptalks$Layer.call(this, id, options) || this;
      _this._ringList = {};
      _this._rings = [];
      return _this;
    }

    var _proto = GlowRingLayer.prototype;

    _proto.addRings = function addRings(rings) {
      var _this2 = this;

      if (Array.isArray(rings)) {
        rings.forEach(function (ring) {
          _this2.addRings(ring);
        });
      } else {
        this._ringList[uid] = rings;

        this._rings.push(rings);

        rings._uid = uid;
        rings.options.iTime = 0.0;
        uid++;

        var renderer = this._getRenderer();

        if (renderer) {
          if (renderer.regl) {
            renderer._createMesh(rings);
          }
        }
      }
    };

    _proto.removeRings = function removeRings(rings) {
      var _this3 = this;

      if (Array.isArray(rings)) {
        rings.forEach(function (ring) {
          _this3.removeRings(ring);
        });
      } else {
        delete this._ringList[rings._uid];

        var renderer = this._getRenderer();

        if (renderer) {
          renderer._deleteScene(rings);
        }
      }
    };

    _proto.getAll = function getAll() {
      return this._rings;
    };

    _proto.clear = function clear() {
      var renderer = this._getRenderer();

      if (renderer) {
        renderer._deleteAll();
      }
    };

    _proto.registerShader = function registerShader(name, type, config, uniforms) {
      var renderer = this._getRenderer();

      if (renderer) {
        renderer._registerShader(name, type, config, uniforms);
      }
    };

    return GlowRingLayer;
  }(maptalks.Layer);

  GlowRingLayer.mergeOptions(options);
  GlowRingLayer.registerRenderer('gl', GlowRingRenderer);

  var options$1 = {
    scale: 1.0,
    isVisible: true
  };
  var vertices = [-1.0, 1.0, 0.0, -1.0, -1.0, 0.0, 1.0, -1.0, 0.0, 1.0, 1.0, 0.0];
  var indiecs = [0, 1, 2, 0, 2, 3];

  var GlowRing = function (_Eventable) {
    _inheritsLoose(GlowRing, _Eventable);

    function GlowRing(coordinates, options) {
      var _this;

      _this = _Eventable.call(this, options) || this;
      var uniforms = _this.options.uniforms || {};
      _this.options.uniforms = JSON.parse(JSON.stringify(uniforms));
      _this._coordinates = coordinates;
      _this._vertices = vertices;
      _this._indices = indiecs;
      return _this;
    }

    var _proto = GlowRing.prototype;

    _proto.addTo = function addTo(layer) {
      layer.addRings(this);
      this._layer = layer;
      return this;
    };

    _proto.remove = function remove() {
      if (this._layer) {
        this._layer.removeRings(this);
      }
    };

    _proto.show = function show() {
      this.options.isVisible = true;
      return this;
    };

    _proto.hide = function hide() {
      this.options.isVisible = false;
    };

    _proto.isVisible = function isVisible() {
      return this.options.isVisible;
    };

    _proto.getCoordinates = function getCoordinates() {
      return this._coordinates;
    };

    _proto.setCoordinates = function setCoordinates(coordinates) {
      this._coordinates = coordinates;
      return this;
    };

    _proto.setHeight = function setHeight(height) {
      this.options.height = height;
      return this;
    };

    _proto.getHeight = function getHeight() {
      return this.options.height || 0.1;
    };

    _proto.getShader = function getShader() {
      return this.options.shader;
    };

    _proto.setShader = function setShader(name) {
      this.options.shader = name;
      return this;
    };

    _proto.setColor = function setColor(color) {
      this.options.uniforms.iColor = color;
      return this;
    };

    _proto.setSpeed = function setSpeed(speed) {
      this.options.uniforms.iSpeed = speed;
      return this;
    };

    _proto.setRadius = function setRadius(radius) {
      this.options.uniforms.iRadius = radius;
      return this;
    };

    _proto.getRadius = function getRadius() {
      return this.options.uniforms.iRadius || 1.0;
    };

    _proto.setUniforms = function setUniforms(uniforms) {
      this.options.uniforms = uniforms;
      return this;
    };

    _proto.getUniforms = function getUniforms() {
      return this.options.uniforms;
    };

    return GlowRing;
  }(maptalks.Eventable(maptalks.Handlerable(maptalks.Class)));
  GlowRing.mergeOptions(options$1);

  exports.GlowRingLayer = GlowRingLayer;
  exports.GlowRing = GlowRing;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwdGFsa3MuZ2xvd3JpbmctZGV2LmpzIiwic291cmNlcyI6WyIuLi9ub2RlX21vZHVsZXMvZnJ1c3R1bS1pbnRlcnNlY3RzL3NyYy9pbmRleC5qcyIsIi4uL3NyYy9HbG93UmluZ1JlbmRlcmVyLmpzIiwiLi4vc3JjL0dsb3dSaW5nTGF5ZXIuanMiLCIuLi9zcmMvR2xvd1JpbmcuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyohXHJcbiogQ29udGFpbnMgY29kZSBmcm9tIFRIUkVFLmpzXHJcbiogTUlUIExpY2Vuc2VcclxuKiBodHRwczovL2dpdGh1Yi5jb20vbXJkb29iL3RocmVlLmpzXHJcbiovXHJcblxyXG52YXIgcGxhbmVzID0gW107XHJcbmZvciAodmFyIGkgPSAwOyBpIDwgNjsgaSsrKSB7XHJcbiAgICBwbGFuZXNbaV0gPSBbXTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGludGVyc2VjdHNTcGhlcmUobWF0cml4LCBzcGhlcmUsIG1hc2spIHtcclxuICAgIHNldFBsYW5lcyhtYXRyaXgpO1xyXG4gICAgdmFyIGNlbnRlciA9IHNwaGVyZVswXTtcclxuICAgIHZhciBuZWdSYWRpdXMgPSAtc3BoZXJlWzFdO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCA2OyBpKyspIHtcclxuICAgICAgICBpZiAobWFzayAmJiBtYXNrLmNoYXJBdChpKSA9PT0gJzAnKSB7XHJcbiAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgZGlzdGFuY2UgPSBkaXN0YW5jZVRvUG9pbnQocGxhbmVzW2ldLCBjZW50ZXIpO1xyXG4gICAgICAgIGlmIChkaXN0YW5jZSA8IG5lZ1JhZGl1cykge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRydWU7XHJcbn1cclxuXHJcbnZhciBwID0gW107XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaW50ZXJzZWN0c0JveChtYXRyaXgsIGJveCwgbWFzaykge1xyXG4gICAgc2V0UGxhbmVzKG1hdHJpeCk7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IDY7IGkrKykge1xyXG4gICAgICAgIGlmIChtYXNrICYmIG1hc2suY2hhckF0KGkpID09PSAnMCcpIHtcclxuICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBwbGFuZSA9IHBsYW5lc1tpXTtcclxuICAgICAgICAvLyBjb3JuZXIgYXQgbWF4IGRpc3RhbmNlXHJcbiAgICAgICAgcFswXSA9IHBsYW5lWzBdID4gMCA/IGJveFsxXVswXSA6IGJveFswXVswXTtcclxuICAgICAgICBwWzFdID0gcGxhbmVbMV0gPiAwID8gYm94WzFdWzFdIDogYm94WzBdWzFdO1xyXG4gICAgICAgIHBbMl0gPSBwbGFuZVsyXSA+IDAgPyBib3hbMV1bMl0gOiBib3hbMF1bMl07XHJcblxyXG4gICAgICAgIGlmIChkaXN0YW5jZVRvUG9pbnQocGxhbmUsIHApIDwgMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0cnVlO1xyXG59XHJcblxyXG5mdW5jdGlvbiBzZXRQbGFuZXMobSkge1xyXG4gICAgdmFyIG1lID0gbTtcclxuICAgIHZhciBtZTAgPSBtZVswXSwgbWUxID0gbWVbMV0sIG1lMiA9IG1lWzJdLCBtZTMgPSBtZVszXTtcclxuICAgIHZhciBtZTQgPSBtZVs0XSwgbWU1ID0gbWVbNV0sIG1lNiA9IG1lWzZdLCBtZTcgPSBtZVs3XTtcclxuICAgIHZhciBtZTggPSBtZVs4XSwgbWU5ID0gbWVbOV0sIG1lMTAgPSBtZVsxMF0sIG1lMTEgPSBtZVsxMV07XHJcbiAgICB2YXIgbWUxMiA9IG1lWzEyXSwgbWUxMyA9IG1lWzEzXSwgbWUxNCA9IG1lWzE0XSwgbWUxNSA9IG1lWzE1XTtcclxuXHJcbiAgICAvL3JpZ2h0XHJcbiAgICBzZXRDb21wb25lbnRzKHBsYW5lc1swXSwgbWUzIC0gbWUwLCBtZTcgLSBtZTQsIG1lMTEgLSBtZTgsIG1lMTUgLSBtZTEyKTtcclxuICAgIC8vbGVmdFxyXG4gICAgc2V0Q29tcG9uZW50cyhwbGFuZXNbMV0sIG1lMyArIG1lMCwgbWU3ICsgbWU0LCBtZTExICsgbWU4LCBtZTE1ICsgbWUxMik7XHJcbiAgICAvL2JvdHRvbVxyXG4gICAgc2V0Q29tcG9uZW50cyhwbGFuZXNbMl0sIG1lMyArIG1lMSwgbWU3ICsgbWU1LCBtZTExICsgbWU5LCBtZTE1ICsgbWUxMyk7XHJcbiAgICAvL3RvcFxyXG4gICAgc2V0Q29tcG9uZW50cyhwbGFuZXNbM10sIG1lMyAtIG1lMSwgbWU3IC0gbWU1LCBtZTExIC0gbWU5LCBtZTE1IC0gbWUxMyk7XHJcbiAgICAvL3otZmFyXHJcbiAgICBzZXRDb21wb25lbnRzKHBsYW5lc1s0XSwgbWUzIC0gbWUyLCBtZTcgLSBtZTYsIG1lMTEgLSBtZTEwLCBtZTE1IC0gbWUxNCk7XHJcbiAgICAvL3otbmVhclxyXG4gICAgc2V0Q29tcG9uZW50cyhwbGFuZXNbNV0sIG1lMyArIG1lMiwgbWU3ICsgbWU2LCBtZTExICsgbWUxMCwgbWUxNSArIG1lMTQpO1xyXG59XHJcblxyXG52YXIgbm9ybWFsTGVuZ3RoID0gMS4wIC8gNjtcclxuZnVuY3Rpb24gc2V0Q29tcG9uZW50cyhvdXQsIHgsIHksIHosIHcpIHtcclxuICAgIG91dFswXSA9IHggKiBub3JtYWxMZW5ndGg7XHJcbiAgICBvdXRbMV0gPSB5ICogbm9ybWFsTGVuZ3RoO1xyXG4gICAgb3V0WzJdID0geiAqIG5vcm1hbExlbmd0aDtcclxuICAgIG91dFszXSA9IHcgKiBub3JtYWxMZW5ndGg7XHJcbiAgICByZXR1cm4gb3V0O1xyXG59XHJcblxyXG5mdW5jdGlvbiBkaXN0YW5jZVRvUG9pbnQocGxhbmUsIHApIHtcclxuICAgIHJldHVybiBwbGFuZVswXSAqIHBbMF0gKyBwbGFuZVsxXSAqIHBbMV0gKyBwbGFuZVsyXSAqIHBbMl0gKyBwbGFuZVszXTtcclxufVxyXG4iLCJpbXBvcnQgKiBhcyBtYXB0YWxrcyBmcm9tICdtYXB0YWxrcyc7XHJcbmltcG9ydCB7IHJlc2hhZGVyLCBtYXQ0LCB2ZWM0LCBjcmVhdGVSRUdMIH0gZnJvbSAnQG1hcHRhbGtzL2dsJztcclxuaW1wb3J0IHsgaW50ZXJzZWN0c0JveCB9IGZyb20gJ2ZydXN0dW0taW50ZXJzZWN0cyc7XHJcbmltcG9ydCB2ZXJ0IGZyb20gJy4vZ2xzbC9yaW5nLnZlcnQnO1xyXG5pbXBvcnQgZnJhZyBmcm9tICcuL2dsc2wvcmluZy5mcmFnJztcclxuXHJcbmNsYXNzIEdsb3dSaW5nUmVuZGVyZXIgZXh0ZW5kcyBtYXB0YWxrcy5yZW5kZXJlci5DYW52YXNSZW5kZXJlciB7XHJcblxyXG4gICAgZHJhdygpIHtcclxuICAgICAgICAvL3RpbWUgPSB0aW1lc3RhbXA7XHJcbiAgICAgICAgdGhpcy5wcmVwYXJlQ2FudmFzKCk7XHJcbiAgICAgICAgdGhpcy5fcmVuZGVyU2NlbmUoKTtcclxuICAgIH1cclxuXHJcbiAgICBuZWVkVG9SZWRyYXcoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgZHJhd09uSW50ZXJhY3RpbmcoKSB7XHJcbiAgICAgICAgLy90aW1lID0gdGltZXN0YW1wO1xyXG4gICAgICAgIHRoaXMuX3JlbmRlclNjZW5lKCk7XHJcbiAgICB9XHJcblxyXG4gICAgaGl0RGV0ZWN0KCkge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVDb250ZXh0KCkge1xyXG4gICAgICAgIGlmICh0aGlzLmNhbnZhcy5nbCAmJiB0aGlzLmNhbnZhcy5nbC53cmFwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZ2wgPSB0aGlzLmNhbnZhcy5nbC53cmFwKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3QgbGF5ZXIgPSB0aGlzLmxheWVyO1xyXG4gICAgICAgICAgICBjb25zdCBhdHRyaWJ1dGVzID0gbGF5ZXIub3B0aW9ucy5nbE9wdGlvbnMgfHwge1xyXG4gICAgICAgICAgICAgICAgYWxwaGE6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBkZXB0aDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGFudGlhbGlhczogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHN0ZW5jaWwgOiB0cnVlXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHRoaXMuZ2xPcHRpb25zID0gYXR0cmlidXRlcztcclxuICAgICAgICAgICAgdGhpcy5nbCA9IHRoaXMuZ2wgfHwgdGhpcy5fY3JlYXRlR0xDb250ZXh0KHRoaXMuY2FudmFzLCBhdHRyaWJ1dGVzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5yZWdsID0gY3JlYXRlUkVHTCh7XHJcbiAgICAgICAgICAgIGdsIDogdGhpcy5nbCxcclxuICAgICAgICAgICAgZXh0ZW5zaW9ucyA6IFtcclxuICAgICAgICAgICAgICAgIC8vICdBTkdMRV9pbnN0YW5jZWRfYXJyYXlzJyxcclxuICAgICAgICAgICAgICAgIC8vICdPRVNfdGV4dHVyZV9mbG9hdCcsXHJcbiAgICAgICAgICAgICAgICAvLyAnT0VTX3RleHR1cmVfZmxvYXRfbGluZWFyJyxcclxuICAgICAgICAgICAgICAgIC8vICdPRVNfZWxlbWVudF9pbmRleF91aW50JyxcclxuICAgICAgICAgICAgICAgICdPRVNfc3RhbmRhcmRfZGVyaXZhdGl2ZXMnXHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIG9wdGlvbmFsRXh0ZW5zaW9ucyA6IHRoaXMubGF5ZXIub3B0aW9uc1snZ2xFeHRlbnNpb25zJ10gfHwgW11cclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLl9pbml0UmVuZGVyZXIoKTtcclxuICAgICAgICB0aGlzLl9jcmVhdGVBbGxTY2VuZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIF9pbml0UmVuZGVyZXIoKSB7XHJcbiAgICAgICAgY29uc3QgbWFwID0gdGhpcy5sYXllci5nZXRNYXAoKTtcclxuICAgICAgICBjb25zdCByZW5kZXJlciA9IG5ldyByZXNoYWRlci5SZW5kZXJlcih0aGlzLnJlZ2wpO1xyXG4gICAgICAgIC8vdGhpcy5zY2VuZXMgPSBbXTtcclxuICAgICAgICAvL3RoaXMuX3NoYWRlckxpc3QgPSB0aGlzLl9zaGFkZXJMaXN0IHx8IHt9O1xyXG4gICAgICAgIHRoaXMucmVuZGVyZXIgPSByZW5kZXJlcjtcclxuICAgICAgICB0aGlzLl91bmlmb3JtcyA9IHtcclxuICAgICAgICAgICAgJ3Byb2pWaWV3TWF0cml4JyA6IG1hcC5wcm9qVmlld01hdHJpeFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5faW5pdERlZmF1bHRTaGFkZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBfY3JlYXRlQWxsU2NlbmUoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMubGF5ZXIuX3JpbmdMaXN0KSB7XHJcbiAgICAgICAgICAgIGZvciAoY29uc3QgbmFtZSBpbiB0aGlzLmxheWVyLl9yaW5nTGlzdCkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcmluZyA9IHRoaXMubGF5ZXIuX3JpbmdMaXN0W25hbWVdO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFyaW5nLmlzQ3JlYXRlZFNjZW5lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY3JlYXRlTWVzaChyaW5nKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBfY3JlYXRlTWVzaChyaW5nKSB7XHJcbiAgICAgICAgY29uc3QgZ2VvbWV0cnkgPSBuZXcgcmVzaGFkZXIuR2VvbWV0cnkoXHJcbiAgICAgICAgICAgIC8vZ2VvbWV0cnnnmoRhdHRyaWJ1dGVz5pWw5o2uXHJcbiAgICAgICAgICAgIC8vMS4g5L+d55WZ55qE5bGe5oCn77yaIGFQb3NpdGlvbiwgYU5vcm1hbCwgYVRleENvb3JkLCBhQ29sb3IsIGFUYW5nZW50XHJcbiAgICAgICAgICAgIC8vMi4g5pSv5oyB5re75Yqg6Ieq5a6a5LmJYXR0cmlidXRl5pWw5o2uLCBhdHRyaWJ1dGXlj5jph4/lkI3lrZflkoxnbHNs5Lit55qE5Y+Y6YeP5ZCN5b+F6aG75LiA6Ie077yM5Lul6K6pcmVnbOiHquWKqOS8oOWAvFxyXG4gICAgICAgICAgICAvLzMuIOWAvOWPr+S7peaYr+exu+Wei+aVsOe7hO+8jOS5n+WPr+S7peaYryByZWdsLmJ1ZmZlciguLi4pIOaWueazleWIm+W7uueahCBidWZmZXIg5a+56LGhXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGFQb3NpdGlvbiA6IHJpbmcuX3ZlcnRpY2VzXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIC8v57Si5byV5pWw5o2uXHJcbiAgICAgICAgICAgIC8vMS4gZWxlbWVudHPvvIzlj6/ku6XmmK/nsbvlnovmlbDnu4TvvIzkuZ/lj6/ku6XmmK8gcmVnbC5lbGVtZW50cyguLikg5pa55rOV5Yib5bu655qEIGVsZW1lbnRzIOWvueixoVxyXG4gICAgICAgICAgICAvLzIuIGNvdW5077yMIOaVsOWtl++8jOWmguaenGdlb21ldHJ55LiN5piv57Si5byV57G75Z6LKGRyYXdFbGVtZW50cynvvIzov5nph4znm7TmjqXmjIflrprnu5jliLbnmoTlm77lhYPmlbDph48o5ZCMZHJhd0FycmF5c+S4reeahGNvdW505Y+C5pWwKVxyXG4gICAgICAgICAgICByaW5nLl9pbmRpY2VzLFxyXG4gICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAvL+e7mOWItuexu+Wei++8jOS+i+WmgiB0cmlhbmdsZSBzdHJpcCwgbGluZeetie+8jOWFt+S9k+exu+Wei+ivt+afpemYhXJlZ2xcclxuICAgICAgICAgICAgICAgIHByaW1pdGl2ZSA6ICd0cmlhbmdsZXMnLFxyXG4gICAgICAgICAgICAgICAgcG9zaXRpb25BdHRyaWJ1dGUgOiAnYVBvc2l0aW9uJ1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgKTtcclxuICAgICAgICAvL+S8oOWFpeaVsOaNruS4uuexu+Wei+aVsOe7hOaXtu+8jOWPr+S7peiwg+eUqCBnZW5lcmF0ZUJ1ZmZlcnMg5bCGYXR0cmlidXRlcyDlkowgZWxlbWVudHMg6L2s5YyW5Li6IHJlZ2znmoQgYnVmZmVy5a+56LGhXHJcbiAgICAgICAgLy/mlrnkvr/lrp7pmYXnu5jliLbml7bvvIzkuI3lho3ph43lpI3mi7fotJ3mlbDmja4gKGJ1ZmZlckRhdGEpXHJcbiAgICAgICAgZ2VvbWV0cnkuZ2VuZXJhdGVCdWZmZXJzKHRoaXMucmVnbCk7XHJcbiAgICAgICAgY29uc3QgcmluZ01lc2ggPSBuZXcgcmVzaGFkZXIuTWVzaChnZW9tZXRyeSk7XHJcbiAgICAgICAgY29uc3QgcG9zaXRpb24gPSBjb29yZGluYXRlVG9Xb3JsZCh0aGlzLmxheWVyLmdldE1hcCgpLCByaW5nLmdldENvb3JkaW5hdGVzKCksIHJpbmcuZ2V0SGVpZ2h0KCkpO1xyXG4gICAgICAgIGNvbnN0IHRyYW5zZm9ybU1hdCA9IG1hdDQuaWRlbnRpdHkoW10pO1xyXG4gICAgICAgIG1hdDQudHJhbnNsYXRlKHRyYW5zZm9ybU1hdCwgdHJhbnNmb3JtTWF0LCBwb3NpdGlvbik7XHJcbiAgICAgICAgLy/pu5jorqRzY2FsZeS4ujMuMFxyXG4gICAgICAgIG1hdDQuc2NhbGUodHJhbnNmb3JtTWF0LCB0cmFuc2Zvcm1NYXQsIFs1LjAsIDUuMCwgNS4wXSk7XHJcbiAgICAgICAgcmluZ01lc2guc2V0TG9jYWxUcmFuc2Zvcm0odHJhbnNmb3JtTWF0KTtcclxuICAgICAgICBjb25zdCBzY2VuZSA9IG5ldyByZXNoYWRlci5TY2VuZShyaW5nTWVzaCk7XHJcbiAgICAgICAgcmluZy5fc2NlbmUgPSBzY2VuZTtcclxuICAgICAgICByaW5nLmlzQ3JlYXRlZFNjZW5lID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLnNldFRvUmVkcmF3KCk7XHJcbiAgICB9XHJcblxyXG4gICAgX2luaXREZWZhdWx0U2hhZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IGRlZmF1bHRTaGFkZXIgPSB0aGlzLl9nZXREZWZhdWx0U2hhZGVyKCk7XHJcbiAgICAgICAgdGhpcy5fcmVnaXN0ZXJTaGFkZXIoJ2RlZmF1bHQnLCAnTWVzaFNoYWRlcicsIGRlZmF1bHRTaGFkZXIuc2hhZGVyLCBkZWZhdWx0U2hhZGVyLnVuaWZvcm1zKTtcclxuICAgIH1cclxuXHJcbiAgICBfcmVnaXN0ZXJTaGFkZXIobmFtZSwgdHlwZSwgY29uZmlnLCB1bmlmb3Jtcykge1xyXG4gICAgICAgIHRoaXMuX3NoYWRlckxpc3QgPSB0aGlzLl9zaGFkZXJMaXN0IHx8IHt9O1xyXG4gICAgICAgIHRoaXMuX3NoYWRlckxpc3RbbmFtZV0gPSB7XHJcbiAgICAgICAgICAgIHNoYWRlciA6IG5ldyByZXNoYWRlclt0eXBlXShjb25maWcpLFxyXG4gICAgICAgICAgICB1bmlmb3JtcyA6IHVuaWZvcm1zXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBjbGVhckNhbnZhcygpIHtcclxuICAgICAgICBpZiAoIXRoaXMuY2FudmFzKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5yZWdsLmNsZWFyKHtcclxuICAgICAgICAgICAgY29sb3I6IFswLCAwLCAwLCAwXSxcclxuICAgICAgICAgICAgZGVwdGg6IDEsXHJcbiAgICAgICAgICAgIHN0ZW5jaWwgOiAwXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgc3VwZXIuY2xlYXJDYW52YXMoKTtcclxuICAgIH1cclxuXHJcbiAgICBfcmVuZGVyU2NlbmUoKSB7XHJcbiAgICAgICAgZm9yIChjb25zdCB1aWQgaW4gdGhpcy5sYXllci5fcmluZ0xpc3QpIHtcclxuICAgICAgICAgICAgY29uc3QgcmluZyA9IHRoaXMubGF5ZXIuX3JpbmdMaXN0W3VpZF07XHJcbiAgICAgICAgICAgIGlmICghcmluZy5pc1Zpc2libGUoKSkge1xyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5fdXBkYXRlU2NlbmVNYXRyaXgocmluZyk7XHJcbiAgICAgICAgICAgIGNvbnN0IHRvUmVuZGVyU2NlbmUgPSB0aGlzLl9jcmVhdGVTY2VuZUluRnJ1c3R1bShyaW5nLl9zY2VuZSk7XHJcbiAgICAgICAgICAgIGlmICghdG9SZW5kZXJTY2VuZSkge1xyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3Qgc2hhZGVyTmFtZSA9IHJpbmcuZ2V0U2hhZGVyKCkgfHwgJ2RlZmF1bHQnO1xyXG4gICAgICAgICAgICAvL+WmguaenOWcqOWIneWni+WMlueahOaXtuWAmeayoeacieiuvue9rm9wdGlvbnPvvIzliJnnlKjpu5jorqTnmoRzaGFkZXJcclxuICAgICAgICAgICAgaWYgKCFyaW5nLmdldFNoYWRlcigpKSB7XHJcbiAgICAgICAgICAgICAgICByaW5nLnNldFNoYWRlcihzaGFkZXJOYW1lKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCBzaGFkZXJJdGVtID0gdGhpcy5fc2hhZGVyTGlzdFtzaGFkZXJOYW1lXTtcclxuICAgICAgICAgICAgLy/lpoLmnpxtYXJrZXLmsqHmnIl1bmlmb3Jtc++8jOWImeS9v+eUqOazqOWGjHNoYWRlcuaXtuWvueW6lOeahHVuaWZvcm1zLCB0aGlzLl91bmlmb3Jtc+aYr+ivuOWmgnZpZXdwcm9qTWF0cml4XHJcbiAgICAgICAgICAgIGNvbnN0IG1hcmtlclVuaWZvcm1zID0gbWFwdGFsa3MuVXRpbC5leHRlbmQoe30sIHNoYWRlckl0ZW0udW5pZm9ybXMsIHJpbmcuZ2V0VW5pZm9ybXMoKSk7XHJcbiAgICAgICAgICAgIG1hcmtlclVuaWZvcm1zLmlUaW1lICs9IDAuMDE7XHJcbiAgICAgICAgICAgIGNvbnN0IHVuaWZvcm1zID0gbWFwdGFsa3MuVXRpbC5leHRlbmQoe30sIG1hcmtlclVuaWZvcm1zLCB0aGlzLl91bmlmb3Jtcyk7XHJcbiAgICAgICAgICAgIHJpbmcuc2V0VW5pZm9ybXModW5pZm9ybXMpO1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhtYXJrZXIuX21vZGVsTWF0cml4KTtcclxuICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5yZW5kZXIoc2hhZGVySXRlbS5zaGFkZXIsIHVuaWZvcm1zLCB0b1JlbmRlclNjZW5lLCBudWxsKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5jb21wbGV0ZVJlbmRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIC8v5Yib5bu65paw55qE55So5LqO5riy5p+T55qEbWVzaO+8jOS4jkZydXN0dW3nm7jkuqTnmoRtZXNo5omN57uY5Yi2XHJcbiAgICBfY3JlYXRlU2NlbmVJbkZydXN0dW0oc2NlbmUpIHtcclxuICAgICAgICBjb25zdCBtZXNoZXMgPSBzY2VuZS5nZXRNZXNoZXMoKTtcclxuICAgICAgICBjb25zdCBsZW4gPSBtZXNoZXMubGVuZ3RoO1xyXG4gICAgICAgIGNvbnN0IG1hcCA9IHRoaXMubGF5ZXIuZ2V0TWFwKCk7XHJcbiAgICAgICAgY29uc3QgdmlzaWJsZXMgPSBbXTtcclxuICAgICAgICBjb25zdCB2MCA9IFtdLCB2MSA9IFtdO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgbWVzaCA9IG1lc2hlc1tpXTtcclxuICAgICAgICAgICAgY29uc3QgYm94ID0gbWVzaC5nZW9tZXRyeS5ib3VuZGluZ0JveDtcclxuICAgICAgICAgICAgY29uc3QgbWluID0gYm94Lm1pbjtcclxuICAgICAgICAgICAgY29uc3QgbWF4ID0gYm94Lm1heDtcclxuICAgICAgICAgICAgdmVjNC5zZXQodjAsIG1pblswXSwgbWluWzFdLCBtaW5bMl0sIDEpO1xyXG4gICAgICAgICAgICB2ZWM0LnNldCh2MSwgbWF4WzBdLCBtYXhbMV0sIG1heFsyXSwgMSk7XHJcbiAgICAgICAgICAgIGNvbnN0IGJveE1pbiA9IHZlYzQudHJhbnNmb3JtTWF0NCh2MCwgdjAsIG1lc2gubG9jYWxUcmFuc2Zvcm0pO1xyXG4gICAgICAgICAgICBjb25zdCBib3hNYXggPSB2ZWM0LnRyYW5zZm9ybU1hdDQodjEsIHYxLCBtZXNoLmxvY2FsVHJhbnNmb3JtKTtcclxuICAgICAgICAgICAgaWYgKGludGVyc2VjdHNCb3gobWFwLnByb2pWaWV3TWF0cml4LCBbYm94TWluLCBib3hNYXhdKSkge1xyXG4gICAgICAgICAgICAgICAgdmlzaWJsZXMucHVzaChtZXNoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdmlzaWJsZXMubGVuZ3RoID8gbmV3IHJlc2hhZGVyLlNjZW5lKHZpc2libGVzKSA6IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgX3VwZGF0ZVNjZW5lTWF0cml4KHJpbmcpIHtcclxuICAgICAgICBjb25zdCBtZXNoZXMgPSByaW5nLl9zY2VuZS5nZXRNZXNoZXMoKTtcclxuICAgICAgICBjb25zdCBwb3NpdGlvbiA9IGNvb3JkaW5hdGVUb1dvcmxkKHRoaXMubGF5ZXIuZ2V0TWFwKCksIHJpbmcuZ2V0Q29vcmRpbmF0ZXMoKSwgcmluZy5nZXRIZWlnaHQoKSk7XHJcbiAgICAgICAgY29uc3QgdHJhbnNmb3JtTWF0ID0gbWF0NC5pZGVudGl0eShbXSk7XHJcbiAgICAgICAgbWF0NC50cmFuc2xhdGUodHJhbnNmb3JtTWF0LCB0cmFuc2Zvcm1NYXQsIHBvc2l0aW9uKTtcclxuICAgICAgICBtYXQ0LnNjYWxlKHRyYW5zZm9ybU1hdCwgdHJhbnNmb3JtTWF0LCBbNS4wLCA1LjAsIDUuMF0pO1xyXG4gICAgICAgIG1lc2hlcy5mb3JFYWNoKG1lc2ggPT4ge1xyXG4gICAgICAgICAgICBtZXNoLnNldExvY2FsVHJhbnNmb3JtKHRyYW5zZm9ybU1hdCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgX2RlbGV0ZVNjZW5lKHJpbmcpIHtcclxuICAgICAgICBpZiAoZGVmaW5lZChyaW5nKSkge1xyXG4gICAgICAgICAgICB0aGlzLl9kaXNwb3NlTWVzaChyaW5nKTtcclxuICAgICAgICAgICAgdGhpcy5zZXRUb1JlZHJhdygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBfZGVsZXRlQWxsKCkge1xyXG4gICAgICAgIGZvciAoY29uc3QgdWlkIGluIHRoaXMubGF5ZXIuX3JpbmdMaXN0KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2Rpc3Bvc2VNZXNoKHRoaXMubGF5ZXIuX3JpbmdMaXN0W3VpZF0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmxheWVyLl9yaW5nTGlzdCA9IHt9O1xyXG4gICAgICAgIHRoaXMubGF5ZXIuX3JpbmdzID0gW107XHJcbiAgICAgICAgdGhpcy5zZXRUb1JlZHJhdygpO1xyXG4gICAgfVxyXG5cclxuICAgIF9kaXNwb3NlTWVzaChyaW5nKSB7XHJcbiAgICAgICAgY29uc3QgbWVzaGVzID0gcmluZy5fc2NlbmUuZ2V0TWVzaGVzKCk7XHJcbiAgICAgICAgbWVzaGVzLmZvckVhY2gobWVzaCA9PiB7XHJcbiAgICAgICAgICAgIG1lc2guZ2VvbWV0cnkuZGlzcG9zZSgpO1xyXG4gICAgICAgICAgICBpZiAobWVzaC5tYXRlcmlhbCkge1xyXG4gICAgICAgICAgICAgICAgbWVzaC5tYXRlcmlhbC5kaXNwb3NlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbWVzaC5kaXNwb3NlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgX2NyZWF0ZUdMQ29udGV4dChjYW52YXMsIG9wdGlvbnMpIHtcclxuICAgICAgICBjb25zdCBuYW1lcyA9IFsnd2ViZ2wnLCAnZXhwZXJpbWVudGFsLXdlYmdsJ107XHJcbiAgICAgICAgbGV0IGNvbnRleHQgPSBudWxsO1xyXG4gICAgICAgIC8qIGVzbGludC1kaXNhYmxlIG5vLWVtcHR5ICovXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuYW1lcy5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KG5hbWVzW2ldLCBvcHRpb25zKTtcclxuICAgICAgICAgICAgfSBjYXRjaCAoZSkge31cclxuICAgICAgICAgICAgaWYgKGNvbnRleHQpIHtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBjb250ZXh0O1xyXG4gICAgICAgIC8qIGVzbGludC1lbmFibGUgbm8tZW1wdHkgKi9cclxuICAgIH1cclxuXHJcbiAgICBfZ2V0RGVmYXVsdFNoYWRlcigpIHtcclxuICAgICAgICBjb25zdCBtYXAgPSB0aGlzLmxheWVyLmdldE1hcCgpO1xyXG4gICAgICAgIGNvbnN0IHNoYWRlciA9IHtcclxuICAgICAgICAgICAgdmVydCxcclxuICAgICAgICAgICAgZnJhZyxcclxuICAgICAgICAgICAgLy8g552A6Imy5Zmo56iL5bqP5Lit55qEdW5pZm9ybeWPmOmHj1xyXG4gICAgICAgICAgICB1bmlmb3JtcyA6IFtcclxuICAgICAgICAgICAgICAgICdpUmVzb2x1dGlvbicsXHJcbiAgICAgICAgICAgICAgICAnaVRpbWUnLFxyXG4gICAgICAgICAgICAgICAgJ2NlbnRlcicsXHJcbiAgICAgICAgICAgICAgICAnaVJhZGl1cycsXHJcbiAgICAgICAgICAgICAgICAnaUNvbG9yJyxcclxuICAgICAgICAgICAgICAgICdpU3BlZWQnLFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWUgOiAncHJvalZpZXdNb2RlbE1hdHJpeCcsXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZSA6ICdmdW5jdGlvbicsXHJcbiAgICAgICAgICAgICAgICAgICAgZm4gOiBmdW5jdGlvbiAoY29udGV4dCwgcHJvcHMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG1hdDQubXVsdGlwbHkoW10sIHByb3BzWydwcm9qVmlld01hdHJpeCddLCBwcm9wc1snbW9kZWxNYXRyaXgnXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICBkZWZpbmVzIDoge1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBleHRyYUNvbW1hbmRQcm9wcyA6IHtcclxuICAgICAgICAgICAgICAgIC8vdHJhbnNwYXJlbnQ6dHJ1ZSxcclxuICAgICAgICAgICAgICAgIGRlcHRoOntcclxuICAgICAgICAgICAgICAgICAgICBlbmFibGU6ZmFsc2VcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBibGVuZDp7XHJcbiAgICAgICAgICAgICAgICAgICAgZW5hYmxlOnRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgZnVuYzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzcmNSR0I6ICdzcmMgYWxwaGEnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzcmNBbHBoYTogMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZHN0UkdCOidvbmUnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkc3RBbHBoYTogMVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgZXF1YXRpb246IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmdiOiAnYWRkJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWxwaGE6ICdhZGQnXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBjb2xvcjogWzAsIDAsIDAsIDBdXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIGNvbnN0IHVuaWZvcm1zID0ge1xyXG4gICAgICAgICAgICAnaVJlc29sdXRpb24nOlttYXAud2lkdGgsIG1hcC5oZWlnaHRdLFxyXG4gICAgICAgICAgICAnaVRpbWUnOjAuMCxcclxuICAgICAgICAgICAgJ2NlbnRlcicgOiBbMCwgMCwgMF0sXHJcbiAgICAgICAgICAgICdpUmFkaXVzJyA6IDEuMCxcclxuICAgICAgICAgICAgJ2lDb2xvcicgOiBbMS4wLCAwLjAsIDAuMF0sXHJcbiAgICAgICAgICAgICdpU3BlZWQnIDogMy4wXHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4geyBzaGFkZXIsIHVuaWZvcm1zIH07XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IEdsb3dSaW5nUmVuZGVyZXI7XHJcblxyXG5mdW5jdGlvbiBpc05pbChvYmopIHtcclxuICAgIHJldHVybiBvYmogPT09IG51bGwgfHwgb2JqID09PSB1bmRlZmluZWQ7XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBkZWZpbmVkKG9iaikge1xyXG4gICAgcmV0dXJuICFpc05pbChvYmopO1xyXG59XHJcblxyXG5mdW5jdGlvbiBjb29yZGluYXRlVG9Xb3JsZChtYXAsIGNvb3JkaW5hdGUsIHopIHtcclxuICAgIGlmICghbWFwKSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgICBjb25zdCBwID0gbWFwLmNvb3JkaW5hdGVUb1BvaW50KGNvb3JkaW5hdGUsIGdldFRhcmdldFpvb20obWFwKSk7XHJcbiAgICByZXR1cm4gW3AueCwgcC55LCB6XTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0VGFyZ2V0Wm9vbShtYXApIHtcclxuICAgIHJldHVybiBtYXAuZ2V0R0xab29tKCk7XHJcbn1cclxuIiwiaW1wb3J0ICogYXMgbWFwdGFsa3MgZnJvbSAnbWFwdGFsa3MnO1xyXG5pbXBvcnQgR2xvd1JpbmdSZW5kZXJlciBmcm9tICcuL0dsb3dSaW5nUmVuZGVyZXInO1xyXG5cclxuY29uc3Qgb3B0aW9ucyA9IHtcclxuICAgIHJlbmRlcmVyIDogJ2dsJyxcclxuICAgIGZvcmNlUmVuZGVyT25ab29taW5nIDogdHJ1ZSxcclxuICAgIGZvcmNlUmVuZGVyT25Nb3ZpbmcgOiB0cnVlLFxyXG4gICAgZm9yY2VSZW5kZXJPblJvdGF0aW5nIDogdHJ1ZVxyXG59O1xyXG5cclxubGV0IHVpZCA9IDA7XHJcblxyXG5jbGFzcyBHbG93UmluZ0xheWVyIGV4dGVuZHMgbWFwdGFsa3MuTGF5ZXIge1xyXG4gICAgY29uc3RydWN0b3IoaWQsIG9wdGlvbnMpIHtcclxuICAgICAgICBzdXBlcihpZCwgb3B0aW9ucyk7XHJcbiAgICAgICAgdGhpcy5fcmluZ0xpc3QgPSB7fTtcclxuICAgICAgICB0aGlzLl9yaW5ncyA9IFtdO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZFJpbmdzKHJpbmdzKSB7XHJcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkocmluZ3MpKSB7XHJcbiAgICAgICAgICAgIHJpbmdzLmZvckVhY2gocmluZyA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFkZFJpbmdzKHJpbmcpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvL3RoaXMucmluZ0xpc3QucHVzaChyaW5ncyk7XHJcbiAgICAgICAgICAgIHRoaXMuX3JpbmdMaXN0W3VpZF0gPSByaW5ncztcclxuICAgICAgICAgICAgdGhpcy5fcmluZ3MucHVzaChyaW5ncyk7XHJcbiAgICAgICAgICAgIHJpbmdzLl91aWQgPSB1aWQ7XHJcbiAgICAgICAgICAgIHJpbmdzLm9wdGlvbnMuaVRpbWUgPSAwLjA7XHJcbiAgICAgICAgICAgIHVpZCsrO1xyXG4gICAgICAgICAgICBjb25zdCByZW5kZXJlciA9IHRoaXMuX2dldFJlbmRlcmVyKCk7XHJcbiAgICAgICAgICAgIGlmIChyZW5kZXJlcikge1xyXG4gICAgICAgICAgICAgICAgLy/lpoLmnpxjcmVhdGVDb250ZXh05omn6KGM6L+H77yM5YiZ55u05o6l5Yib5bu6c2NlbmVcclxuICAgICAgICAgICAgICAgIGlmIChyZW5kZXJlci5yZWdsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVuZGVyZXIuX2NyZWF0ZU1lc2gocmluZ3MpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJlbW92ZVJpbmdzKHJpbmdzKSB7XHJcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkocmluZ3MpKSB7XHJcbiAgICAgICAgICAgIHJpbmdzLmZvckVhY2gocmluZyA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZVJpbmdzKHJpbmcpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBkZWxldGUgdGhpcy5fcmluZ0xpc3RbcmluZ3MuX3VpZF07XHJcbiAgICAgICAgICAgIGNvbnN0IHJlbmRlcmVyID0gdGhpcy5fZ2V0UmVuZGVyZXIoKTtcclxuICAgICAgICAgICAgaWYgKHJlbmRlcmVyKSB7XHJcbiAgICAgICAgICAgICAgICByZW5kZXJlci5fZGVsZXRlU2NlbmUocmluZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGdldEFsbCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcmluZ3M7XHJcbiAgICB9XHJcblxyXG4gICAgY2xlYXIoKSB7XHJcbiAgICAgICAgY29uc3QgcmVuZGVyZXIgPSB0aGlzLl9nZXRSZW5kZXJlcigpO1xyXG4gICAgICAgIGlmIChyZW5kZXJlcikge1xyXG4gICAgICAgICAgICByZW5kZXJlci5fZGVsZXRlQWxsKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJlZ2lzdGVyU2hhZGVyKG5hbWUsIHR5cGUsIGNvbmZpZywgdW5pZm9ybXMpIHtcclxuICAgICAgICBjb25zdCByZW5kZXJlciA9IHRoaXMuX2dldFJlbmRlcmVyKCk7XHJcbiAgICAgICAgaWYgKHJlbmRlcmVyKSB7XHJcbiAgICAgICAgICAgIHJlbmRlcmVyLl9yZWdpc3RlclNoYWRlcihuYW1lLCB0eXBlLCBjb25maWcsIHVuaWZvcm1zKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbkdsb3dSaW5nTGF5ZXIubWVyZ2VPcHRpb25zKG9wdGlvbnMpO1xyXG5cclxuR2xvd1JpbmdMYXllci5yZWdpc3RlclJlbmRlcmVyKCdnbCcsIEdsb3dSaW5nUmVuZGVyZXIpO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgR2xvd1JpbmdMYXllcjtcclxuIiwiaW1wb3J0IHsgQ2xhc3MsIEV2ZW50YWJsZSwgSGFuZGxlcmFibGUgfSBmcm9tICdtYXB0YWxrcyc7XHJcblxyXG5jb25zdCBvcHRpb25zID0ge1xyXG4gICAgc2NhbGUgOiAxLjAsXHJcbiAgICBpc1Zpc2libGUgOiB0cnVlXHJcbn07XHJcblxyXG5jb25zdCB2ZXJ0aWNlcyA9IFstMS4wLCAxLjAsIDAuMCwgLTEuMCwgLTEuMCwgMC4wLCAxLjAsIC0xLjAsIDAuMCwgMS4wLCAxLjAsIDAuMF07XHJcbmNvbnN0IGluZGllY3MgPSBbMCwgMSwgMiwgMCwgMiwgM107XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHbG93UmluZyBleHRlbmRzIEV2ZW50YWJsZShIYW5kbGVyYWJsZShDbGFzcykpIHtcclxuICAgIGNvbnN0cnVjdG9yKGNvb3JkaW5hdGVzLCAgb3B0aW9ucykge1xyXG4gICAgICAgIC8vb3B0aW9uc+WinuWKoHNoYWRlcuWtl+autVxyXG4gICAgICAgIHN1cGVyKG9wdGlvbnMpO1xyXG4gICAgICAgIGNvbnN0IHVuaWZvcm1zID0gdGhpcy5vcHRpb25zLnVuaWZvcm1zIHx8IHt9O1xyXG4gICAgICAgIHRoaXMub3B0aW9ucy51bmlmb3JtcyA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkodW5pZm9ybXMpKTtcclxuICAgICAgICAvL3RoaXMub3B0aW9ucy51bmlmb3Jtcy5pUmFkaXVzID0gNi4wO1xyXG4gICAgICAgIHRoaXMuX2Nvb3JkaW5hdGVzID0gY29vcmRpbmF0ZXM7XHJcbiAgICAgICAgdGhpcy5fdmVydGljZXMgPSB2ZXJ0aWNlcztcclxuICAgICAgICB0aGlzLl9pbmRpY2VzID0gaW5kaWVjcztcclxuICAgIH1cclxuXHJcbiAgICBhZGRUbyhsYXllcikge1xyXG4gICAgICAgIGxheWVyLmFkZFJpbmdzKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuX2xheWVyID0gbGF5ZXI7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcmVtb3ZlKCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9sYXllcikge1xyXG4gICAgICAgICAgICB0aGlzLl9sYXllci5yZW1vdmVSaW5ncyh0aGlzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc2hvdygpIHtcclxuICAgICAgICB0aGlzLm9wdGlvbnMuaXNWaXNpYmxlID0gdHJ1ZTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIC8vMTU1MjczMzQzNzZcclxuICAgIGhpZGUoKSB7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zLmlzVmlzaWJsZSA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIGlzVmlzaWJsZSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zLmlzVmlzaWJsZTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRDb29yZGluYXRlcygpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fY29vcmRpbmF0ZXM7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0Q29vcmRpbmF0ZXMoY29vcmRpbmF0ZXMpIHtcclxuICAgICAgICB0aGlzLl9jb29yZGluYXRlcyA9IGNvb3JkaW5hdGVzO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHNldEhlaWdodChoZWlnaHQpIHtcclxuICAgICAgICB0aGlzLm9wdGlvbnMuaGVpZ2h0ID0gaGVpZ2h0O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIGdldEhlaWdodCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zLmhlaWdodCB8fCAwLjE7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0U2hhZGVyKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMuc2hhZGVyO1xyXG4gICAgfVxyXG5cclxuICAgIHNldFNoYWRlcihuYW1lKSB7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zLnNoYWRlciA9IG5hbWU7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0Q29sb3IoY29sb3IpIHtcclxuICAgICAgICB0aGlzLm9wdGlvbnMudW5pZm9ybXMuaUNvbG9yID0gY29sb3I7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0U3BlZWQoc3BlZWQpIHtcclxuICAgICAgICB0aGlzLm9wdGlvbnMudW5pZm9ybXMuaVNwZWVkID0gc3BlZWQ7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0UmFkaXVzKHJhZGl1cykge1xyXG4gICAgICAgIHRoaXMub3B0aW9ucy51bmlmb3Jtcy5pUmFkaXVzID0gcmFkaXVzO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFJhZGl1cygpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zLnVuaWZvcm1zLmlSYWRpdXMgfHwgMS4wO1xyXG4gICAgfVxyXG5cclxuICAgIHNldFVuaWZvcm1zKHVuaWZvcm1zKSB7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zLnVuaWZvcm1zID0gdW5pZm9ybXM7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0VW5pZm9ybXMoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy51bmlmb3JtcztcclxuICAgIH1cclxufVxyXG5cclxuR2xvd1JpbmcubWVyZ2VPcHRpb25zKG9wdGlvbnMpO1xyXG4iXSwibmFtZXMiOlsicGxhbmVzIiwiaSIsInAiLCJpbnRlcnNlY3RzQm94IiwibWF0cml4IiwiYm94IiwibWFzayIsInNldFBsYW5lcyIsImNoYXJBdCIsInBsYW5lIiwiZGlzdGFuY2VUb1BvaW50IiwibSIsIm1lIiwibWUwIiwibWUxIiwibWUyIiwibWUzIiwibWU0IiwibWU1IiwibWU2IiwibWU3IiwibWU4IiwibWU5IiwibWUxMCIsIm1lMTEiLCJtZTEyIiwibWUxMyIsIm1lMTQiLCJtZTE1Iiwic2V0Q29tcG9uZW50cyIsIm5vcm1hbExlbmd0aCIsIm91dCIsIngiLCJ5IiwieiIsInciLCJHbG93UmluZ1JlbmRlcmVyIiwiZHJhdyIsInByZXBhcmVDYW52YXMiLCJfcmVuZGVyU2NlbmUiLCJuZWVkVG9SZWRyYXciLCJkcmF3T25JbnRlcmFjdGluZyIsImhpdERldGVjdCIsImNyZWF0ZUNvbnRleHQiLCJjYW52YXMiLCJnbCIsIndyYXAiLCJsYXllciIsImF0dHJpYnV0ZXMiLCJvcHRpb25zIiwiZ2xPcHRpb25zIiwiYWxwaGEiLCJkZXB0aCIsImFudGlhbGlhcyIsInN0ZW5jaWwiLCJfY3JlYXRlR0xDb250ZXh0IiwicmVnbCIsImNyZWF0ZVJFR0wiLCJleHRlbnNpb25zIiwib3B0aW9uYWxFeHRlbnNpb25zIiwiX2luaXRSZW5kZXJlciIsIl9jcmVhdGVBbGxTY2VuZSIsIm1hcCIsImdldE1hcCIsInJlbmRlcmVyIiwicmVzaGFkZXIiLCJSZW5kZXJlciIsIl91bmlmb3JtcyIsInByb2pWaWV3TWF0cml4IiwiX2luaXREZWZhdWx0U2hhZGVyIiwiX3JpbmdMaXN0IiwibmFtZSIsInJpbmciLCJpc0NyZWF0ZWRTY2VuZSIsIl9jcmVhdGVNZXNoIiwiZ2VvbWV0cnkiLCJHZW9tZXRyeSIsImFQb3NpdGlvbiIsIl92ZXJ0aWNlcyIsIl9pbmRpY2VzIiwicHJpbWl0aXZlIiwicG9zaXRpb25BdHRyaWJ1dGUiLCJnZW5lcmF0ZUJ1ZmZlcnMiLCJyaW5nTWVzaCIsIk1lc2giLCJwb3NpdGlvbiIsImNvb3JkaW5hdGVUb1dvcmxkIiwiZ2V0Q29vcmRpbmF0ZXMiLCJnZXRIZWlnaHQiLCJ0cmFuc2Zvcm1NYXQiLCJtYXQ0IiwiaWRlbnRpdHkiLCJ0cmFuc2xhdGUiLCJzY2FsZSIsInNldExvY2FsVHJhbnNmb3JtIiwic2NlbmUiLCJTY2VuZSIsIl9zY2VuZSIsInNldFRvUmVkcmF3IiwiZGVmYXVsdFNoYWRlciIsIl9nZXREZWZhdWx0U2hhZGVyIiwiX3JlZ2lzdGVyU2hhZGVyIiwic2hhZGVyIiwidW5pZm9ybXMiLCJ0eXBlIiwiY29uZmlnIiwiX3NoYWRlckxpc3QiLCJjbGVhckNhbnZhcyIsImNsZWFyIiwiY29sb3IiLCJ1aWQiLCJpc1Zpc2libGUiLCJfdXBkYXRlU2NlbmVNYXRyaXgiLCJ0b1JlbmRlclNjZW5lIiwiX2NyZWF0ZVNjZW5lSW5GcnVzdHVtIiwic2hhZGVyTmFtZSIsImdldFNoYWRlciIsInNldFNoYWRlciIsInNoYWRlckl0ZW0iLCJtYXJrZXJVbmlmb3JtcyIsIm1hcHRhbGtzIiwiZXh0ZW5kIiwiZ2V0VW5pZm9ybXMiLCJpVGltZSIsInNldFVuaWZvcm1zIiwicmVuZGVyIiwiY29tcGxldGVSZW5kZXIiLCJtZXNoZXMiLCJnZXRNZXNoZXMiLCJsZW4iLCJsZW5ndGgiLCJ2aXNpYmxlcyIsInYwIiwidjEiLCJtZXNoIiwiYm91bmRpbmdCb3giLCJtaW4iLCJtYXgiLCJ2ZWM0Iiwic2V0IiwiYm94TWluIiwidHJhbnNmb3JtTWF0NCIsImxvY2FsVHJhbnNmb3JtIiwiYm94TWF4IiwicHVzaCIsImZvckVhY2giLCJfZGVsZXRlU2NlbmUiLCJkZWZpbmVkIiwiX2Rpc3Bvc2VNZXNoIiwiX2RlbGV0ZUFsbCIsIl9yaW5ncyIsImRpc3Bvc2UiLCJtYXRlcmlhbCIsIm5hbWVzIiwiY29udGV4dCIsImdldENvbnRleHQiLCJlIiwidmVydCIsImZyYWciLCJmbiIsInByb3BzIiwibXVsdGlwbHkiLCJkZWZpbmVzIiwiZXh0cmFDb21tYW5kUHJvcHMiLCJlbmFibGUiLCJibGVuZCIsImZ1bmMiLCJzcmNSR0IiLCJzcmNBbHBoYSIsImRzdFJHQiIsImRzdEFscGhhIiwiZXF1YXRpb24iLCJyZ2IiLCJ3aWR0aCIsImhlaWdodCIsIkNhbnZhc1JlbmRlcmVyIiwiaXNOaWwiLCJvYmoiLCJ1bmRlZmluZWQiLCJjb29yZGluYXRlIiwiY29vcmRpbmF0ZVRvUG9pbnQiLCJnZXRUYXJnZXRab29tIiwiZ2V0R0xab29tIiwiZm9yY2VSZW5kZXJPblpvb21pbmciLCJmb3JjZVJlbmRlck9uTW92aW5nIiwiZm9yY2VSZW5kZXJPblJvdGF0aW5nIiwiR2xvd1JpbmdMYXllciIsImlkIiwiYWRkUmluZ3MiLCJyaW5ncyIsIkFycmF5IiwiaXNBcnJheSIsIl91aWQiLCJfZ2V0UmVuZGVyZXIiLCJyZW1vdmVSaW5ncyIsImdldEFsbCIsInJlZ2lzdGVyU2hhZGVyIiwibWVyZ2VPcHRpb25zIiwicmVnaXN0ZXJSZW5kZXJlciIsInZlcnRpY2VzIiwiaW5kaWVjcyIsIkdsb3dSaW5nIiwiY29vcmRpbmF0ZXMiLCJKU09OIiwicGFyc2UiLCJzdHJpbmdpZnkiLCJfY29vcmRpbmF0ZXMiLCJhZGRUbyIsIl9sYXllciIsInJlbW92ZSIsInNob3ciLCJoaWRlIiwic2V0Q29vcmRpbmF0ZXMiLCJzZXRIZWlnaHQiLCJzZXRDb2xvciIsImlDb2xvciIsInNldFNwZWVkIiwic3BlZWQiLCJpU3BlZWQiLCJzZXRSYWRpdXMiLCJyYWRpdXMiLCJpUmFkaXVzIiwiZ2V0UmFkaXVzIiwiRXZlbnRhYmxlIiwiSGFuZGxlcmFibGUiLCJDbGFzcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7RUFNQSxJQUFJQSxNQUFNLEdBQUcsRUFBYjs7RUFDQSxLQUFLLElBQUlDLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUcsQ0FBcEIsRUFBdUJBLENBQUMsRUFBeEIsRUFBNEI7RUFDeEJE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
