var fetchUrl = require('./parselyClient').fetchUrl;
var fetchDataByUrl = require('./parselyClient').fetchDataByUrl;

function socialHits() {
  var type = '/analytics/posts';
  var content = '&page=1&limit=50&sort=social_referrals&period_start=24h';
  var url = fetchUrl(type, content);
  return fetchDataByUrl(url);
}

function socialShares(articleUrl) {
  var type = '/shares/post/detail';
  var content = '&url=' + encodeURIComponent(articleUrl);
  var url = fetchUrl(type, content);
  return fetchDataByUrl(url);
}

function socialReferrer(articleUrl) {
  var type = '/referrers/post/detail';
  var content = '&url=' + encodeURIComponent(articleUrl) + '&period_start=24h';
  var url = fetchUrl(type, content);
  return fetchDataByUrl(url);
}

module.exports = {
  socialHits: socialHits,
  socialShares: socialShares,
  socialReferrer: socialReferrer
};
