// Update chart.js after everything has been loaded
window.onload = () => {
    updateChartData(0, 1)
    document.getElementsByClassName('hide')[0].style.visibility = "visible";
    document.getElementsByClassName('hide')[1].style.visibility = "visible";    
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
            label: 'Stock Price',
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(0, 91, 182)',
            data: [],
            pointRadius: 0.5,
            fill: false,
            lineTension: 0
        }]
    },
    // Configuration options go here
    options: {maintainAspectRatio: true}
});

// Change chart data and timeframe when user clicks on day/week/month
let updateChartData = (indexLabels, indexData) => {
    
    chart.data.labels = stockData[indexLabels];
    chart.data.datasets[0].data = stockData[indexData];   
    chart.update();
};

