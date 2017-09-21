var fetch = require('node-fetch');

var apiKey = process.env.API_KEY;
var apiSecret = process.env.API_SECRET;

var baseUrl = 'https://api.parsely.com/v2';
function momentumHits() {
  var url = baseUrl + '/analytics/posts?apikey=' + apiKey + '&secret=' + apiSecret + '&page=1&limit=50&sort=views&period_start=10mins';
  return fetch(url)
  .then(function(res) {
    return res.json();
  }).then(function(json) {
    return json.data;
  });
}

function momentumShares(articleUrl) {
  var url = baseUrl + '/shares/post/detail?apikey=' + apiKey + '&secret=' + apiSecret + '&url=' + encodeURIComponent(articleUrl);
  return fetch(url)
  .then(function(res) {
    return res.json();
  }).then(function(json) {
    return json.data;
  });
}

module.exports = {
  momentumHits: momentumHits,
  momentumShares: momentumShares
};
