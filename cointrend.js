const express = require("express");
const fs = require("fs");
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server, {path: '/trendio'});


const webport = 3701;
const webpath = '/trend/';

const info = require( './app/infoupdate' );
const DT = 30;
const MAXLEN = 24*3600/DT;


/* Express Server */
app.get(webpath+"*", function(req, res){
    //console.log(req.path);
    var path = req.path.slice(webpath.length);
    if (path.indexOf('.') < 0) {
        path = "index.html";
    }
    res.sendFile(__dirname + "/public/" + path);
  });

server.listen(webport);

console.log("Listening on port " + webport +" in path "+webpath);

/* socket.io Server */
io.on('connection', function (socket) {
    console.log('a user connected');
    socket.emit('connected',MAXLEN);

    socket.on('disconnect', function(){
        console.log('user disconnected');
      });

    socket.on('ready', function (timestamp) {
        socket.emit('initdata',{tData:tData, xData,xData});
    });
});


tData = [];
xData = [];
updateData = function(x){

    var t = new Date() - 0;
    tData.push(t);
    xData.push(x);

    if (tData.length > MAXLEN){
        tData.shift();
        xData.shift();
    }

    io.emit('newdata',{t:t,x:x});
    
}

info.getTotalBalance(updateData);
setInterval(function(){
  info.getTotalBalance(updateData);
},DT*1000);

// var csvWriter = require('csv-write-stream')
// var writer = csvWriter()

// var writer = csvWriter({ headers: ["Time", "Balance"]})
// writer.pipe(fs.createWriteStream('out.csv'))
// //writer.write([new Date(), 100]);

// var writeToCSV = function(total){
//   writer.write([(new Date()).toISOString(), total]);
// };

// info.getTotalBalance(writeToCSV);
// setInterval(function(){
//   info.getTotalBalance(writeToCSV);
// },60000);

// //writer.end()
