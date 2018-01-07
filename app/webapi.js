const https = require('https');

/**
 * Make an HTTP Call - GET
 */

var options = {
  host : '',
  // (no http/https !)
  port : 443,
  path : '',
  method : 'GET' // do GET
};

callWebAPI = function(host, path, callback){
  options['host'] = host;
  options['path'] = path;
  //console.log(options);
  var req = https.request(options, (res) => {
    
    var jsonStr = '';

    res.on('data', (d) => {
      jsonStr = jsonStr + d.toString('utf8');
    });


    res.on('end', () => {
      var jsonObject = JSON.parse(jsonStr)
      callback(jsonObject, false);
    });
  });

  req.on('error', (e) => {
    callback({}, true);
    console.error(e);
  });

  req.end();

}

module.exports = callWebAPI;
