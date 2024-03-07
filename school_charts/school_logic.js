// Load the CSV data
Plotly.d3.csv('schoolcountcsv', function(err, rows){
    if(err) throw err;

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

    // Interactive Bar Graph
    function updateInteractiveGraph(selectedMunicipality) {
        var selectedData = [];
        rows.forEach(function(row) {
            selectedData.push(row[selectedMunicipality]);
        });
        
        Plotly.update('interactive-bar', {
            y: [selectedData]
        }, {
            title: 'Interactive Bar Graph for ' + selectedMunicipality
        });
    }

    dropdown.addEventListener('change', function() {
        var selectedMunicipality = this.value;
        updateInteractiveGraph(selectedMunicipality);
    });

    // Initial plot for default selected municipality
    var defaultMunicipality = municipalities[0];
    updateInteractiveGraph(defaultMunicipality);
});