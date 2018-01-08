
const fs = require("fs");

const apikey = '902ab3ea71ce808b0bdc31a1c7b8abffc37942e767e3be2584a6bd5b04d74a06';

var MPHhost = 'miningpoolhub.com'; // here only the domain name
var MPHpath = function(action){
    return ('/index.php?page=api&action='+ action + '&api_key='+apikey);
}


var fileContent = fs.readFileSync('credits.json', "utf8");//
obj = JSON.parse(fileContent); //now it an object
credits = obj.credits;

const ae_lib = ["ethereum","litecoin","vertcoin"];
action = 'getdashboarddata';

var getTotalBalance = function(ae_lib, callback){
  for (i=0; i<ae_lib.length; i++){
    webapi(aelib[i]+'.'+MPHhost, MPHpath(action), (res, err)=>{
      if (err){
        callback({}, true);
      }
    }
  }
}


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
