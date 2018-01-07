var webapi = require( './webapi' );
var coinprice = require('./coinprice');

const apikey = '902ab3ea71ce808b0bdc31a1c7b8abffc37942e767e3be2584a6bd5b04d74a06';

var MPHhost = 'miningpoolhub.com'; // here only the domain name
var MPHpath = function(action){
    return ('/index.php?page=api&action='+ action + '&api_key='+apikey);
}

ae_cointype = 'ethereum'
//var getTotalBalance = function(ae_cointype, callback){
  var action = 'getdashboarddata';
  webapi((ae_cointype?ae_cointype+'.':'')+MPHhost, MPHpath(action, ae_cointype), (res)=>{
      console.log(res[action]['data']['recent_credits_24hours']);

  });
//}

// module.exports = {
//   getTotalBalance: getTotalBalance
// }
