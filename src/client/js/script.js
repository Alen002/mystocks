console.log('js is working');

// user selection of chart type is stored in chartStyle variable
const chartType = () => {
    let chartStyle = document.getElementById('chart-type').value;  
    console.log(chartStyle);
    return chartStyle;
};

var ctx = document.getElementById('myChart').getContext('2d');

var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'bar',

    // The data for our dataset
    data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [{
            label: 'My First dataset',
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: [0, 10, 5, 2, 20, 30, 45],
        }]
    },

    // Configuration options go here
    options: {}
});

function updateChartData() {
    chart.data.datasets[0].data = test;
    chart.update();
};

let test = [100, 150, 100, 200];




function updateChartType() {
    chart.type = 'line'; /* document.getElementById('chart-type').value; */
    chart.update();
    console.log(chart.type)
};

