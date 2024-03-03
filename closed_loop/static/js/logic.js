
var map = L.map('map').setView([43.7, -79.4], 11);  // Center the map over Toronto

// Add base map tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18
}).addTo(map);

// VERSION 1: The border of the each neighborhood was colored as the assualt Rate 2023 (Fixed in Version 2)

// // Fetch and style the GeoJSON data
// fetch('/data')
//     .then(response => response.json())
//     .then(data => {
//         data.forEach(geojson => {
//             L.geoJson(JSON.parse(geojson), {
//                 style: function(feature) {
//                     return { 
//                         filcolor: getColor(feature.properties.ASSAULT_RATE_2023),
//                         color: 'black', 
//                         weight: 1,
//                         fillOpacity: 0.7
//                     };
//                 },
//                 onEachFeature: function(feature, layer) {
//                     layer.bindPopup('Neighborhood: ' + feature.properties.AREA_NAME +
//                                     '<br>Assault Rate (2023): ' + feature.properties.ASSAULT_RATE_2023);
//                 }
//             }).addTo(map);
//         });
//     });

// VERSION 2: The fill color of the each neighborhood was colored as the assualt Rate 2023 and the border was colored black
fetch('/data')
    .then(response => response.json())
    .then(data => {
        data.forEach(geojson => {
            L.geoJson(geojson, { // Removed parse as no longer required
                style: function(feature) {
                    return {
                        fillColor: getColor(feature.properties.ASSAULT_RATE_2023),
                        color: 'black',  // Border color
                        weight: 1,       // Border width
                        fillOpacity: 1   // Fill opacity
                    };
                },
                onEachFeature: function(feature, layer) {
                    layer.bindPopup('Neighborhood: ' + feature.properties.AREA_NAME +
                                    '<br>Assault Rate (2023): ' + feature.properties.ASSAULT_RATE_2023);
                }
            }).addTo(map);
        });
    });
    


// Define the color scale function
function getColor(assaultRate) {
    return assaultRate > 1500 ? '#800026' :
           assaultRate > 1100 ? '#BD0026' :
           assaultRate > 900 ? '#E31A1C' :
           assaultRate > 700 ? '#FC4E2A' :
           assaultRate > 500 ? '#FD8D3C' :
           assaultRate > 300 ? '#FEB24C' :
           assaultRate > 100 ? '#FED976' :
                               '#FFEDA0';
}


// Add legend control
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 100, 300, 500, 700, 900, 1100, 1500],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        var color = getColor(grades[i] + 1);
        div.innerHTML +=
            '<div style="display: flex; align-items: center;">' +
                '<div style="width: 20px; height: 20px; background-color:' + color + '; margin-right: 5px;"></div>' +
                '<span>' + grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+') + '</span>' +
            '</div>';
    }

    return div;
};

legend.addTo(map);
