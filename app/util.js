const fs = require("fs");

var fileContent = fs.readFileSync('credits.json', "utf8");//
obj = JSON.parse(fileContent); //now it an object
credits = obj.credits;

for (i=0; i< credits.length; i++){

    if (credits[i].hasOwnProperty('miningpoolhub')){
        delete credits[i]['miningpoolhub'];
    }
    
}

console.log(credits);
fs.writeFile('credits.json', JSON.stringify({ credits: credits }), 'utf8', function (err) {
    if (err) {
      return console.log(err);
    }
  });