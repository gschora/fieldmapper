var capabilitiesUrl = 'https://www.basemap.at/wmts/1.0.0/WMTSCapabilities.xml';

// HiDPI support:
// * Use 'bmaphidpi' layer (pixel ratio 2) for device pixel ratio > 1
// * Use 'geolandbasemap' layer (pixel ratio 1) for device pixel ratio == 1
var hiDPI = ol.has.DEVICE_PIXEL_RATIO > 1;

var features = new ol.Collection();
var source = new ol.source.Vector({ features: features });
var vector = new ol.layer.Vector({
    source: source,
    style: new ol.style.Style({
        fill: new ol.style.Fill({
            color: 'rgba(255, 255, 255, 0.2)'
        }),
        stroke: new ol.style.Stroke({
            color: '#ffcc33',
            width: 2
        }),
        image: new ol.style.Circle({
            radius: 7,
            fill: new ol.style.Fill({
                color: '#ffcc33'
            })
        })
    })
});
var layer = hiDPI ? 'bmaphidpi' : 'geolandbasemap';
var tilePixelRatio = hiDPI ? 2 : 1;

var wgs84Sphere = new ol.Sphere(6378137);

//var mousePositionControl = new ol.control.MousePosition({
//    coordinateFormat: ol.coordinate.createStringXY(0),
//    projection: 'EPSG:3857',
//    // comment the following two lines to have the mouse position
//    // be placed within the map.
//    // className: 'custom-mouse-position',
//    // target: document.getElementById('mouse-position'), 
//    undefinedHTML: '&nbsp;'
//});

var measureMode = "LineString";
/**
       * @constructor
       * @extends {ol.control.Control}
       * @param {Object=} opt_options Control options.
       */
var MeasureLineControl = function (opt_options) {

    var options = opt_options || {};

    var button = document.createElement('button');
    button.innerHTML = 'L';

    var this_ = this;
    var setMeasureLine = function () {
        measureMode = "LineString";
        map.removeInteraction(draw);
        addInteraction();
    };

    button.addEventListener('click', setMeasureLine, false);
    button.addEventListener('touchstart', setMeasureLine, false);

    var element = document.createElement('div');
    element.className = 'btn_measure_line ol-unselectable ol-control';
    element.appendChild(button);

    ol.control.Control.call(this, {
        element: element,
        target: options.target
    });

};
ol.inherits(MeasureLineControl, ol.control.Control);

/**
       * @constructor
       * @extends {ol.control.Control}
       * @param {Object=} opt_options Control options.
       */
var MeasureAreaControl = function (opt_options) {

    var options = opt_options || {};

    var button = document.createElement('button');
    button.innerHTML = 'FL';

    var this_ = this;
    var setMeasureArea = function () {
        measureMode = "Polygon";
        map.removeInteraction(draw);
        addInteraction();
    };

    button.addEventListener('click', setMeasureArea, false);
    button.addEventListener('touchstart', setMeasureArea, false);

    var element = document.createElement('div');
    element.className = 'btn_measure_area ol-unselectable ol-control';
    element.appendChild(button);

    ol.control.Control.call(this, {
        element: element,
        target: options.target
    });

};
ol.inherits(MeasureAreaControl, ol.control.Control);

//var map_stdZoom = 

var map = new ol.Map({
    target: 'map',
    layers: [vector],
    controls: ol.control.defaults({
        attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
            collapsible: false
        })
    }).extend([
          new MeasureLineControl(), new MeasureAreaControl()
    ]),
    view: new ol.View({
        center: (function () {
            if (localStorage.map_stdHome === undefined) {
                return [1823849, 6143760];
            } else {
                var hm = localStorage.map_stdHome.split(',');
                hm[0] = parseInt(hm[0]);
                hm[1] = parseInt(hm[1]);
                return hm;
            }
        })(),
        zoom: (function() {
            if (localStorage.map_stdZoom === undefined) {
                return 6;
            } else { return parseInt(localStorage.map_stdZoom); }
        })()

    })
});

