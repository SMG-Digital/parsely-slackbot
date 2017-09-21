var momentumShares = require('./momentumFetch').momentumShares;
module.exports.momentumThreshold = function momentumThreshold(link, text, slack, thumb_url_medium, author, hits) {
  momentumShares(link).then(function(shares) {
    slack.webhook({
      channel: '#parselybot',
      username: 'thestar bot',
      'attachments':[
        {
           'fallback':text,
           'pretext':text,
           'thumb_url': thumb_url_medium,
           'color':'#2ecc71',
           'fields':[
             {
               'title': 'Author: ' + author,
               'value': 'Hits: ' + (hits ? hits : 'N/A'),
               'short':'false',
             },
             {
               'title': 'shares',
               'value': 'Twitter: ' + (shares[0].tw ? shares[0].tw : 'N/A') + ', Facebook: ' + (shares[0].fb ? shares[0].fb : 'N/A'),
               'short': 'true'
             }
           ]
        }
     ]
    }, function(err, response) {
      console.log(response);
    });
  });
}
