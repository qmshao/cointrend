var cheerio = require('cheerio');
var request = require('request');


var target = 'http://coinmarketcap.com/coins/';

//var coinList = ['litecoin','bitcoin'];

getCoinPrice = function(coinList,callback) {
    var coinData = {};
    request(target, function (err, resp, body) {
        if (!err && resp.statusCode == 200) {
            var $ = cheerio.load(body);
            var currentTime = Date.now();
            //console.log($('#id-zencash').text());
            $('tr').each(function (i) {
                if ($(this).attr("id")) {
                    var coinName = $(this).attr("id").slice(3);
                    if (coinList.includes(coinName)) {
                        var pos = $(this).find('td').eq(0).text().trim();

                        var marketCap = $(this).find('td').eq(2).text().trim();
                        //console.log(marketCap);
                        marketCap = marketCap.slice(1).replace(/,/g, "");

                        var price = $(this).find('td').eq(3).text().trim();
                        //console.log(price);
                        price = price.slice(1).replace(/,/g, "");
                        coinData[coinName] = {
                            position: parseInt(pos),
                            price: parseFloat(price),
                        }
                    }
                }




            });
            
            //console.log(coinList);
            //console.log(coinData);
            callback(coinData);
        }
    });
}

module.exports = getCoinPrice;