const fs = require("fs");
var webapi = require( './webapi' );

fileContent = fs.readFileSync('./data/apikey.json', "utf8");//
const apikey = JSON.parse(fileContent).apikey;

var MPHhost = 'miningpoolhub.com'; // here only the domain name
var MPHpath = function(action){
    return ('/index.php?page=api&action='+ action + '&api_key='+apikey);
}


fileContent = fs.readFileSync('./data/credits.json', "utf8");//
obj = JSON.parse(fileContent); //now it an object
credits = obj.credits;
// console.log(credits);

// const ae_lib = ["ethereum","litecoin","vertcoin"];
action = 'getdashboarddata';

var updatecredits = function(ae_lib, UPDATEFILE, callback){
  var change = false;
  var count = 0;
  var payout24 = {};
  var balance = {};
  for (i=0; i<ae_lib.length; i++){
    webapi(ae_lib[i]+'.'+MPHhost, MPHpath(action), (res, err, para)=>{
      // console.log(para);
      if (err){
        console.log('kua le');
        callback({},{},{},true);
      } else {
        var coin = para.split('.')[0];

        if (UPDATEFILE) {
          var hist = res[action]['data']['recent_credits'];
          var idx0 = ((new Date(hist[hist.length - 1].date)) - new Date(credits[0].date)) / 3600 / 24 / 1000;
          for (i = hist.length - 1; i > 0; i--) {
            idx = idx0 + hist.length - 1 - i;
            if (!credits[idx]) {
              credits[idx] = { date: hist[i].date };
              change = true;
            }
            if (credits[idx][coin] != hist[i].amount) {
              credits[idx][coin] = hist[i].amount;
              change = true;
            }
          }
        } 
        // console.log(res[action]['data']);
        payout24[coin] = res[action]['data']['recent_credits_24hours']['amount'];
        balance[coin] = res[action]['data']['balance']['confirmed'] + res[action]['data']['balance']['unconfirmed'] +
                        res[action]['data']['balance_for_auto_exchange']['confirmed'] + res[action]['data']['balance_for_auto_exchange']['unconfirmed'];
        
        
        count ++;
        if (count == 3) {
          credits['change'] = change;
          callback(credits, balance, payout24,false);
          if (change && UPDATEFILE) {
            fs.writeFile('./data/credits.json', JSON.stringify({ credits: credits }), 'utf8', function (err) {
              if (err) {
                return console.log(err);
              }
            });
          }
        }
      }
    });
  }
}

module.exports = updatecredits;
//updatecredits(ae_lib, (res)=>{console.log(res)});


// credits = credits.sort((a,b)=>{
//     return (new Date(a.date) - new Date(b.date));
//   }).filter((item, pos, ary) => {
//     return !pos || item.date != ary[pos - 1].date;
//   });
//
// var credits_new = [];
// for (i=0; i<credits.length; i++){
//   credits_new[i] = {date:credits[i].date, litecoin:credits[i].amount,ethereum:0,vertcoin:0};
// }
//
// console.log(credits_new);
// fs.writeFile('credits.json', JSON.stringify({credits: credits_new}), 'utf8',  function(err) {
//     if(err) {
//         return console.log(err);
//     }
// });
