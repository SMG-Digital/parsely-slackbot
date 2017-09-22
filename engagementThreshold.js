var engagementShares = require('./engagementFetch').engagementShares;
var getSlackPost = require('./getSlackPost');
module.exports.engagementThreshold = function engagementThreshold(link, text, slack, thumb_url_medium, author, hits) {
  engagementShares(link).then(function(shares) {
    slack.webhook(getSlackPost(text, thumb_url_medium, author, hits, shares), function(err, response) {
      console.log(response);
    });
  });
}
