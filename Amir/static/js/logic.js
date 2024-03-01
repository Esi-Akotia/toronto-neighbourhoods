
var map = L.map('map').setView([43.7, -79.4], 12);  // Center the map over Toronto

// Add base map tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18
}).addTo(map);

var schoolLayer = L.layerGroup().addTo(map);
var parkLayer = L.layerGroup().addTo(map);

fetch('/schooldata').then(r => r.json()).then(data => {
    L.geoJson(data, {
        pointToLayer: (feature, latlng) => L.marker(latlng),
        onEachFeature: (feature, layer) => {
            layer.bindPopup(`Name: ${feature.properties.NAME}<br>Type: ${feature.properties.SCHOOL_TYPE_DESC}`);
        }
    }).addTo(schoolLayer);
});
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
// build function to get the trend of the crime rate
function getCrimeRateTrendHtml(crimeRate2022, crimeRate2023) {
    let trendSymbol = crimeRate2023 > crimeRate2022 ? '↑' : '↓';
    let trendColor = crimeRate2023 > crimeRate2022 ? 'red' : 'green';
    return `<span style="color: ${trendColor};">${trendSymbol}</span>`;
}
// build function to generate the popup content
function generatePopupContent(feature) {
    let content = `<h3>${feature.properties.AREA_NAME}</h3><p>Population 2023: ${feature.properties.POPULATION_2023}</p>`;
    const crimes = ['ASSAULT', 'AUTOTHEFT', 'BIKETHEFT', 'BREAKENTER', 'HOMICIDE', 'ROBBERY', 'SHOOTING', 'THEFTFROMMV', 'THEFTOVER'];
    crimes.forEach(crime => {
        let rate2022 = feature.properties[`${crime}_RATE_2022`];
        let rate2023 = feature.properties[`${crime}_RATE_2023`];
        content += `<p>${crime} Rate 2023: ${rate2023} ${getCrimeRateTrendHtml(rate2022, rate2023)}</p>`;
    });
    return content;
}
// VERSION 2: The fill color of the each neighborhood was colored as the assualt Rate 2023 and the border was colored black
fetch('/crimedata')
.then(response => response.json())
.then(data => {
    data.forEach(geojson => {
        L.geoJson(JSON.parse(geojson), {
            style: function(feature) {
                return {
                    fillColor: getColor(feature.properties.ASSAULT_RATE_2023),
                    color: 'black',  // Border color
                    weight: 1,       // Border width
                    fillOpacity: 1   // Fill opacity
                };
            },
            onEachFeature: function(feature, layer) {
                let popupContent = generatePopupContent(feature);
                layer.bindPopup(popupContent);
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
