function buildMetadata(sample) {

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
    var url = `/metadata/${sample}`;
    d3.json(url).then(function(data) {

    var sample_metadata = d3.select('#sample-metadata').html("");
    // Use `.html("") to clear any existing metadata
    
    console.log(data);

    // Use `Object.entries` to add each key and value pair to the panel
    Object.entries(data).forEach(function ([key, value]) {
      var row = sample_metadata.append("p");
      row.text(`${key}: ${value}`);
  })

    // BONUS: Build the Gauge Chart
    buildGauge(data.WFREQ);
    })
};

function buildCharts(sample) {
  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var url = `/samples/${sample}`;

  //Build a Bubble Chart using the sample data
  d3.json(url).then(function(data) {
    d3.select('#pie').html("");
    d3.select('#bubble').html("");
    var x_labels = data.otu_ids;
    var y_labels = data.sample_values;
    var markerColors = data.otu_ids;
    var textColors = data.otu_labels;
  
   var trace1 = {
     'x': x_labels,
     'y': y_labels,
     'text': textColors,
     'mode': 'markers',
     'marker': {
      'color': markerColors,
      'size': y_labels,
      colorscale: 'Electric'
      }
    }
  
  var data1 = [trace1];
 var layout = {title: "Bubble Chart"};

Plotly.newPlot('bubble', data1, layout);


//     // @TODO: Build a Pie Chart
//     // HINT: You will need to use slice() to grab the top 10 sample_values,
    var trace2 = [{
      values: data.sample_values.slice(0, 10),
      labels: x_labels.slice(0,10),
      hovertext: data.otu_labels.slice(0,10),
      hoverinfo: "hovertext",
      type: 'pie'
    }];

    var layout1 = {
      height: 400,
      width: 500
    };
    Plotly.newPlot('pie', trace2, layout1);
  })};
function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
 // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
  buildGauge(newSample);
}

// Initialize the dashboard
init();
