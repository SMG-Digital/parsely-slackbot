var fetch = require('node-fetch');
var config = require('./slackbotConfig');

var apiKey = config.apiKey;
var apiSecret = config.apiSecret;

var baseUrl = 'https://api.parsely.com/v2';
function articleHits() {
  var url = baseUrl + '/analytics/posts?apikey=' + apiKey + '&secret=' + apiSecret + '&page=1&limit=50&sort=views&period_start=24h';
  return fetch(url)
  .then(function(res) {
    return res.json();
  }).then(function(json) {
    return json.data;
  });
}

function articleShares(articleUrl) {
  var url = baseUrl + '/shares/post/detail?apikey=' + apiKey + '&secret=' + apiSecret + '&url=' + encodeURIComponent(articleUrl);
  return fetch(url)
  .then(function(res) {
    return res.json();
  }).then(function(json) {
    return json.data;
  });
}

module.exports = {
  articleHits: articleHits,
  articleShares: articleShares
};
