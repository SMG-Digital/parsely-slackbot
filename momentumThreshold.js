var momentumShares = require('./momentumFetch').momentumShares;
var getSlackPost = require('./getSlackPost');
module.exports.momentumThreshold = function momentumThreshold(link, text, slack, thumb_url_medium, author, hits) {
  momentumShares(link).then(function(shares) {
    slack.webhook(getSlackPost(text, thumb_url_medium, author, hits, shares), function(err, response) {
      console.log(response);
    });
  });
}
