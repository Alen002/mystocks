console.log('js is working');

// user selection of chart type is stored in chartStyle variable
const chartType = () => {
    let chartStyle = document.getElementById('chart-type').value;  
    console.log(chartStyle);
    return chartStyle;
};

var ctx = document.getElementById('myChart').getContext('2d');
Chart.defaults.scale.gridLines.drawOnChartArea = false;

var chart = new Chart(ctx, {
    
    // The type of chart we want to create
    type: 'line',

    // The data for our dataset
    data: {
        labels: [],
        datasets: [{
            label: 'My First dataset',
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(0, 91, 182)',
            data: [],
            fill: false,
            lineTension: 0
        }]
    },

    // Configuration options go here
    options: {}
});


function updateChartData() {
    //stockValues and stockTimeframe values received from index.ejs template
    console.log(stockValues);
    console.log(stockTimeframe);
    let stockDates = [];
    
    stockTimeframe.forEach((index) => {
        stockDates.push(new Date(index*1000).toLocaleDateString("en-US"));
    });
    
    chart.data.datasets[0].data = stockValues;
    chart.data.labels = stockDates;
    
    chart.update();
};

// Update chart.js after everything has been loaded
window.onload = () => {
    updateChartData()
};