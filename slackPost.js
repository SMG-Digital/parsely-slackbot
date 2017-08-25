'use strict';
var config = require('./slackbotConfig');
var Slack = require('slack-node');
var articleHits = require('./parselyFetch').articleHits;
var articleShares = require('./parselyFetch').articleShares;

function postData(history) {
  // set up slack incoming webhook
  var webhookUri = config.webhookUri;
  var slack = new Slack();
  slack.setWebhook(webhookUri);

  // get article hits
  articleHits().then(function(data){
    for (var i = 0; i < data.length; i++) {
      let text = '';
      var aboveThreshold = false;
      var apiKey = config.apiKey;
      var articleLink = 'http://dash.parsely.com/' + apiKey + '/find?url=' + data[i].link;
      var articleInfo = '<' + articleLink + '|' + data[i].title + '>' ;
      var current = history[data[i].link];

      // check if above threshold, set the aboveThreshold to true, change text content
      if (data[i]._hits > 150000 && (current === undefined || current < 150000)) {
        //threshold above 150000
        text = '@here :fire: :fire: :fire: 150KPV: ' + articleInfo;
        aboveThreshold = true;
        history[data[i].link] = 150000;
      } else if (data[i]._hits > 100000 && (current === undefined || current < 100000)) {
        //threshold above 100000
        text = '@here :fire: :fire: 100KPV: ' + articleInfo;
        aboveThreshold = true;
        history[data[i].link] = 100000;
      } else if (data[i]._hits > 50000 && (current === undefined || current < 50000)) {
        //threshold above 50000
        text = '@here :fire: 50KPV: ' + articleInfo;
        aboveThreshold = true;
        history[data[i].link] = 50000;
      } else {
        // below threshold, nothing happened, skip this loop
        continue;
      }


      // if above any threshold, send to slack
      if (aboveThreshold) {
        let article = data[i];
        articleShares(article.link).then(function(shares) {
          slack.webhook({
            channel: '#parselybot',
            username: 'thestar bot',
            'attachments':[
              {
                 'fallback':text,
                 'pretext':text,
                 'thumb_url': article.thumb_url_medium,
                 'color':'#2ecc71',
                 'fields':[
                   {
                     'title': 'Author: ' + article.author,
                     'value': 'Hits: ' + article._hits,
                     'short':'false',
                   },
                   {
                     'title': 'shares',
                     'value': 'Twitter: ' + shares[0].tw + ', Facebook: ' + shares[0].fb,
                     'short': 'true'
                   }
                 ]
              }
           ]
          }, function(err, response) {
            console.log(response);
          }); // end of webhook function
        }); // end of articleShares function
      }

    } // end of for loop
  }); // end of articleHits function
} // end of postData

module.exports = postData;
