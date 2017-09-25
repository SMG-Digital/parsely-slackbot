var fetch = require('node-fetch');
var fetchUrl = require('./parselyClient').fetchUrl;
var fetchDataByUrl = require('./parselyClient').fetchDataByUrl;

function checkArticle(item) {
  if(item['source'] === 'thestar.com' && item['market'] === 'toronto') {
    return item;
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
    return items.items.filter(checkArticle);
  }).catch(function(err){
    console.log("error from appleLohData: ", err);
    done(err);
  });
}

function appleLohDetailedInfo(articleUrl) {
  var type = '/analytics/posts';
  var content = '&url=' + encodeURIComponent(articleUrl);
  var url = fetchUrl(type, content);
  return fetchDataByUrl(url);
}

function appleLohShares(articleUrl) {
  var type = '/shares/post/detail';
  var content = '&url=' + encodeURIComponent(articleUrl);
  var url = fetchUrl(type, content);
  return fetchDataByUrl(url);
}


module.exports = {
  appleLohData: appleLohData,
  appleLohDetailedInfo: appleLohDetailedInfo,
  appleLohShares: appleLohShares

};
