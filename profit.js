const request = require('request');
const cheerio = require('cheerio');
const express = require("express");
const app = express();
const server = require('http').Server(app);
const webapi = require( './app/webapi' );


var MPHhost = 'miningpoolhub.com'; 
var MPHpath = '/index.php?page=api&action=getautoswitchingandprofitsstatistics';
const path = '/profit/';
const port = 3702;

var APIJSON = {};
var profit = {};

/* Read the MPH API to get the format */
function readAPIProfit() {
  return new Promise(function (resolve, reject) {
    webapi(MPHhost, MPHpath, (res) => {
      if (!res["success"]) {
        console.log("API ERROR");
        reject("API ERROR");
      } else {
        resolve(res);
      }
    });
  });
}


/* Express Server */
function startServer() {
  app.get(path + "*", function (req, res) {
    res.json(APIJSON);
  });

  server.listen(port);
  console.log("Listening on port " + port + " in path " + path);
}

/* Read profit from Web Page */
function updateProfit(){
  request('https://miningpoolhub.com/?page=home&normalize=none', function(err, resp, html) {
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

      for (i=0; i<APIJSON["return"].length; i++){
        algo = APIJSON["return"][i].algo;
        APIJSON["return"][i].profit = profit[algo]["profit"];
        APIJSON["return"][i].current_mining_coin = profit[algo]["CurrCoin"];
      }

    } else {
      readAPIProfit().then(function(resolve,reject){
        APIJSON = resolve;
      });
    }
  });
};


async function StartAPI(){
  startServer();
  APIJSON= await readAPIProfit();
  setInterval(updateProfit,10000);
}


StartAPI();





