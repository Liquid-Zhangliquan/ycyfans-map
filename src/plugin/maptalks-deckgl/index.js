import * as maptalks from 'maptalks';
import * as deck from 'deck.gl';
/* eslint-disable */
const options = {
    'container': 'front',
    'renderer': 'dom'
};


export class DeckGLLayer extends maptalks.Layer {

    // getDeckGL() {
    //     const render = this._getRenderer();
    //     if (render) {
    //         return render.deckgl;
    //     }
    // }

    setProps(props) {
        const render = this._getRenderer();
        this.props = maptalks.Util.extend({}, props);
        let options = this._initDeckOption(props);
        if (render) {
            render.deckgl.setProps(options);
        }
        return this;
    }

    onAdd() {
        let self = this;
        function animimation() {
            const render = self._getRenderer();
            if (render) {
                render.sync();
            }
            self.syncAnimation = requestAnimationFrame(animimation);
        }
        animimation();
    }

    onRemove() {
        if (this.syncAnimation) cancelAnimationFrame(this.syncAnimation);
        const render = this._getRenderer();
        if (render) {
            render.deckgl.finalize();
        }
        super.onRemove();
    }

    setOpacity(opacity) {
        const render = this._getRenderer();
        if (render) {
            const container = render._container;
            container.style.opacity = opacity;
        }
        return this;
    }

    getOpacity() {
        const render = this._getRenderer();
        if (render) {
            const container = render._container;
            return Math.min(1, parseFloat(container.style.opacity));
        }
        return 0;
    }

    setZIndex(z) {
        const render = this._getRenderer();
        if (render) {
            const container = render._container;
            container.style.zIndex = z;
        }
        return this;
    }

    getZIndex() {
        const render = this._getRenderer();
        if (render) {
            const container = render._container;
            if (container)
                return container.style.zIndex;
        }
        return 0;
    }

    show() {
        const render = this._getRenderer();
        if (render) {
            render.show();
        }
        return this;
    }

    hide() {
        const render = this._getRenderer();
        if (render) {
            render.hide();
        }
        return this;
    }

    _initDeckOption(options = {}) {
        const layers = options.layers || [];
        let newLayers = [];
        layers.forEach(element => {
            newLayers.push(this._getDeckLayer(element));
        });
        options.layers = newLayers;
        return options;
    }

    _getDeckLayer(layer = {}) {
        const type = layer.layerType;
        let options = maptalks.Util.extend({}, layer);
        return new deck[type](options);
    }
}

DeckGLLayer.mergeOptions(options);
export class DeckGLRenderer {

    constructor(layer) {
        this.layer = layer;
    }

    render() {
        if (!this._container) {
            this._createLayerContainer();
        }
        this.layer.fire('layerload');

    }

    drawOnInteracting() {
        // if (this._isVisible()) {

        // }
        this.sync();
    }

    sync() {
        const props = this.getView();
        if (this.deckgl){
            this.deckgl.setProps({ viewState: maptalks.Util.extend({}, props) });
        }
    }

    needToRedraw() {
        const map = this.getMap();
        const renderer = map._getRenderer();
        return map.isInteracting() || renderer && (renderer.isStateChanged && renderer.isStateChanged() || renderer.isViewChanged && renderer.isViewChanged());
    }

    getMap() {
        return this.layer.getMap();
    }

    _isVisible() {
        return this._container && this._container.style.display === '';
    }

    show() {
        if (this._container) {
            this._container.style.display = '';
        }
    }

    hide() {
        if (this._container) {
            this._container.style.display = 'none';
        }
    }

    setZIndex(z) {
        this._zIndex = z;
        if (this._container) {
            this._container.style.zIndex = z;
        }
    }

    getZIndex() {
        return this._zIndex || 0;
    }

    remove() {
        this._removeLayerContainer();
    }

    isCanvasRender() {
        return false;
    }

    initDeckGL() {
        const deckOption = {
            container: this._container
            // onViewStateChange:this.syncMap.bind(this)
            // mapboxApiAccessToken: 'pk.eyJ1IjoiemhlbmZ1IiwiYSI6ImNpb284bzNoYzAwM3h1Ym02aHlrand6OTAifQ.sKX-XKJMmgtk_oI5oIUV_g',
            // mapStyle: 'mapbox://styles/mapbox/dark-v9',
        };
        this.deckgl = new deck.DeckGL(maptalks.Util.extend({}, deckOption, this.getView()));
        const layer = this.layer;
        if (layer && layer.props) {
            layer.setProps(layer.props);
        }
    }



    _createLayerContainer() {
        const container = this._container = maptalks.DomUtil.createEl('div');
        container.style.cssText = 'position:absolute;left:0px;top:0px;opacity:1;';
        if (this._zIndex) {
            container.style.zIndex = this._zIndex;
        }
        this._resetContainer();
        const parentContainer = this.layer.options['container'] === 'front' ? this.getMap()._panels['frontStatic'] : this.getMap()._panels['backStatic'];
        parentContainer.appendChild(container);
        if (!this.deckgl) this.initDeckGL();
    }

    _removeLayerContainer() {
        if (this._container) {
            maptalks.DomUtil.removeDomNode(this._container);
        }
        delete this._levelContainers;
    }

    _resetContainer() {
        const size = this.getMap().getSize();
        this._container.style.width = size.width + 'px';
        this._container.style.height = size.height + 'px';
        this.sync();
    }


    getEvents() {
        return {
            // '_zoomstart': this.onZoomStart,
            // '_zoomend': this.onZoomEnd,
            // '_zooming': this.onZoomEnd,
            // '_dragrotatestart': this.onDragRotateStart,
            // '_dragrotateend': this.onDragRotateEnd,
            // '_movestart': this.onMoveStart,
            // '_moving': this.onMoveStart,
            // '_moveend': this.onMoveEnd,
            '_resize': this._resetContainer
        };
    }

    getView() {
        const map = this.getMap();
        const center = map.getCenter(), zoom = map.getZoom(), bearing = map.getBearing(), pitch = map.getPitch(), maxZoom = map.getMaxZoom();
        const size = map.getSize();
        return {
            longitude: center.x,
            latitude: center.y,
            zoom: zoom - 1,
            maxZoom: maxZoom - 1,
            pitch: pitch,
            bearing: bearing,
            width: size.width,
            height: size.height
        };

    }
}
DeckGLLayer.registerRenderer('dom', DeckGLRenderer);