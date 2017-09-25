var fetch = require('node-fetch');

var apiKey = process.env.API_KEY;
var apiSecret = process.env.API_SECRET;
var baseUrl = 'https://api.parsely.com/v2';

function fetchUrl(type, content) {
  var url = baseUrl + type + '?apikey=' + apiKey + '&secret=' + apiSecret + content;
  return url;
}

function fetchDataByUrl(url) {
  return fetch(url)
  .then(function(res) {
    return res.json();
  }).then(function(json) {
    return json.data;
  });
}

module.exports = {
  fetchUrl: fetchUrl,
  fetchDataByUrl: fetchDataByUrl
}
