module.exports.popularText = function (hits, current, articleInfo, article) {
  var result = null;
  var thresholdLv1 = 50000;
  var thresholdLv2 = 100000;
  var thresholdLv3 = 150000;
  if (hits > thresholdLv3 && (current === undefined || current < thresholdLv3)) {
    //threshold above 150000
    result = '@here :fire: :fire: :fire: 150KPV: ' + articleInfo;
    article.popularHistory = thresholdLv3;
  } else if (hits > thresholdLv2 && (current === undefined || current < thresholdLv2)) {
    //threshold above 100000
    result = '@here :fire: :fire: 100KPV: ' + articleInfo;
    article.popularHistory = thresholdLv2;
  } else if (hits > thresholdLv1 && (current === undefined || current < thresholdLv1)) {
    //threshold above 50000
    result = '@here :fire: 50KPV: ' + articleInfo;
    article.popularHistory = thresholdLv1;
  }
  return result;
}
