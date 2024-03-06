// Load the CSV data
Plotly.d3.csv('schoolcountcsv', function(err, rows) {
    if (err) throw err;

    console.log(rows); // Log the loaded data

    var municipalities = rows.map(row => row['Municipality']); // Get all municipality names
    var schoolTypes = Object.keys(rows[0]).filter(key => key !== 'Municipality'); // Get all school types

    // Populate dropdown menu with municipalities
    var dropdown = document.getElementById('municipality-dropdown');
    municipalities.forEach(function(municipality) {
        var option = document.createElement('option');
        option.text = municipality;
        dropdown.add(option);
    });

    // Grouped Bar Graph
    var groupedData = schoolTypes.map(function(schoolType) {
        return {
            x: municipalities,
            y: rows.map(row => parseInt(row[schoolType])),
            type: 'bar',
            name: schoolType
        };
    });

    var groupedLayout = {
        barmode: 'group',
        title: 'Grouped Bar Graph',
        xaxis: { title: 'Municipality' },
        yaxis: { title: 'Count' }
    };

    Plotly.newPlot('grouped-bar', groupedData, groupedLayout);

    // Stacked Bar Graph
    var stackedData = schoolTypes.map(function(schoolType) {
        return {
            x: municipalities,
            y: rows.map(row => parseInt(row[schoolType])),
            type: 'bar',
            name: schoolType
        };
    });

    var stackedLayout = {
        barmode: 'stack',
        title: 'Stacked Bar Graph',
        xaxis: { title: 'Municipality' },
        yaxis: { title: 'Count' }
    };

    Plotly.newPlot('stacked-bar', stackedData, stackedLayout);

    // Function to update the interactive graph
    function updateInteractiveGraph(selectedMunicipality) {
    console.log("Updating graph for:", selectedMunicipality); // Debugging

    var selectedData = rows.find(row => row['Municipality'] === selectedMunicipality);
    var xLabels = Object.keys(selectedData).slice(1); // Extract school types
    var counts = Object.values(selectedData).slice(1).map(value => parseInt(value)); // Extract counts
    console.log("Selected data:", counts); // Debugging

    var data = [{
        x: xLabels,
        y: counts,
        type: 'bar'
    }];

    var layout = {
        title: 'Interactive Bar Graph for ' + selectedMunicipality,
        xaxis: { title: 'School Type' },
        yaxis: { title: 'Count' }
    };

    // Clear the interactive-bar div before creating a new plot
    Plotly.purge('interactive-bar');

    Plotly.newPlot('interactive-bar', data, layout);
}

    // Event listener for dropdown selection change
    dropdown.addEventListener('change', function() {
        var selectedMunicipality = dropdown.value;
        console.log("Selected municipality:", selectedMunicipality); // Debugging
        updateInteractiveGraph(selectedMunicipality);
    });

    // Initial plot for default selected municipality
    var defaultMunicipality = municipalities[0];
    updateInteractiveGraph(defaultMunicipality);
});
