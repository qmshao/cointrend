var info = require( './app/infoupdate' );




const fs = require('fs');
var csvWriter = require('csv-write-stream')
var writer = csvWriter()

var writer = csvWriter({ headers: ["Time", "Balance"]})
writer.pipe(fs.createWriteStream('out.csv'))
//writer.write([new Date(), 100]);

var writeToCSV = function(total){
  writer.write([(new Date()).toISOString(), total]);
};

info.getTotalBalance(writeToCSV);
setInterval(function(){
  info.getTotalBalance(writeToCSV);
},60000);

//writer.end()
