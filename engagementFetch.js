var fetchUrl = require('./parselyClient').fetchUrl;
var fetchDataByUrl = require('./parselyClient').fetchDataByUrl;

function engagementHits() {
  var type = '/analytics/posts';
  var content = '&page=1&limit=50&sort=avg_engaged&&pub_date_start=24h';
  var url = fetchUrl(type, content);
  return fetchDataByUrl(url);
}

function engagementShares(articleUrl) {
  var type = '/shares/post/detail';
  var content = '&url=' + encodeURIComponent(articleUrl);
  var url = fetchUrl(type, content);
  return fetchDataByUrl(url);
}

module.exports = {
  engagementHits: engagementHits,
  engagementShares: engagementShares
};
