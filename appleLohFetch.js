var fetch = require('node-fetch');

var apiKey = process.env.API_KEY;
var apiSecret = process.env.API_SECRET;

var baseUrl = 'https://api.parsely.com/v2';



function checkArticle(items) {
  if(items['source'] === 'thestar.com' && items['market'] === 'toronto') {
    return items;
  }
}


function appleLohData() {
  var url = 'https://loh-dashboard.s3.us-east-2.amazonaws.com/data.json';
  return fetch(url)
  .then(function(res) {
    return res.json();
  }).then(function(json) {
    return json;
  }).then(function(items) {
    var filteredArticle = items.items.filter(checkArticle);
    return filteredArticle;
  }).catch(function(err){
    console.log("error from appleLohData: ", err);
    done(err);
  });
}

function appleLohDetailedInfo(articleUrl) {
  var url = baseUrl + '/analytics/post/detail?apikey=' + apiKey + '&secret=' + apiSecret + '&url=' + encodeURIComponent(articleUrl);
  return fetch(url)
  .then(function(res) {
    return res.json();
  }).then(function(json) {
    return json.data;
  });
}

function appleLohShares(articleUrl) {
  var url = baseUrl + '/shares/post/detail?apikey=' + apiKey + '&secret=' + apiSecret + '&url=' + encodeURIComponent(articleUrl);
  return fetch(url)
  .then(function(res) {
    return res.json();
  }).then(function(json) {
    return json.data;
  });
}


module.exports = {
  appleLohData: appleLohData,
  appleLohDetailedInfo: appleLohDetailedInfo,
  appleLohShares: appleLohShares

};
