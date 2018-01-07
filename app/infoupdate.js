var webapi = require( './webapi' );
var coinprice = require('./coinprice');

const apikey = '902ab3ea71ce808b0bdc31a1c7b8abffc37942e767e3be2584a6bd5b04d74a06';

var MPHhost = 'miningpoolhub.com'; // here only the domain name
var MPHpath = function(action){
    return ('/index.php?page=api&action='+ action + '&api_key='+apikey);
}


var getTotalBalance = function(ae_cointype, callback){
  var action = 'getuserallbalances';
  webapi(MPHhost, MPHpath(action), (res, err)=>{
    if (err){
      callback({}, true);
    }
    var Bal = res[action]['data'];
    var convType = [];
    for (i=0; i<Bal.length; i++){
      convType[i] = Bal[i]['coin'];
      if (convType[i] === 'digibyte-skein'){
        convType[i] = 'digibyte';
      }
    }
    coinprice(convType, (conv)=>{
      //console.log(conv);
      var ae_price = conv[ae_cointype[0]]['price'];
      var total = 0;
      for (i=0; i<Bal.length; i++){
        //console.log(Bal[i]['confirmed'] + Bal[i]['unconfirmed'] + Bal[i]['ae_confirmed'] + Bal[i]['ae_unconfirmed']);
        //console.log(convType[i]);
        if(!conv[convType[i]]) continue;
        if (convType[i]==ae_cointype[0] | !ae_cointype.includes(convType[i])){
          total += (Bal[i]['confirmed'] + Bal[i]['unconfirmed'] + Bal[i]['ae_confirmed'] + Bal[i]['ae_unconfirmed'])  
                  *(conv[convType[i]]['price']/ae_price);
        }
      }
      //console.log(total);
      callback(total, false);
    });
  });
}

module.exports = {
  getTotalBalance: getTotalBalance
}
