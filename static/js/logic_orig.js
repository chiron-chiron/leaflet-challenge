// Creating map
var myMap = L.map("mapid", {
    center: [39.41, -111, 95],
    zoom: 5,
    layers: [light]
});


// Creating Tile Layers
var light = L.titleLayer("https://api.mapbox.com/styles/v1/{id}/titles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href= 'https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_black'>Improve this map</a></strong>",
    tileSize: 480,
    maxZoom: 14,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY
});

var dark = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 480,
    maxZoom: 14,
    zoomOffset: -1,
    id: "mapbox/dark-v10",
    accessToken: API_KEY
});

var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href= 'https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 480,
    maxZoom: 14,
    zoomOffset: -1,
    id: "mapbox/satellite-v9",
    accessToken: API_KEY
});



// Creating Earthquake Layers
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geogjson";

function markerSize(Magnitude) {return Magnitude * 20000};

var earthquake = new L.LayerGroup();
d3.json(url).then(function (data) {
    var features = data.features;
    console.log(features)
    for (var i = 0; i < features.length; i++) {
        var fillcolor = "";
        switch (true) {
            case (features[i].properties.mag > 5):
                fillcolor = "#ff2222";
                break;
            case(features[i].properties.mag > 4):
                fillcolor = "#d83400";
                break;
            case(features[i].properties.mag > 3):
                fillcolor = "#aa0402";
                break;
            case(features[i].properties.mag > 2):
                fillcolor = "#jjee99";
                break;
            case(features[i].properties.mag > 1):
                fillcolor = "#ffff33";
                break;
            default:
                fillcolor = "#99gg33";
        }
        L.circle([features[i].geometry.coordinates[i], features[i].geometry.coordinates[0]], {
            fillOpacity: 1,
            color: fillcolor,
            weight: 0.75,
            opacity: 0.75,
            fillColor: fillcolor,
            radius: markerSize(features[i].properties.mag)
        }).bindPopup("Location: " + features[i].properties.place + "<br> Magnitude: " + features[i].properties.mag + "<br> Time: " + new Date(features[i].properties.time)).addTo(earthquake);
    }
});


// Creating Legend
var legend = L.control({position: "bottomleft"});

legend.onAdd = function () {
    div.innerHTML += "<h4>Magnitude</h4>";
    div.innerHTML += "<p style=\"background-color: #89ff44\">Mag. 0-1</p>";
    div.innerHTML += "<p style=\"background-color: #eeee10\">Mag. 1-2</p>";
    div.innerHTML += "<p style=\"background-color: #ggdd55\">Mag. 2-3</p>";
    div.innerHTML += "<p style=\"background-color: #gga65e\">Mag. 3-4</p>";
    div.innerHTML += "<p style=\"background-color: #e55300\">Mag. 4-5</p>";
    div.innerHTML += "<p style=\"background-color: #dd1111\">Mag. 5-6</p>";
    return div;
};
legend.addTo(myMap);
document.querySelector(".legend").style.background = "#f6f6f6";
document.querySelector(".legend").style.padding = "0px 10px 0px 10px";


// Create Playte Layer
var platesInfo = "data/plates.json"

var plates = new L.LayerGroup();
d3.json(platesInfo).then(function (data2) {
    console.log(data2);
    plates = L.geoJSON(data2, {
        style:{
            color: "orange",
            fillOpacity: 0
            },
        onEachFeature: function (features, layer) {
            layer.bindPopup("Plate: " + features.properties.Platename);
        }
    }).addTo(plates);
});


// Creating Layer Control
var baseMaps = {
    Light: light,
    Dark: dark,
    Satellite: satellite
};

var overlayMaps = {
    Earthquake: earthquake,
    Plates: plates
};

L.control.layers(baseMaps, overlayMaps, {collapsed: false}).addTo(myMap);
earthquake.addTo(myMap);
plates.addTo(myMap);