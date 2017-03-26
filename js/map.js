// var capabilitiesUrl = 'https://www.basemap.at/wmts/1.0.0/WMTSCapabilities.xml';

// var hiDPI = ol.has.DEVICE_PIXEL_RATIO > 1;

var features = new ol.Collection();
var source = new ol.source.Vector({ feature: features });
// var t;
source.on("change", function(ev) {
  saveFeatures();
});

var vector = new ol.layer.Vector({
  source: source,
  style: new ol.style.Style({
    fill: new ol.style.Fill({
      color: "rgba(255, 255, 255, 0.2)"
    }),
    stroke: new ol.style.Stroke({
      color: "#ffcc33",
      width: 2
    }),
    image: new ol.style.Circle({
      radius: 7,
      fill: new ol.style.Fill({
        color: "#ffcc33"
      })
    })
  })
});

var googleLayer = new ol.layer.Tile({
  source: new ol.source.TileImage({
    url: "http://khm0.googleapis.com/kh?v=717&hl=pl&&x={x}&y={y}&z={z}"
  })
});

// var layer = hiDPI ? 'bmaphidpi' : 'geolandbasemap';
// var tilePixelRatio = hiDPI ? 2 : 1;

var wgs84Sphere = new ol.Sphere(6378137);

var measureMode = "none";
/**
       * @constructor
       * @extends {ol.control.Control}
       * @param {Object=} opt_options Control options.
       */
var MeasureLineControl = function(optOptions) {
  var options = optOptions || {};

  var button = document.createElement("button");
  button.innerHTML = "L";

  //   var this_ = this;
  var setMeasureLine = function() {
    if (measureMode === "LineString") {
      measureMode = "none";
      map.removeInteraction(draw);
      map.addInteraction(select);
      map.addInteraction(modify);
    } else {
      measureMode = "LineString";
      map.removeInteraction(draw);
      addInteraction();
    }
  };

  button.addEventListener("click", setMeasureLine, false);
  button.addEventListener("touchstart", setMeasureLine, false);

  var element = document.createElement("div");
  element.className = "btn_measure_line ol-unselectable ol-control";
  element.appendChild(button);

  ol.control.Control.call(this, {
    element: element,
    target: options.target
  });
};
ol.inherits(MeasureLineControl, ol.control.Control);

var MeasureAreaControl = function(optOptions) {
  var options = optOptions || {};

  var button = document.createElement("button");
  button.innerHTML = "FL";

  //   var this_ = this;
  var setMeasureArea = function() {
    if (measureMode === "Polygon") {
      measureMode = "none";
      map.removeInteraction(draw);
      map.addInteraction(select);
      map.addInteraction(modify);
    } else {
      measureMode = "Polygon";
      map.removeInteraction(draw);
      addInteraction();
    }
  };

  button.addEventListener("click", setMeasureArea, false);
  button.addEventListener("touchstart", setMeasureArea, false);

  var element = document.createElement("div");
  element.className = "btn_measure_area ol-unselectable ol-control";
  element.appendChild(button);

  ol.control.Control.call(this, {
    element: element,
    target: options.target
  });
};
ol.inherits(MeasureAreaControl, ol.control.Control);

var elBtnFeatureDel;
/**
       * @constructor
       * @extends {ol.control.Control}
       * @param {Object=} opt_options Control options.
       */
var FeatureDeleteControl = function(optOptions) {
  var options = optOptions || {};

  var button = document.createElement("button");
  button.id = "btn_feature_del";
  button.innerHTML = "X";

  elBtnFeatureDel = document.createElement("div");
  elBtnFeatureDel.className = "ol-control btn_feature_del"; // ol-unselectable
  elBtnFeatureDel.appendChild(button);
  elBtnFeatureDel.hidden = true;

  ol.control.Control.call(this, {
    element: elBtnFeatureDel,
    target: options.target
  });
};
ol.inherits(FeatureDeleteControl, ol.control.Control);

