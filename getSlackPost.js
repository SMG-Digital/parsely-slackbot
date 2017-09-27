function getSlackPost(text, thumb_url_medium, author, hits, shares){
  return (
    {
      channel: '#parsely_alert',
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
    }
  )
}

module.exports = getSlackPost;
