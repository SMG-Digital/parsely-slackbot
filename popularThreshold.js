var popularShares = require('./popularFetch').popularShares;
var getSlackPost = require('./getSlackPost');
module.exports.popularThreshold = function popularThreshold(link, text, slack, thumb_url_medium, author, hits) {
  popularShares(link).then(function(shares) {
    slack.webhook(getSlackPost(text, thumb_url_medium, author, hits, shares), function(err, response) {
      console.log(response);
    });
  });
}