var map = new ol.Map({
  target: "map",
  layers: [googleLayer, vector],
  controls: ol.control
    .defaults({
      attributionOptions /** @type {olx.control.AttributionOptions} */: {
        collapsible: false
      }
    })
    .extend([
      new MeasureLineControl(),
      new MeasureAreaControl(),
      new FeatureDeleteControl()
    ]),
  view: new ol.View({
    center: (function() {
      if (localStorage.map_stdHome === undefined) {
        return [1823849, 6143760];
      } else {
        var hm = localStorage.map_stdHome.split(",");
        hm[0] = parseInt(hm[0]);
        hm[1] = parseInt(hm[1]);
        return hm;
      }
    })(),
    zoom: (function() {
      if (localStorage.map_stdZoom === undefined) {
        return 6;
      } else {
        return parseInt(localStorage.map_stdZoom);
      }
    })()
  })
});

// fetch(capabilitiesUrl).then(function (response) {
//    return response.text();
// }).then(function (text) {
//    var result = new ol.format.WMTSCapabilities().read(text);
//    var options = ol.source.WMTS.optionsFromCapabilities(result, {
//        layer: 'bmaporthofoto30cm',//layer,
//        matrixSet: 'google3857',
//        style: 'normal'
//    });
//    options.tilePixelRatio = tilePixelRatio;
//    map.addLayer(new ol.layer.Tile({
//        source: new ol.source.WMTS(options)
//    }));
//    map.addLayer(vector);
// });

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
// var continuePolygonMsg = 'Click to continue drawing the polygon';

/**
 * Message to show when the user is drawing a line.
 * @type {string}
 */
// var continueLineMsg = 'Click to continue drawing the line';

var draw; // global so we can remove it later
/**
 * Format length output.
 * @param {ol.geom.LineString} line The line.
 * @return {string} The formatted length.
 */
var formatLength = function(line) {
  var length;
  var coordinates = line.getCoordinates();
  length = 0;
  var sourceProj = map.getView().getProjection();
  for (var i = 0, ii = coordinates.length - 1; i < ii; ++i) {
    var c1 = ol.proj.transform(coordinates[i], sourceProj, "EPSG:4326");
    var c2 = ol.proj.transform(coordinates[i + 1], sourceProj, "EPSG:4326");
    length += wgs84Sphere.haversineDistance(c1, c2);
  }

  var output;
  if (length > 1000) {
    output = Math.round(length / 1000 * 100) / 100 + " " + "km";
  } else {
    output = Math.round(length * 100) / 100 + " " + "m";
  }
  return output;
};

/**
 * Format area output.
 * @param {ol.geom.Polygon} polygon The polygon.
 * @return {string} Formatted area.
 */
var measuredArea = 0;
var formatArea = function(polygon) {
  var area;
  var sourceProj = map.getView().getProjection();
  var geom /** @type {ol.geom.Polygon} */ = polygon
    .clone()
    .transform(sourceProj, "EPSG:4326");
  var coordinates = geom.getLinearRing(0).getCoordinates();
  area = Math.abs(wgs84Sphere.geodesicArea(coordinates));

  var output;
  measuredArea = Math.round(area * 100) / 100;
  if (area > 10000) {
    output = Math.round(area / 10000 * 1000) / 1000 + " " + "ha";
  } else {
    output = Math.round(area * 100) / 100 + " " + "m<sup>2</sup>";
  }
  return output;
};
// var fid = 0;
function addInteraction() {
  draw = new ol.interaction.Draw({
    source: source,
    type /** @type {ol.geom.GeometryType} */: measureMode,
    style: new ol.style.Style({
      fill: new ol.style.Fill({
        color: "rgba(255, 255, 255, 0.2)"
      }),
      stroke: new ol.style.Stroke({
        color: "rgba(0, 0, 0, 0.5)",
        lineDash: [10, 10],
        width: 2
      }),
      image: new ol.style.Circle({
        radius: 5,
        stroke: new ol.style.Stroke({
          color: "rgba(0, 0, 0, 0.7)"
        }),
        fill: new ol.style.Fill({
          color: "rgba(255, 255, 255, 0.2)"
        })
      })
    })
  });
  map.removeInteraction(modify);
  map.removeInteraction(select);
  map.addInteraction(draw);
  var tooltipListener;
  draw.on(
    "drawstart",
    function(evt) {
      // set sketch
      sketch = evt.feature;

      /** @type {ol.Coordinate|undefined} */
      var tooltipCoord = evt.coordinate;

      tooltipListener = sketch.getGeometry().on("change", function(evt) {
        var geom = evt.target;
        var output;
        if (geom instanceof ol.geom.Polygon) {
          output = formatArea(geom);
          tooltipCoord = geom.getInteriorPoint().getCoordinates();
          vm_treesum.$data.treesum = Math.round(
            measuredArea /
              (vm_treesum.$data.rowdist / 100 * vm_treesum.$data.treedist / 100)
          );
        } else if (geom instanceof ol.geom.LineString) {
          output = formatLength(geom);
          tooltipCoord = geom.getLastCoordinate();
        }
        measureTooltipElement.innerHTML = output;
        measureTooltip.setPosition(tooltipCoord);
      });
    },
    this
  );

  draw.on(
    "drawend",
    function(evt) {
      // fid++;
      // evt.feature.setId(fid);
      measureTooltipElement.className = "tooltip tooltip-static";
      measureTooltip.setOffset([0, -7]);
      // unset sketch
      sketch = null;
      createMeasureTooltip();
    },
    this
  );

  createMeasureTooltip();
  createHelpTooltip();
}

