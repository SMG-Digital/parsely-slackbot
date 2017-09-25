var appleLohShares = require('./appleLohFetch').appleLohShares;
var getSlackPost = require('./getSlackPost');
module.exports.appleLohThreshold = function appleLohThreshold(link, text, slack, thumb_url_medium, author, hits) {
  appleLohShares(link).then(function(shares) {
    slack.webhook(getSlackPost(text, thumb_url_medium, author, hits, shares), function(err, response) {
      console.log(response);
    });
  });
}
