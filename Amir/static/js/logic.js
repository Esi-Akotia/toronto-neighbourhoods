
var map = L.map('map').setView([43.7, -79.4], 12);  // Center the map over Toronto

// Add base map tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18
}).addTo(map);

var schoolLayer = L.layerGroup()
var parkLayer = L.layerGroup()
var crimeLayer = L.layerGroup().addTo(map)

// Using Bootstrap Icons for the school and park icons to help with the visual representation
var schoolIcon = L.icon({
    iconUrl: 'https://cdn.jsdelivr.net/npm/@tabler/icons@2.47.0/icons/school.svg',
    iconSize: [20, 20],     // Size of the icon
    iconAnchor: [16, 32],   // Anchor point of the icon (center bottom)
    popupAnchor: [0, -32]   // Popup offset relative to the icon anchor
});

var parkIcon = L.icon({
    iconUrl: 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.7.2/icons/tree-fill.svg',
    iconSize: [20, 20],     // Size of the icon
    iconAnchor: [16, 32],   // Anchor point of the icon (center bottom)
    popupAnchor: [0, -32]   // Popup offset relative to the icon anchor
});

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

// Fetch and add the school data
fetch('/schooldata')
    .then(response => response.json())
    .then(data => {
        L.geoJson(data, {
            pointToLayer: (feature, latlng) => L.marker(latlng, { icon: schoolIcon }), // Use school icon
            onEachFeature: (feature, layer) => {
                const schooltype = feature.properties.schooltype || 'N/A';
                layer.bindPopup(`Name: ${feature.properties.NAME}<br>Type: ${feature.properties.SCHOOL_TYPE_DESC}`);
            }
        }).addTo(schoolLayer);
    });

// Fetch and add the park data
fetch('/parksdata')
    .then(response => response.json())
    .then(data => {
        L.geoJson(data, {
            pointToLayer: (feature, latlng) => L.marker(latlng, { icon: parkIcon }), // Use park icon
            onEachFeature: (feature, layer) => {
                const amenities = feature.properties.AMENITIES || 'N/A';
                layer.bindPopup(`Park Name: ${feature.properties.ASSET_NAME}<br>Amenities: ${amenities}`);
            }
        }).addTo(parkLayer);
    });

// Fetch and add crime data to the map
fetch('/crimedata')
    .then(response => response.json())
    .then(data => {
        data.forEach(geojson => {
            L.geoJson(geojson, {
                style: function(feature) {
                    return {
                        fillColor: getColor(feature.properties.ASSAULT_RATE_2023),
                        color: 'black',  // Border color
                        weight: 1,       // Border width
                        fillOpacity: 0.44 // Fill opacity
                    };
                },
                onEachFeature: function(feature, layer) {
                    let popupContent = generatePopupContent(feature);
                    layer.bindPopup(popupContent);
                }
            }).addTo(crimeLayer);
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

// Add more layer control
var overlayMaps = {
    "Schools": schoolLayer,
    "Parks": parkLayer,
    "Crime": crimeLayer
};

L.control.layers(null, overlayMaps, {collapsed: false}).addTo(map);



// Charting the Crime Rate as Pie chart (2023)

// Function to fetch crime data and update the pie chart
function updateCrimeChart(neighborhoodName) {
    fetch('/crimedata') // Adjust this URL to your actual endpoint
        .then(response => response.json())
        .then(data => {
            // Filter data for the selected neighborhood
            const selectedData = data.find(feature => feature.properties.AREA_NAME === neighborhoodName);
            if (!selectedData) return; // Exit if no data found

            // Extract crime data for the selected neighborhood
            const crimeData = {
                Assault: selectedData.properties.ASSAULT_2023,
                AutoTheft: selectedData.properties.AUTOTHEFT_2023,
                BikeTheft: selectedData.properties.BIKETHEFT_2023,
                BreakEnter: selectedData.properties.BREAKENTER_2023,
                Homicide: selectedData.properties.HOMICIDE_2023,
                Robbery: selectedData.properties.ROBBERY_2023,
                Shooting: selectedData.properties.SHOOTING_2023,
                Theft_From_MotorVehicle: selectedData.properties.THEFTFROMMV_2023,
                theftOver: selectedData.properties.THEFTOVER_2023,
            };

            // Prepare data for the pie chart
            const chartData = {
                labels: Object.keys(crimeData),
                datasets: [{
                    label: 'Crime Counts',
                    data: Object.values(crimeData),
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)',
                        'rgba(199, 199, 199, 0.2)',
                        'rgba(83, 102, 255, 0.2)',
                        'rgba(40, 159, 64, 0.2)',
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)',
                        'rgba(159, 159, 159, 1)',
                        'rgba(83, 102, 255, 1)',
                        'rgba(40, 159, 64, 1)',
                    ],
                    borderWidth: 1
                }]
            };

            // Config object for the chart
            const config = {
                type: 'pie',
                data: chartData,
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'right',
                        },
                        title: {
                            display: true,
                            text: 'Crime Types in ' + neighborhoodName + ' (2023)'
                        }
                    }
                    
                },
            };

            // Render the chart
            const crimeChartElement = document.getElementById('crimeChart').getContext('2d');
            if (window.crimeChartInstance) {
                window.crimeChartInstance.destroy(); // DELETE the existing chart instance if present
            }
            window.crimeChartInstance = new Chart(crimeChartElement, config); // Create a new chart instance
        });
}

// Event listener for dropdown changes
document.getElementById('Neighbourhood').addEventListener('change', function() {
    updateCrimeChart(this.value);
});

// Charting the Crime Rate overtime as linechart (2015-2023)

// Function to update line chart based on selected neighborhood
function updateLineChart(neighborhoodName) {
    fetch('/crimedata')
        .then(response => response.json())
        .then(data => {
            const selectedNeighborhoodData = data.find(neighborhood => neighborhood.properties.AREA_NAME === neighborhoodName);
        

            const crimeTypes = ['ASSAULT', 'AUTOTHEFT', 'BIKETHEFT', 'BREAKENTER', 'HOMICIDE', 'ROBBERY', 'SHOOTING', 'THEFTFROMMV', 'THEFTOVER'];
            const years = ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023'];
            const crimeDataByType = {};

            crimeTypes.forEach(crimeType => {
                crimeDataByType[crimeType] = years.map(year => selectedNeighborhoodData.properties[`${crimeType}_RATE_${year}`]);
            });

            const crimeLineChartData = {
                labels: years,
                datasets: crimeTypes.map((crimeType, index) => ({
                    label: crimeType,
                    data: crimeDataByType[crimeType],
                
                    borderColor:[
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)',
                        'rgba(159, 159, 159, 1)',
                        'rgba(83, 102, 255, 1)',
                        'rgba(40, 159, 64, 1)',
                    ],
                    borderWidth: 1.5,
                    fill: false
                }))
            };

            const lineChartOptions = {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: `Crime Types Trend in ${neighborhoodName} (2015-2023)`
                    }
                },
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Year'
                        }
                    },
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Crime Rate'
                        }
                    }
                }
            };

            const crimeLineChartElement = document.getElementById('crimeLineChart').getContext('2d');
            if (window.crimeLineChartInstance) {
                window.crimeLineChartInstance.destroy(); // DELETE the existing chart instance if present
            }
            window.crimeLineChartInstance = new Chart(crimeLineChartElement, {
                type: 'line',
                data: crimeLineChartData,
                options: lineChartOptions
            });
        });
}

// Event listener for dropdown changes
document.getElementById('Neighbourhood').addEventListener('change', function() {
    updateLineChart(this.value);
});


