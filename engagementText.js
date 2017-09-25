module.exports.engagementText = function (hits, currentEngagement, articleInfo, article, timeEngage) {
  var result = null;
  var clickThreshold = 5000;
  if (hits > clickThreshold && timeEngage > 2 && (currentEngagement === undefined || currentEngagement < clickThreshold)) {
    result = '@here :clock3: PV 5K+ and Time 2min+: ' + articleInfo;
    article.engagementHistory = clickThreshold;
  }
  // below threshold, nothing happened, skip this loop
  return result;
}
