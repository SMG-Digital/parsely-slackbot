var socialShares = require('./socialFetch').socialShares;
var getSlackPost = require('./getSlackPost');
module.exports.socialThreshold = function socialThreshold(link, text, slack, thumb_url_medium, author, hits) {
  socialShares(link).then(function(shares) {
    slack.webhook(getSlackPost(text, thumb_url_medium, author, hits, shares), function(err, response) {
      console.log(response);
    });
  });
}
