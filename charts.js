function createChart(canvID, data, label = ""){
    // console.log("creating chart");

    if(myChart){
        myChart.destroy();
    }

    var ctx = document.getElementById(canvID);
    // graphCanvasElement.parentElement.setAttribute('style',)
    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.dates,
            datasets: [{
                label: label,
                data: data.values,
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                borderColor: '#ff4500',
                labelColor: '#ffffff',
                borderWidth: 1
            }]
        },
        options: {
            event: ['click'],
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            },
            
        }
    });
}
