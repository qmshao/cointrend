var MAXLEN = 1000000;

window.onload = function() {

    var TimeStamp = ""

    var socket = io('',{path: '/trendio/socket.io', query:"id="+window.location.pathname.replace(/\/trend\//, '')});

    socket.on('connected', function (data){
        console.log(data);
        MAXLEN = data;
        socket.emit('ready',TimeStamp);
    });

    socket.on('initdata', initPlot);

    socket.on('newdata', (data)=>{
        extendPlot(data);
        console.log(data.off);
    });
    // socket.on('data', function (data){
    //     tData = data.tData;
    //     xData = data.xData;
    // });


    // var plotDiv = document.getElementById('PlotDiv');
    // var trace1 = {
    //     x: [1999, 2000, 2001, 2002],
    //     y: [10, 15, 13, 17],
    //     type: 'scatter'
    //   };
    //   var trace2 = {
    //     x: [1999, 2000, 2001, 2002],
    //     y: [16, 5, 11, 9],
    //     type: 'scatter'
    //   };
    //   var data = [trace1, trace2];
    //   var layout = {
    //     title: 'Sales Growth',
    //     xaxis: {
    //       title: 'Year',
    //       showgrid: false,
    //       zeroline: false
    //     },
    //     yaxis: {
    //       title: 'Percent',
    //       showline: false
    //     }
    //   };
    //   Plotly.newPlot(plotDiv, data, layout);


}
