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
  var para = host + path;
  // console.log(options);
  var req = https.request(options, (res) => {
    
    var jsonStr = '';

    res.on('data', (d) => {
      jsonStr = jsonStr + d.toString('utf8');
    });


    res.on('end', () => {
      var jsonObject = JSON.parse(jsonStr)
      callback(jsonObject, false, para);
    });
  });

  req.on('error', (e) => {
    callback({}, true, para);
    console.error(e);
  });

  req.end();

}

module.exports = callWebAPI;