fetch(capabilitiesUrl).then(function (response) {
    return response.text();
}).then(function (text) {
    var result = new ol.format.WMTSCapabilities().read(text);
    var options = ol.source.WMTS.optionsFromCapabilities(result, {
        layer: layer,
        matrixSet: 'google3857',
        style: 'normal'
    });
    options.tilePixelRatio = tilePixelRatio;
    map.addLayer(new ol.layer.Tile({
        source: new ol.source.WMTS(options)
    }));
    map.addLayer(vector);
});


/**
       * Currently drawn feature.
       * @type {ol.Feature}
       */
var sketch;


/**
 * The help tooltip element.
 * @type {Element}
 */
var helpTooltipElement;


/**
 * Overlay to show the help messages.
 * @type {ol.Overlay}
 */
var helpTooltip;


/**
 * The measure tooltip element.
 * @type {Element}
 */
var measureTooltipElement;


/**
 * Overlay to show the measurement.
 * @type {ol.Overlay}
 */
var measureTooltip;


/**
 * Message to show when the user is drawing a polygon.
 * @type {string}
 */
var continuePolygonMsg = 'Click to continue drawing the polygon';


/**
 * Message to show when the user is drawing a line.
 * @type {string}
 */
var continueLineMsg = 'Click to continue drawing the line';


///**
// * Handle pointer move.
// * @param {ol.MapBrowserEvent} evt The event.
// */
//var pointerMoveHandler = function (evt) {
//    if (evt.dragging) {
//        return;
//    }
//    /** @type {string} */
//    var helpMsg = 'Click to start drawing';

//    if (sketch) {
//        var geom = (sketch.getGeometry());
//        if (geom instanceof ol.geom.Polygon) {
//            helpMsg = continuePolygonMsg;
//        } else if (geom instanceof ol.geom.LineString) {
//            helpMsg = continueLineMsg;
//        }
//    }

//    helpTooltipElement.innerHTML = helpMsg;
//    helpTooltip.setPosition(evt.coordinate);

//    helpTooltipElement.classList.remove('hidden');
//};

//map.on('pointermove', pointerMoveHandler);

//map.getViewport().addEventListener('mouseout', function () {
//    helpTooltipElement.classList.add('hidden');
//});

//var typeSelect = document.getElementById('type');
//var geodesicCheckbox = document.getElementById('geodesic');

var draw; // global so we can remove it later


/**
 * Format length output.
 * @param {ol.geom.LineString} line The line.
 * @return {string} The formatted length.
 */
var formatLength = function (line) {
    var length;
    //if (geodesicCheckbox.checked) {
    var coordinates = line.getCoordinates();
    length = 0;
    var sourceProj = map.getView().getProjection();
    for (var i = 0, ii = coordinates.length - 1; i < ii; ++i) {
        var c1 = ol.proj.transform(coordinates[i], sourceProj, 'EPSG:4326');
        var c2 = ol.proj.transform(coordinates[i + 1], sourceProj, 'EPSG:4326');
        length += wgs84Sphere.haversineDistance(c1, c2);
    }
    //} else {
    //    length = Math.round(line.getLength() * 100) / 100;
    //}
    var output;
    if (length > 1000) {
        output = (Math.round(length / 1000 * 100) / 100) +
            ' ' + 'km';
    } else {
        output = (Math.round(length * 100) / 100) +
            ' ' + 'm';
    }
    return output;
};


/**
 * Format area output.
 * @param {ol.geom.Polygon} polygon The polygon.
 * @return {string} Formatted area.
 */
