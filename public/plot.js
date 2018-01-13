var ColorLib = ['#1f77b4',  // muted blue
  '#ff7f0e',  // safety orange
  '#2ca02c',  // cooked asparagus green
  '#d62728',  // brick red
  '#9467bd',  // muted purple
  '#8c564b',  // chestnut brown
  '#e377c2',  // raspberry yogurt pink
  '#7f7f7f',  // middle gray
  '#bcbd22',  // curry yellow-green
  '#17becf'   // blue-teal
];

function extendPlot(data) {
  //var plotDiv = document.getElementById('PlotDiv');
  for (divname in PlotDiv) {
    var div = PlotDiv[divname];
    var newy = [], newx = [];;
    for (i = 0; i < ae_cointype.length; i++) {
      newx[i] = [data.t];
      newy[i] = [data[divname][ae_cointype[i]]];
    }

    var len = div.data[0]['x'].length;
    if ((data.t - div.data[0]['x'][0]) / 1000 / 3600 / 24 < 7) {
      len++;
    }
    Plotly.extendTraces(div, { x: newx, y: newy }, [...Array(ae_cointype.length).keys()], );
  }
}

function initPlot(rtdata) {
  ae_cointype = Object.keys(rtdata.balance);
  var LEN = ae_cointype.length;
  //var plotDiv = document.getElementById('PlotDiv');
  for (divname in PlotDiv) {
    var div = PlotDiv[divname];
    var plotdata = [];
    for (i = 0; i < LEN; i++) {
      plotdata[i] = {
        type: "scatter",
        mode: "lines",
        name: ae_cointype[i],
        x: rtdata.t,
        y: rtdata[divname][ae_cointype[i]],
        line: { color: ColorLib[i] }
      }
      plotdata[i].yaxis = 'y' + (i == 0 ? '' : (i + 1));
    }

    var leftmargin = 0.05 * LEN;
    var layout = {
      title: divname.toUpperCase(),
      xaxis: {
        autorange: true,
        domain: [leftmargin, 1],
        //range: ['2015-02-17', '2017-02-16'],
        rangeselector: {
          buttons: [
            {
              count: 6,
              label: '6h',
              step: 'hour',
              stepmode: 'backward'
            },
            {
              count: 1,
              label: '1d',
              step: 'day',
              stepmode: 'backward'
            },
            { step: 'all' }
          ]
        },
        rangeslider: {
        },//{range: ['2015-02-17', '2017-02-16']},
        type: 'date'
      },

      //paper_bgcolor: 'rgba(0,0,0,0)',
      //plot_bgcolor: 'rgba(0,0,0,0)',
      margin: { l: 20, r: 20, t: 60, b: 5 },
      height: 300,
      font: {
        family: "Arial",
        size: 14,
        color: '#7f7f7f'
      }
    };

    for (i = 0; i < LEN; i++) {
      var line = 'yaxis' + (i == 0 ? '' : i + 1);
      layout[line] = {
        tickfont: { color: ColorLib[i] },
        rangemode: 'nonnegative',
        autorange: true,
      }
      if (i != 0) {
        layout[line].overlaying = 'y';
        layout[line].position = leftmargin - leftmargin / LEN * (i);
      }
    }

    Plotly.newPlot(div, plotdata, layout);
  }
}

function creatCreditsPlot(credits){
  ae_lib = Object.keys(credits[0]).filter(e => e !== 'date');
  LEN = ae_lib.length;
  var plotdata = [];
  for (i = 0; i < LEN; i++) {
    plotdata[i] = {
      type: "bar",
      //mode: "lines",
      name: ae_lib[i],
      x: credits.map(a => a.date),
      y: credits.map(a => a[ae_lib[i]]),
      line: { color: ColorLib[i] }
    }
    plotdata[i].yaxis = 'y' + (i == 0 ? '' : (i + 1));
  }

  var leftmargin = 0.05 * LEN;
  var layout = {
    title: 'CREDITS HISTORY',
    xaxis: {
      autorange: true,
      domain: [leftmargin, 1],
      //range: ['2015-02-17', '2017-02-16'],
      rangeselector: {
        buttons: [
          {
            count: 7,
            label: '1w',
            step: 'day',
            stepmode: 'backward'
          },
          {
            count: 1,
            label: '1m',
            step: 'month',
            stepmode: 'backward'
          },
          { step: 'all' }
        ]
      },
      rangeslider: {
        //bgcolor: 'rgba(0,0,0,1)',
        thickness: 0.1
      },//{range: ['2015-02-17', '2017-02-16']},
      type: 'date'
    },

    margin: { l: 20, r: 20, t: 60, b: 5 },
    height: 300,
    font: {
      family: "Arial",
      size: 14,
      color: '#7f7f7f'
    }
  };

  for (i = 0; i < LEN; i++) {
    var line = 'yaxis' + (i == 0 ? '' : i + 1);
    layout[line] = {
      tickfont: { color: ColorLib[i] },
      rangemode: 'nonnegative',
      autorange: true,
    }
    if (i != 0) {
      layout[line].overlaying = 'y';
      layout[line].position = leftmargin - leftmargin / LEN * (i);
    }
  }

  Plotly.newPlot(CrDiv, plotdata, layout);
}
  
window.onresize = function () {
  for (div in PlotDiv) {
    Plotly.Plots.resize(PlotDiv[div]);
  }
  Plotly.Plots.resize(CrPlotDiv);
};
  