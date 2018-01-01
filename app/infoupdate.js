var webapi = require( './webapi' );
var coinprice = require('./coinprice');

const apikey = '902ab3ea71ce808b0bdc31a1c7b8abffc37942e767e3be2584a6bd5b04d74a06';

const coins = {'bitcoin' :{'code':'BTC', 'min_payout' : 0.002},
			'electroneum' : {'code' : 'ETN', 'min_payout' : 0.05},
			'ethereum' : {'code' : 'ETH', 'min_payout' : 0.01},
			'monero' : {'code' : 'XMR', 'min_payout' : 0.05},
			'zcash' : {'code' : 'ZEC', 'min_payout' : 0.002},
			'vertcoin' : {'code' : 'VTC', 'min_payout' : 0.1},
			'feathercoin' : {'code' : 'FTC', 'min_payout' : 0.002},
			'digibyte-skein' : {'code' : 'DGB', 'min_payout' : 0.01},
			'musicoin' : {'code' : 'MUSIC', 'min_payout' : 0.002},
			'ethereum-classic' : {'code' : 'ETC', 'min_payout' : 0002},
			'siacoin' : {'code' : 'SC', 'min_payout' : 0.002},
			'zcoin' : {'code' : 'XZC', 'min_payout' : 0.002},
			'bitcoin-gold' : {'code' : 'BTG', 'min_payout' : 0.002},
			'bitcoin-cash' : {'code' : 'BCH', 'min_payout' : 0.0005},
			'zencash' : {'code' : 'ZEN', 'min_payout' : 0.002},
			'litecoin' : {'code' : 'LTC', 'min_payout' : 0.002},
			'monacoin' : {'code' : 'MONA', 'min_payout' : 0.1},
			'groestlcoin' : {'code' : 'GRS', 'min_payout' : 0.002},
			'dash' : {'code' : 'DASH', 'min_payout' : 0.1},
			'gamecredits' : {'code' : 'GAME', 'min_payout' : 1.0},
			'verge-scrypt' : {'code' : 'XVG', 'min_payout' : 0.15},
			'zclassic' : {'code' : 'ZCL', 'min_payout' : 0.001}};


var ae_cointype = "litecoin";
//var action = "getdashboarddata";

var MPHhost = 'miningpoolhub.com'; // here only the domain name
var MPHpath = function(action){
    return ('/index.php?page=api&action='+ action + '&api_key='+apikey);
}


var getTotalBalance = function(callback){
  var action = 'getuserallbalances';
  webapi(MPHhost, MPHpath(action), (res)=>{
    var Bal = res[action]['data'];
    var convType = [];
    for (i=0; i<Bal.length; i++){
      convType[i] = Bal[i]['coin'];
    }
    coinprice(convType, (conv)=>{
      console.log(conv);
      var ae_price = conv[ae_cointype]['price'];
      var total = 0;
      for (i=0; i<Bal.length; i++){
        //console.log(Bal[i]['confirmed'] + Bal[i]['unconfirmed'] + Bal[i]['ae_confirmed'] + Bal[i]['ae_unconfirmed']);
        //console.log(convType[i]);
        //console.log(conv[convType[i]]);
        total += (Bal[i]['confirmed'] + Bal[i]['unconfirmed'] + Bal[i]['ae_confirmed'] + Bal[i]['ae_unconfirmed'])  
                *(conv[convType[i]]['price']/ae_price);
      }
      //console.log(total);
      callback(total);
    });
  });
}

module.exports = {
  getTotalBalance: getTotalBalance
}
