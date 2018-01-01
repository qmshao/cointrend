function extendPlot(data){
  var plotDiv = document.getElementById('PlotDiv');
  //console.log(data);
  //console.log(MAXLEN);
  Plotly.extendTraces(plotDiv , {x:[[data.t]],y:[[data.x]]}, [0],MAXLEN);
}

function initPlot(data) {
  var plotDiv = document.getElementById('PlotDiv');
  
  //console.log(data);
  var trace1 = {
    type: "scatter",
    mode: "lines",
    name: 'AAPL High',
    x: data.tData,
    y: data.xData,
    line: { color: '#17BECF' }
  }

  // var trace2 = {
  //   type: "scatter",
  //   mode: "lines",
  //   name: 'AAPL Low',
  //   x: unpack(rows, 'Date'),
  //   y: unpack(rows, 'AAPL.Low'),
  //   line: {color: '#7F7F7F'}
  // }

  var data = [trace1];

  var layout = {
    title: 'Balance Trend',
    xaxis: {
      autorange: true,
      //range: ['2015-02-17', '2017-02-16'],
      rangeselector: {
        buttons: [
          {
            count: 1,
            label: '1h',
            step: 'hour',
            stepmode: 'backward'
          },
          {
            count: 6,
            label: '6h',
            step: 'hour',
            stepmode: 'backward'
          },
          { step: 'all' }
        ]
      },
      rangeslider: {},//{range: ['2015-02-17', '2017-02-16']},
      type: 'date'
    },
    yaxis: {
      autorange: true,
      //range: [86.8700008333, 138.870004167],
      type: 'linear'
    }
  };

  Plotly.newPlot(plotDiv, data, layout);
}