var formatArea = function (polygon) {
    var area;
    //if (geodesicCheckbox.checked) {
    var sourceProj = map.getView().getProjection();
    var geom = /** @type {ol.geom.Polygon} */(polygon.clone().transform(
        sourceProj, 'EPSG:4326'));
    var coordinates = geom.getLinearRing(0).getCoordinates();
    area = Math.abs(wgs84Sphere.geodesicArea(coordinates));
    //} else {
    //    area = polygon.getArea();
    //}
    var output;
    if (area > 10000) {
        output = (Math.round(area / 1000000 * 100) / 100) +
            ' ' + 'km<sup>2</sup>';
    } else {
        output = (Math.round(area * 100) / 100) +
            ' ' + 'm<sup>2</sup>';
    }
    return output;
};

function addInteraction() {
    //console.log("measuremode: " + measureMode);
    draw = new ol.interaction.Draw({
        source: source,
        type: /** @type {ol.geom.GeometryType} */ (measureMode),
        style: new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(255, 255, 255, 0.2)'
            }),
            stroke: new ol.style.Stroke({
                color: 'rgba(0, 0, 0, 0.5)',
                lineDash: [10, 10],
                width: 2
            }),
            image: new ol.style.Circle({
                radius: 5,
                stroke: new ol.style.Stroke({
                    color: 'rgba(0, 0, 0, 0.7)'
                }),
                fill: new ol.style.Fill({
                    color: 'rgba(255, 255, 255, 0.2)'
                })
            })
        })
    });
    map.addInteraction(draw);

    var listener;
    draw.on('drawstart',
        function (evt) {
            // set sketch
            sketch = evt.feature;

            /** @type {ol.Coordinate|undefined} */
            var tooltipCoord = evt.coordinate;

            listener = sketch.getGeometry().on('change', function (evt) {
                var geom = evt.target;
                var output;
                if (geom instanceof ol.geom.Polygon) {
                    output = formatArea(geom);
                    tooltipCoord = geom.getInteriorPoint().getCoordinates();
                } else if (geom instanceof ol.geom.LineString) {
                    output = formatLength(geom);
                    tooltipCoord = geom.getLastCoordinate();
                }
                measureTooltipElement.innerHTML = output;
                measureTooltip.setPosition(tooltipCoord);
            });
        }, this);

    draw.on('drawend',
        function () {
            measureTooltipElement.className = 'tooltip tooltip-static';
            measureTooltip.setOffset([0, -7]);
            // unset sketch
            sketch = null;
            // unset tooltip so that a new one can be created
            measureTooltipElement = null;
            createMeasureTooltip();
            ol.Observable.unByKey(listener);
        }, this);

    var modify = new ol.interaction.Modify({
        features: features,
        // the SHIFT key must be pressed to delete vertices, so
        // that new vertices can be drawn at the same position
        // of existing vertices
        deleteCondition: function (event) {
            return ol.events.condition.shiftKeyOnly(event) &&
                ol.events.condition.singleClick(event);
        }
    });
    map.addInteraction(modify);

    createMeasureTooltip();
    createHelpTooltip();
}



/**
 * Creates a new help tooltip
 */
function createHelpTooltip() {
    if (helpTooltipElement) {
        helpTooltipElement.parentNode.removeChild(helpTooltipElement);
    }
    helpTooltipElement = document.createElement('div');
    helpTooltipElement.className = 'tooltip hidden';
    helpTooltip = new ol.Overlay({
        element: helpTooltipElement,
        offset: [15, 0],
        positioning: 'center-left'
    });
    map.addOverlay(helpTooltip);
}


/**
 * Creates a new measure tooltip
 */
function createMeasureTooltip() {
    if (measureTooltipElement) {
        measureTooltipElement.parentNode.removeChild(measureTooltipElement);
    }
    measureTooltipElement = document.createElement('div');
    measureTooltipElement.className = 'tooltip tooltip-measure';
    measureTooltip = new ol.Overlay({
        element: measureTooltipElement,
        offset: [0, -15],
        positioning: 'bottom-center'
    });
    map.addOverlay(measureTooltip);
}



/**
 * Let user change the geometry type.
 */
//typeSelect.onchange = function () {
//    map.removeInteraction(draw);
//    addInteraction();
//};

addInteraction();