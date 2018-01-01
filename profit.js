var request = require('request');
var cheerio = require('cheerio');

const fs = require('fs');
var csvWriter = require('csv-write-stream');
var writer;
var AlgoList = [];
var CurrProfit = [];
var N; // Number of website coins

updateProfit = function(){
  request('https://miningpoolhub.com/?page=home&normalize=nvidia', function(err, resp, html) {
    var profit = {};
    if (!err){
      const $ = cheerio.load(html);
      var algo;
      $('#algoList').find('td').each(function(index, element){
        switch (index%6){
          case 0:
          algo = $(element).text();
          profit[algo] = {};
          break;
          case 1:
          profit[algo]["CurrCoin"] = $(element).text();
          break;
          case 3:
          profit[algo]["profit"] = parseFloat($(element).text());
        }

      });


        if (!writer){
          AlgoList = Object.keys(profit);
          N = AlgoList.length;
          // var header = AlgoList.slice();
          // header.splice(0,0,'Time');
          // writer = csvWriter({ headers: header});
          // writer.pipe(fs.createWriteStream('autoswtich.csv'))
        }

        CurrProfit[0] = (new Date()).toISOString();
        for (i=0; i<AlgoList.length; i++){
          CurrProfit[i+1] = profit[AlgoList[i]]["profit"];
        }

        readAPIProfit();
        // writer.write(CurrProfit);
    }
  });
};






var webapi = require( './app/webapi' );


var MPHhost = 'miningpoolhub.com'; 
var MPHpath = '/index.php?page=api&action=getautoswitchingandprofitsstatistics';


var AlgoIdx = {};
var AlgoList = [];
var CurrProfit = [];

readAPIProfit = function() {
  webapi(MPHhost, MPHpath, (res)=>{
    if (!res["success"]){
      console.log("API ERROR");
    } else {
      if (AlgoList.length===N){
        for (i=0; i<res["return"].length; i++){
          AlgoList[i+N] = res["return"][i]['algo'];
          AlgoIdx[AlgoList[i+N]] = i;
        }
        // init the csv writer
        var header = AlgoList.slice();
        header.splice(0,0,'Time');
        writer = csvWriter({ headers: header});
        writer.pipe(fs.createWriteStream('profit.csv'))
      }

      //CurrProfit[0] = (new Date()).toISOString();
      for (i=0; i<res["return"].length; i++){
        CurrProfit[AlgoIdx[res["return"][i]['algo']]+1+N] = res["return"][i]["normalized_profit_nvidia"];
      }
      writer.write(CurrProfit);
    }
  });
}

updateProfit();
setInterval(updateProfit,5000);