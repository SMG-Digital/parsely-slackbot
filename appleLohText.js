module.exports.appleLohText = function (hits, currentAppleLoh, articleInfo, article) {
  var result = null;
  //check if time is < 24h
  //convert epoch to human readable date
  if (currentAppleLoh === undefined) {
    result = '@here :calling: Apple LOH: ' + articleInfo;
    article.appleLohHistory = 1;
  }
  return result;
}
