  // // Create the tile layer that will be the background of our map
  // var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  //   attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  //   maxZoom: 18,
  //   id: "light-v11",
  //   accessToken: API_KEY
  // });

  // // Creating map
  // var map = L.map("mapid", {
  //   center: [39.41, -111, 95],
  //   zoom: 5,
  //   layers: [lightmap]
  // });

// Add console.log to check to see if our code is working.
console.log("working");

// We create the tile layer that will be the background of our map.
var streets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    accessToken: API_KEY
});

// We create the second tile layer that will be the background of our map.
var satelliteStreets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    accessToken: API_KEY
});

// We create a third tile layer that will be the background of our map.
var dark = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    accessToken: API_KEY
});

// Create the map object with center, zoom level and default layer.
var map = L.map('mapid', {
    center: [40.7, -94.5],
    zoom: 3,
    layers: [streets]
});

// Create a base layer that holds all three maps.
var baseMaps = {
  "Streets": streets,
  "Satellite": satelliteStreets,
  "Dark": dark
};

// 1. Add a 3rd layer group for the major earthquake data.
let allEarthquakes = new L.LayerGroup();
let tectonicplates = new L.LayerGroup();
let majorEarthquakes = new L.LayerGroup();

// 2. Add a reference to the major earthquake group to the overlays object.
let overlays = {
  "Tectonic Plates": tectonicplates,
  "Earthquakes": allEarthquakes,
  "Major Earthquakes": majorEarthquakes
};

// Then we add a control to the map that will allow the user to change which
// layers are visible.
L.control.layers(baseMaps, overlays).addTo(map);

// Creating Earthquake Layers
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

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
        L.circle([features[i].geometry.coordinates[1], features[i].geometry.coordinates[0]], {
            fillOpacity: 1,
            color: fillcolor,
            weight: 0.75,
            opacity: 0.75,
            fillColor: fillcolor,
            radius: markerSize(features[i].properties.mag)
        }).bindPopup("Location: " + features[i].properties.place + "<br> Magnitude: " + features[i].properties.mag + "<br> Time: " + new Date(features[i].properties.time)).addTo(earthquake);
    }
});


// // Creating Legend
// var legend = L.control({position: "bottomleft"});

// legend.onAdd = function () {
//     div.innerHTML += "<h4>Magnitude</h4>";
//     div.innerHTML += "<p style=\"background-color: #89ff44\">Mag. 0-1</p>";
//     div.innerHTML += "<p style=\"background-color: #eeee10\">Mag. 1-2</p>";
//     div.innerHTML += "<p style=\"background-color: #ggdd55\">Mag. 2-3</p>";
//     div.innerHTML += "<p style=\"background-color: #gga65e\">Mag. 3-4</p>";
//     div.innerHTML += "<p style=\"background-color: #e55300\">Mag. 4-5</p>";
//     div.innerHTML += "<p style=\"background-color: #dd1111\">Mag. 5-6</p>";
//     return div;
// };

// legend.addTo(map);
// document.querySelector(".legend").style.background = "#f6f6f6";
// document.querySelector(".legend").style.padding = "0px 10px 0px 10px";


// // Create Playte Layer
// var platesInfo = "data/plates.json"

// var plates = new L.LayerGroup();
// d3.json(platesInfo).then(function (data2) {
//     console.log(data2);
//     plates = L.geoJSON(data2, {
//         style:{
//             color: "orange",
//             fillOpacity: 0
//             },
//         onEachFeature: function (features, layer) {
//             layer.bindPopup("Plate: " + features.properties.Platename);
//         }
//     }).addTo(plates);
// });


// Creating Layer Control
var overlayMaps = {
    Earthquake: earthquake
    // Plates: plates
};

L.control.layers(baseMaps, overlayMaps, {collapsed: false}).addTo(map);
earthquake.addTo(map);
// plates.addTo(map);