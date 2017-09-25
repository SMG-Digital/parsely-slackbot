module.exports.appleLohText = function (hits, currentAppleLoh, articleInfo, article) {
  var result = null;
  if (currentAppleLoh === undefined) {
    console.log("articleInfo =====", articleInfo);
    result = '@here :calling: Apple LOH: ' + articleInfo;
    article.appleLohHistory = 1;
  }
  return result;
}
