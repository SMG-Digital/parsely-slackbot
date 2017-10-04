module.exports.socialText = function (socialHits, referrerPercentage, currentReferrer, articleInfo, article) {
    var result = null;
    if (referrerPercentage > 0.2 && socialHits > 1000 && (currentReferrer === undefined || currentReferrer < 0.2)) {
      result = '@here :pushpin: Social is 20%+ referral traffic and 1KPV+ from social: ' + articleInfo;
      article.referrerHistory = 0.2;
    }
    // below threshold, nothing happened, skip this loop
    return result;
}
