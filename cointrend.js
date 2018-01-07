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
const UPDATETIME = 300;
const WARNINGTIME = 180; 

const MAXLEN = 7*24*3600/UPDATETIME;
const MAXWARNINGCOUNT =  WARNINGTIME/DT;
const MAXUPDATECOUNT = UPDATETIME/DT;

const ae_lib = ["ethereum","litecoin","vertcoin"];
var ae_cointype; // = ["ethereum","litecoin"];
var tData = [];
var xData = [];
var WarningCount = 0;
var UpdateCount = 0;

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
var miners = [];
io.on('connection', function (socket) {
    var id = socket.handshake.query.id;
    if (id === 'miner'){
      miners.push(socket);
      console.log('miner connected');
      OffCount = 0;
      socket.on('disconnect', function(){
        miners = miners.filter(e => e !== socket);
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

var RETRY = 0;
updateData = function(x, err){

    if (err){
        RETRY++;
        if (RETRY<=3){
            info.getTotalBalance(ae_cointype, updateData);
        }
    } else {
        RETRY = 0;
    }

    if (miners.length==0){
        WarningCount ++;
        if (WarningCount == MAXWARNINGCOUNT){
          sendmail();
        } else if (WarningCount == 5*MAXWARNINGCOUNT){
          sendmail();
        }
      } else {
        WarningCount = 0;
      }

    if (UpdateCount++ == 0) {
        var t = new Date() - 0;
        tData.push(t);
        xData.push(x);

        if (tData.length > MAXLEN) {
            tData.shift();
            xData.shift();
        }

        io.emit('newdata',{t:t,x:x,off:WarningCount});
    }

    if (UpdateCount == MAXUPDATECOUNT){
        UpdateCount = 0;
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
