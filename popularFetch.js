var fetchUrl = require('./parselyClient').fetchUrl;
var fetchDataByUrl = require('./parselyClient').fetchDataByUrl;

function popularHits() {
  var type = '/analytics/posts';
  var content = '&page=1&limit=50&sort=views&period_start=24h';
  var url = fetchUrl(type, content);
  return fetchDataByUrl(url);
}

function popularShares(articleUrl) {
  var type = '/shares/post/detail';
  var content = '&url=' + encodeURIComponent(articleUrl);
  var url = fetchUrl(type, content);
  return fetchDataByUrl(url);
}

module.exports = {
  popularHits: popularHits,
  popularShares: popularShares
};
