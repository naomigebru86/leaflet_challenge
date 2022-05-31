var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson";

var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

var satellite = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
});

var baseMaps = {
    Street: street,
    Topography: topo,
    Satellite: satellite
};

function getColor(depth) {
    return depth > 90 ? '#FF0000' :
        depth >  70 ? '#ff6600' :
            depth > 50 ? '#FFCC00' :
                depth > 30 ? '#ccff00' :
                    depth > 10 ? '#66ff00' :
                        '#00FF00'; 
}

var myMap = L.map("map", {
    center: [0, 0],
    zoom: 3,
    layers: [street]
});

d3.json(url).then(function (data) {
    for (var i = 0; i < data.features.length; i++) {
        L.circle([data.features[i].geometry.coordinates[1], data.features[i].geometry.coordinates[0]], {
            fillOpacity: 0.75,
            color: getColor(data.features[i].geometry.coordinates[2]),
            radius: Math.pow(data.features[i].properties.mag, 2)*2500
        })
        .bindPopup(`<h1>Magnitude: ${data.features[i].properties.mag.toLocaleString()}</h1> <hr> <h3>Location: ${data.features[i].properties.place}</h3> <h3>Depth: ${data.features[i].geometry.coordinates[2].toLocaleString()}</h3>`)
        .addTo(myMap);
    }
});

var legend = L.control({position: 'bottomright'});

legend.onAdd = function () {
    var div = L.DomUtil.create('div', 'info legend'),
        grades = [-10, 10, 30, 50, 70, 90];

    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    return div;
};
legend.addTo(myMap);

L.control.layers(baseMaps).addTo(myMap);