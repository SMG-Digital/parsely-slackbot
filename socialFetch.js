var fetch = require('node-fetch');

var apiKey = process.env.API_KEY;
var apiSecret = process.env.API_SECRET;

var baseUrl = 'https://api.parsely.com/v2';
function socialHits() {
  var url = baseUrl + '/analytics/posts?apikey=' + apiKey + '&secret=' + apiSecret + '&page=1&limit=50&sort=social_referrals&period_start=24h';
  return fetch(url)
  .then(function(res) {
    return res.json();
  }).then(function(json) {
    return json.data;
  });
}

function socialShares(articleUrl) {
  var url = baseUrl + '/shares/post/detail?apikey=' + apiKey + '&secret=' + apiSecret + '&url=' + encodeURIComponent(articleUrl);
  return fetch(url)
  .then(function(res) {
    return res.json();
  }).then(function(json) {
    return json.data;
  });
}

function socialReferrer(articleUrl) {
  var url = baseUrl + '/referrers/post/detail?apikey=' + apiKey + '&secret=' + apiSecret + '&url=' + encodeURIComponent(articleUrl) + '&period_start=24h';
  return fetch(url)
  .then(function(res) {
    return res.json();
  }).then(function(json) {
    return json.data;
  });
}


module.exports = {
  socialHits: socialHits,
  socialShares: socialShares,
  socialReferrer: socialReferrer
};
