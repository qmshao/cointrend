const express = require("express");
const fs = require("fs");
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server, {path: '/trendio'});


const info = require( './app/infoupdate' );
const sendmail = require('./app/sendmail');

const webport = 3701;
const webpath = '/trend/';
const DT = 60; //sec
const WARNINGTIME = 3; //min

const MAXLEN = 24*3600/DT;
const WARNINGCOUNT =  WARNINGTIME*60/DT;

const ae_lib = ["ethereum","litecoin","vertcoin"];
var ae_cointype; // = ["ethereum","litecoin"];
var tData = [];
var xData = [];
var OffCount = 0;

sendmail();

/* Read Auto-Exchange Coins */
var fileContent = fs.readFileSync('ae.json', "utf8");//
    obj = JSON.parse(fileContent); //now it an object
    ae_cointype = obj.ae_cointype;
    console.log(ae_cointype);


/* Express Server */
app.get(webpath+"*", function(req, res){
    //console.log(req.path);
    if (Object.keys(req.query).length){
        if (req.query.hasOwnProperty('ae')){
            var ae_tmp = req.query['ae'].split(',');
            var valid = true;
            ae_tmp.forEach((coin)=>{
                if (!ae_lib.includes(coin)){
                    valid = false;
                }
            });
            if (valid){
                if (ae_cointype[0] != ae_tmp[0]){
                    tData = [];
                    xData = [];
                    io.emit('initdata',{tData:tData, xData,xData});
                }
                ae_cointype = ae_tmp;
                fs.writeFile('ae.json', JSON.stringify({ae_cointype: ae_cointype}), 'utf8',  function(err) {
                    if(err) {
                        return console.log(err);
                    }
                });
            }
            console.log(ae_cointype);
        }
    }
        
    var path = req.path.slice(webpath.length);
    if (path.indexOf('.') < 0) {
        path = "index.html";
    }
    res.sendFile(__dirname + "/public/" + path);
  });

server.listen(webport);

console.log("Listening on port " + webport +" in path "+webpath);

/* socket.io Server */
var minersocket;
io.on('connection', function (socket) {
    var id = socket.handshake.query.id;
    if (id === 'miner'){
      minersocket = socket;
      console.log('miner connected');
      socket.on('disconnect', function(){
        minersocket = undefined;
        OffCount = 0;
        console.log('miner disconnected');
      });
    } else {
      //console.log('a user connected');
    }
    socket.emit('connected',MAXLEN);

    socket.on('ready', function (timestamp) {
        socket.emit('initdata',{tData:tData, xData,xData});
    });
});


updateData = function(x){

    var t = new Date() - 0;
    tData.push(t);
    xData.push(x);

    if (tData.length > MAXLEN){
        tData.shift();
        xData.shift();
    }

    io.emit('newdata',{t:t,x:x,off:OffCount});

    if (!minersocket){
      OffCount ++;
      if (OffCount == WARNINGCOUNT){
        sendmail();
      } else if (OffCount == 5*WARNINGCOUNT){
        sendmail();
      }
    }
    //console.log(OffCount);

}

info.getTotalBalance(ae_cointype, updateData);
setInterval(function(){
  info.getTotalBalance(ae_cointype, updateData);
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
