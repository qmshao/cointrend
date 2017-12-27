const https = require('https');
const apikey = '902ab3ea71ce808b0bdc31a1c7b8abffc37942e767e3be2584a6bd5b04d74a06';
/**
 * Make an HTTP Call - GET
 */
const options = {
      host : 'miningpoolhub.com', // here only the domain name
      // (no http/https !)
      port : 443,
      path : '/index.php?page=api&action=getuserallbalances&api_key='+apikey, 
      method : 'GET' // do GET
};

var req = https.request(options, (res) => {
  //console.log('statusCode:', res.statusCode);
  //console.log('headers:', res.headers);

  res.on('data', (d) => {
    //process.stdout.write(d);
    var jsonObject = JSON.parse(d.toString('utf8'));
    console.log(jsonObject["getuserallbalances"]["data"][0]);
  });
});

req.on('error', (e) => {
  console.error(e);
});
req.end();

module.exports = function(){
  console.info('hello world');
}
