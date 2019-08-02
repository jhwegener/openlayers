
var map = new ol.Map({
  controls: ol.control.defaults(),
  interactions: ol.interaction.defaults(),
  target: document.getElementById('map'),
  layers: [
    /* new ol.layer.Tile({
            source: new ol.source.OSM()
      }) */
  ],
  view: new ol.View({
    center: [8.67541984686234, 49.41911279523801],
    zoom: 19,
    projection: 'EPSG:4326'
  })
});

var pointImage = new ol.style.Circle({
  radius: 5,
  fill: null,
  stroke: new ol.style.Stroke({color: 'red', width: 1})
});

var textStyle = new ol.style.Text({
  font: '12px Calibri,sans-serif',
  overflow: true,
  fill: new ol.style.Fill({
    color: '#000'
  }),
  stroke: new ol.style.Stroke({
    color: '#fff',
    width: 3
  })
});

var deg2rad = (degrees) => {
  return (degrees * Math.PI) / 180;
}

var getIconStyle = (feature, textStyle, resolution) => {
  var imageStyle = new ol.style.Style({});
  var symbol = feature.get('symbol');
  if ( symbol ) {
    try {
      let center = ol.extent.getCenter(feature.getGeometry().getExtent());
      imageStyle.setGeometry(new ol.geom.Point(center));
      let iconSrc = symbol;
      let rotation = 0,
        rotateWithView = false;
      let a_deg = feature.get('image_rotation');
      if (a_deg) {
        rotation = this.deg2rad(a_deg);
        rotateWithView = true;
      }
      textStyle.getText().setText('');
      let icon = new ol.style.Icon({
        src: iconSrc,
        crossOrigin: '',
        rotation: rotation,
        rotateWithView: rotateWithView,
        scale: 0.3
      })
      imageStyle.setImage(icon);
    } catch(error) {
      console.error(error);
    }
  }
  return [textStyle, imageStyle];
}


var styles = {
  'Point': new ol.style.Style({
    image: pointImage,
    text: textStyle
  }),
  'MultiPolygon': new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'yellow',
      width: 1
    }),
    fill: new ol.style.Fill({
      color: 'rgba(255, 255, 0, 0.1)'
    }),
    text: textStyle
  }),
  'Polygon': new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'blue',
      width: 1
    }),
    fill: new ol.style.Fill({
      color: 'rgba(0, 0, 255, 0.1)'
    }),
    text: textStyle
  })
};


var styleFunction = function(feature, resolution) {
  let style = styles[feature.getGeometry().getType()]

  var name = feature.get('name');
  style.getText().setText(name);
  const currentStyles = getIconStyle(feature, style, resolution);
  return currentStyles;
};


var geojsonObject = {
  'type': 'FeatureCollection',
  'crs': {
    'type': 'name',
    'properties': {
      'name': 'EPSG:4326'
    }
  },
  'features': [
    {
      'type': 'Feature',
      'id': 'point1',
      'geometry': {
        'type': 'Point',
        'coordinates': [8.675134352692723, 49.41879793805129]
      },
      'properties': {
        'name': 'P'
      }
    },
    {
      'type': 'Feature',
      'id': 'poly1',
      'geometry': {
        'type': 'Polygon',
        'coordinates': [[
          [8.675029898806207, 49.41930461264233],
          [8.675034919682492, 49.41948075380773],
          [8.675237284711582, 49.419477611161625],
          [8.675239014444514, 49.419304737316594]
        ]]
      },
      'properties': {
        'name': 'Short name'
      }
    },
    {
      'type': 'Feature',
      'id': 'poly2',
      'geometry': {
        'type': 'Polygon',
        'coordinates': [[
          [8.675632368899489, 49.41926157410247],
          [8.675837079680328, 49.41927001915807],
          [8.675831089899079, 49.41913042754287],
          [8.67563688562122, 49.41911958860488]
        ]]
      },
      'properties': {
        'name': 'Very long name to colide with others'
      }
    },
    {
      'type': 'Feature',
      'id': 'multipoly1',
      'geometry': {
        'type': 'MultiPolygon',
        'coordinates': [
          [[[8.675387077972667,49.41946734486006], [8.675363804469423, 49.419305894624536], [8.675597354531487, 49.41931004935347], [8.675601209489116, 49.419469099272774]]],
          [[[8.675551847549178, 49.41893966404972], [8.675553906369547, 49.418773864734305], [8.675351483999572, 49.41877697040352], [8.675338935498324, 49.4189380971415]]]
        ]
      },
      'properties': {
        'name': 'A multi ploygon'
      }
    },
    {
      'type': 'Feature',
      'id': 'poly3',
      'geometry': {
        'type': 'Polygon',
        'coordinates': [[
          [8.675028895846593, 49.41920393932989],
          [8.675235403585011, 49.41919220890588],
          [8.675231724123604, 49.41902926272414],
          [8.675042115387319, 49.41902461036967]
        ]]
      },
      'properties': {
        'name': 'with image',
        'symbol': 'https://maps.deepmap.net/geo/www/eb_msinspire18_mbstyle/textures_gen/PNG_Gold-DellTechnologies_6567-DellEMC_Logo_Hz_Blue_Gry_4c.png',
        'image_rotation': 1,
      }
    }
  ]
}

var features = (new ol.format.GeoJSON()).readFeatures(geojsonObject);

var vectorSource = new ol.source.Vector({
  features: features
});

var vectorLayer = new ol.layer.Vector({
  source: vectorSource,
  style: styleFunction,
  declutter: true
});
map.addLayer(vectorLayer);
