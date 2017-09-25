module.exports.momentumText = function (hits, currentMomentum, articleInfo, article) {
  var result = null;
  var clickThreshold = 1000;
  if (hits > clickThreshold && (currentMomentum === undefined || currentMomentum < clickThreshold)) {
    result = '@here :exclamation: 1KPV in last 10 min: ' + articleInfo;
    article.momentumHistory = clickThreshold;
  }
  return result;
}
