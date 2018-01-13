const express = require("express");
const fs = require("fs");
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server, {path: '/trendio'});

// const info = require( './app/infoupdate' );
const sendmail = require('./app/sendmail');
const updatecredits = require('./app/updatecredits');

const webport = 3701;
const webpath = '/trend/';
const DT = 60; //sec
const UPDATETIME = 60;//300;
const WARNINGTIME = 120; 
const MAXDAY = 7;
const MAXLEN = MAXDAY*24*3600/UPDATETIME;
const MAXWARNINGCOUNT =  WARNINGTIME/DT;
const MAXUPDATECOUNT = UPDATETIME/DT;

const ae_lib = ["ethereum","litecoin","vertcoin"];
var ae_cointype; // = ["ethereum","litecoin"];
var rtdata;
var tData = [];
var xData = [];
var WarningCount = 0;
var UpdateCount = 0;
var credits;

/* Read Auto-Exchange Coin and history data*/
var aefile = fs.readFileSync('./data/ae.json', "utf8");//
obj = JSON.parse(aefile); 
ae_cointype = obj.ae_cointype;
console.log(ae_cointype);

var datafile;
if(fs.existsSync('./data/data.json')){
    datafile = fs.readFileSync('./data/data.json', "utf8");
}
if (!datafile){
    rtdata = {t:[],balance:{},payout24:{}};
} else {
    rtdata = JSON.parse(datafile); 
}

/* Clean Data */
function cleanData() {
    if (!rtdata.t) return false;
    var change = false;
    for (coin in rtdata.balance) {
        if (!ae_cointype.includes(coin)) {
            delete rtdata.balance[coin];
            delete rtdata.payout24[coin];
            change = true;
        }
    }

    for (i=0; i<ae_cointype.length; i++){
        if (!rtdata.balance.hasOwnProperty(ae_cointype[i])){
            rtdata.balance[ae_cointype[i]] = Array(rtdata.t.length).fill(0);
            rtdata.payout24[ae_cointype[i]] = Array(rtdata.t.length).fill(0);
            change = true;
        }
    }
    return change;
}
cleanData();


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
                // if (ae_cointype[0] != ae_tmp[0]){
                //     tData = [];
                //     xData = [];
                //     io.emit('initdata',{tData:tData, xData,xData});
                // }
                ae_cointype = ae_tmp;
                if (cleanData()) {
                    io.emit('initdata', rtdata);
                    console.log('ae changed');
                    fs.writeFile('./data/ae.json', JSON.stringify({ ae_cointype: ae_cointype }), 'utf8', function (err) {
                        if (err) {
                            return console.log(err);
                        }
                    });
                }
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
    socket.emit('connected',MAXDAY);

    socket.on('ready', function (timestamp) {
        socket.emit('initdata',rtdata);
        socket.emit('credits',credits);
        socket.emit('status', miners.length>0);
    });
});

/* Check Miner Status */
function checkMiner() {
    if (miners.length + WarningCount == 0){
        io.emit('status', false);
    }
    if (miners.length * WarningCount > 0){
        io.emit('status', true);
    }

    if (miners.length == 0) {
        WarningCount++;
        if (WarningCount == MAXWARNINGCOUNT) {
            sendmail();
        } else if (WarningCount == 5 * MAXWARNINGCOUNT) {
            sendmail();
        }
    } else {
        WarningCount = 0;
    }
}


/* Update Balance Data */
var RETRY = 0;
updateData = function (cr, balance, payout24, err) {
    if (err) {
        RETRY++;
        if (RETRY <= 3) {
            updatecredits(ae_lib, false, updateData);
        }
        return;
    }
    RETRY = 0;

    if (!credits || credits.change){
        credits = cr;
        io.emit('credits',credits);
    }
    // console.log(balance);
    // console.log(payout24);
    var t = new Date() - 0;
    var newdata = { t: t };
    newdata.balance = {};
    newdata.payout24 = {};

    rtdata.t.push(t);
    var LEN = rtdata.t.length;

    for (i = 0; i < ae_cointype.length; i++) {
        var coin = ae_cointype[i];
        if (!rtdata.balance[coin]) {
            rtdata.balance[coin] = Array(rtdata.t.length - 1).fill(0);
        }
        if (!rtdata.payout24[coin]) {
            rtdata.payout24[coin] = Array(rtdata.t.length - 1).fill(0);
        }
        if (!balance[coin]) balance[coin] = 0;
        if (!payout24[coin]) payout24[coin] = 0;
        rtdata.balance[coin].push(balance[coin]);
        rtdata.payout24[coin].push(payout24[coin]);
        newdata.balance[coin] = balance[coin];
        newdata.payout24[coin] = payout24[coin];
    }

    while ((t - rtdata.t[0]) / 1000 / 24 / 3600 > MAXDAY) {
        rtdata.t.shift();
        for (i = 0; i < ae_cointype.length; i++) {
            var coin = ae_cointype[i];
            rtdata.balance[coin].shift();
            rtdata.payout[coin].shift();
        }
    }
    // console.log(newdata);
    io.emit('newdata', newdata);

}

/* First call */
updatecredits(ae_lib, true, updateData);


setInterval(function () {
    // Check Miner
    checkMiner();
    // Update Data
    var now = new Date();
    var UPDATECR = false;
    if (now.getUTCHours() % 6 == 1 && now.getUTCMinutes() == 0) {
        UPDATECR = true;
    }

    if (UpdateCount++ == 0) {
        updatecredits(ae_lib, UPDATECR, updateData);
    }

    if (UpdateCount == MAXUPDATECOUNT) {
        UpdateCount = 0;
    }
    // Write Credits
    if (true) {
        fs.writeFile('./data/data.json', JSON.stringify(rtdata), 'utf8', function (err) {
            if (err) {
                return console.log(err);
            }
        });
    }
}, DT * 1000);