function saveFeatures() {
  console.log("save");
  var wkt = new ol.format.WKT();
  vector.getSource().forEachFeature(function(f) {
    console.log(wkt.writeFeature(f));
  });
}
// var geom;
var select = new ol.interaction.Select({
  wrapX: false,
  hitTolerance: 5
});

var measureInfoElement;
var measureInfo;
select.on(
  "select",
  function(evt) {
    if (evt.selected.length > 0) {
      elBtnFeatureDel.hidden = false;
      map.removeOverlay(measureInfo);
      var feat = evt.target.getFeatures().item(0).getGeometry();
      var output;
      var infoCoord;
      // todo select
      if (feat instanceof ol.geom.Polygon) {
        output = formatArea(feat);
        infoCoord = feat.getInteriorPoint().getCoordinates();
        vm_treesum.$data.treesum = Math.round(
          measuredArea /
            (vm_treesum.$data.rowdist / 100 * vm_treesum.$data.treedist / 100)
        );
      } else if (feat instanceof ol.geom.LineString) {
        output = formatLength(feat);
        infoCoord = feat.getLastCoordinate();
      }
      measureInfoElement = document.createElement("div");
      measureInfoElement.id = "mInfoEl";
      measureInfoElement.className = "tooltip tooltip-static";
      measureInfoElement.innerHTML = output;
      measureInfo = new ol.Overlay({
        element: measureInfoElement,
        offset: [0, -15],
        positioning: "bottom-center"
      });
      map.addOverlay(measureInfo);
      measureInfo.setPosition(infoCoord);

      function delFeature() {
        if (select.getFeatures().getLength() > 0) {
          var f = select.getFeatures().item(0);
          vector.getSource().removeFeature(f);
          select.getFeatures().clear();
        }
        measureInfoElement.hidden = true;
        elBtnFeatureDel.hidden = true;

        elBtnFeatureDel.removeEventListener("click", delFeature, false);
        elBtnFeatureDel.removeEventListener("touchstart", delFeature, false);
      }

      elBtnFeatureDel.addEventListener("click", delFeature, false);
      elBtnFeatureDel.addEventListener("touchstart", delFeature, false);
    } else {
      elBtnFeatureDel.hidden = true;
    }
  },
  this
);

var modify = new ol.interaction.Modify({
  features: select.getFeatures(),
  // the SHIFT key must be pressed to delete vertices, so
  // that new vertices can be drawn at the same position
  // of existing vertices
  deleteCondition: function(event) {
    return ol.events.condition.shiftKeyOnly(event) &&
      ol.events.condition.singleClick(event);
  }
});
// var test;
modify.on(
  "modifystart",
  function(ev) {
    map.removeOverlay(measureInfo);
  },
  this
);
/// /modify.on('modifyend', function (ev) { measureDrawEnd(); }, this);

/**
 * Creates a new help tooltip
 */
function createHelpTooltip() {
  if (helpTooltipElement) {
    helpTooltipElement.parentNode.removeChild(helpTooltipElement);
  }
  helpTooltipElement = document.createElement("div");
  helpTooltipElement.className = "tooltip hidden";
  helpTooltip = new ol.Overlay({
    element: helpTooltipElement,
    offset: [15, 0],
    positioning: "center-left"
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
  measureTooltipElement = document.createElement("div");
  measureTooltipElement.className = "tooltip tooltip-measure";
  measureTooltip = new ol.Overlay({
    element: measureTooltipElement,
    offset: [-50, -25],
    positioning: "bottom-center"
  });
  map.addOverlay(measureTooltip);
}
