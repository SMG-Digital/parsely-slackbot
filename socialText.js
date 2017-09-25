module.exports.socialText = function (referrerPercentage, currentReferrer, articleInfo, article) {
    var result = null;
    if (referrerPercentage > 0.2 && (currentReferrer === undefined || currentReferrer < 0.2)) {
      result = '@here :pushpin: Social is 20%+ referral traffic: ' + articleInfo;
      article.referrerHistory = 0.2;
    }
    // below threshold, nothing happened, skip this loop
    return result;
}
