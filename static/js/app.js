// area to test code out of the functions through console.log
// define constant variable for url
const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json"

// Get the names field
d3.json(url).then(data => console.log(data.names));
// get the metadata field
d3.json(url).then(data => console.log(data.metadata));
// Build metadata panel with the first sample
d3.json(url).then(data => console.log(data.metadata[0]));
d3.json(url).then(data => console.log(data.metadata[0].id));
// Get the samples field
d3.json(url).then(data => console.log(data.samples[0]));
d3.json(url).then(data => console.log(data.samples[0].id));

// Build the metadata panel
function buildMetadata(sample) {
  d3.json(url).then((data) => {

    // get the metadata field
    let metaData = data.metadata;

    // Filter the metadata for the object with the desired sample number
    let sampleMetaData = metaData.filter(item => item.id === parseInt(sample));

    // Use d3 to select the panel with id of `#sample-metadata`
    let panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    sampleMetaData.map(item => {
      for (let key in item){
        panel.append("html").text(`${key}: ${item[key]}`);
      }
    });
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json(url).then((data) => {

    // Get the samples field
    let samples = data.samples;

    // Filter the samples for the object with the desired sample number
    let sampleSamples = samples.filter(item => item.id === sample)[0];
    console.log(sampleSamples)

    // Get the otu_ids, otu_labels, and sample_values
    let otuIds = sampleSamples.otu_ids;
    let otuLabels = sampleSamples.otu_labels;
    let sampleValues = sampleSamples.sample_values;

    let trace1 = {
      x: otuIds,
      y: sampleValues,
      mode: "markers",
      marker:{
        size: sampleValues,
        color: otuIds
      },
      text: otuLabels
    };

    // Data array
    let plotData1 = [trace1];

    // Layout
    let layout1 = {
      title: "Bacteria Cultures Per Sample",
      xaxis: {
        title: "OTU ID"
      },
      yaxis: {
        title: "Number of Bacteria"
      }
    };

    // Render the Bubble Chart
    Plotly.newPlot("bubble", plotData1, layout1);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    // Combine the arrays into an array of objects
    let combinedData2 = otuIds.map((id, index) => {
      return {otu_id: `OTU ${id}`, sample_value: sampleValues[index]};
    });

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let topTen = combinedData2.sort((firstNum, secondNum) => secondNum.sample_value - firstNum.sample_value).slice(0,10).reverse();

    let xValues = topTen.map(item => item.sample_value);
    let yLabels = topTen.map(item => item.otu_id);

    let trace2 = {
      x: xValues,
      y: yLabels,
      type: "bar",
      orientation: "h"
    };

    // Data array
    let plotData2 = [trace2];

    // Layout
    let layout2 = {
      title: "Top 10 Bacteria Cultures Found",
      xaxis: {
        title: "Number of Bacteria"
      },
      yaxis: {
        title: "IDs"
      }
    };

    // Render the Bar Chart
    Plotly.newPlot("bar", plotData2, layout2);

  });
}

// Function to run on page load
function init() {
  d3.json(url).then((data) => {

    // Get the names field
    let names = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let options = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    for(let i=0; i < names.length; i++){
      // append a <option value="name">name</option>"
      let name = names[i];
      let option = options.append("option");
      option.text(name);
    }

    // Get the first sample from the list
    let firstSample = names[0];

    // Build charts and metadata panel with the first sample
    buildMetadata(firstSample);
    buildCharts(firstSample);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
}

// Initialize the dashboard
init();
