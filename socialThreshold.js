var socialShares = require('./socialFetch').socialShares;
module.exports.socialThreshold = function socialThreshold(link, text, slack, thumb_url_medium, author, hits) {
  socialShares(link).then(function(shares) {
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
