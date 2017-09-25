var fetchUrl = require('./parselyClient').fetchUrl;
var fetchDataByUrl = require('./parselyClient').fetchDataByUrl;

function momentumHits() {
  var type = '/analytics/posts';
  var content = '&page=1&limit=50&sort=views&period_start=10mins';
  var url = fetchUrl(type, content);
  return fetchDataByUrl(url);
}

function momentumShares(articleUrl) {
  var type = '/shares/post/detail';
  var content = '&url=' + encodeURIComponent(articleUrl);
  var url = fetchUrl(type, content);
  return fetchDataByUrl(url);
}

module.exports = {
  momentumHits: momentumHits,
  momentumShares: momentumShares
};
