const https = require('https');
const apikey = '902ab3ea71ce808b0bdc31a1c7b8abffc37942e767e3be2584a6bd5b04d74a06';



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
}
