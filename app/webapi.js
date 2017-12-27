const https = require('https');
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


var cointype = "litecoin.";
var action = "getdashboarddata"
/**
 * Make an HTTP Call - GET
 */
const options = {
      host : cointype + 'miningpoolhub.com', // here only the domain name
      // (no http/https !)
      port : 443,
      path : '/index.php?page=api&action='+ action + '&api_key='+apikey,
      method : 'GET' // do GET
};

module.exports = function(){
  var req = https.request(options, (res) => {
    //console.log('statusCode:', res.statusCode);
    //console.log('headers:', res.headers);

    var jsonStr = '';

    res.on('data', (d) => {
      jsonStr = jsonStr + d.toString('utf8');
      //console.log(jsonStr+'\n');
    });


    res.on('end', () => {
      var jsonObject = JSON.parse(jsonStr);
      console.log(jsonObject[action]["data"]["recent_credits_24hours"]["amount"]);
    });
  });

  req.on('error', (e) => {
    console.error(e);
  });

  req.end();

  console.log(coins["litecoin"]["code"]);
}
