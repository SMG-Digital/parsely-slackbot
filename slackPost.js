'use strict';
require('dotenv').config();
var Slack = require('slack-node');
var mongoose = require('mongoose');
var articleHits = require('./parselyFetch').articleHits;
var articleShares = require('./parselyFetch').articleShares;
var Article = require('./articleSchema.js');

function getThresholdText(click, current, articleInfo, article) {
  var result = null;
  // check if above threshold, set the aboveThreshold to true, change text content
  if (click > 150000 && (current === undefined || current < 150000)) {
    //threshold above 150000
    result = '@here :fire: :fire: :fire: 150KPVVVVVVV: ' + articleInfo;
    article.history = 150000;
  } else if (click > 100000 && (current === undefined || current < 100000)) {
    //threshold above 100000
    result = '@here :fire: :fire: 100KPV: ' + articleInfo;
    article.history = 100000;
  } else if (click > 50000 && (current === undefined || current < 50000)) {
    //threshold above 50000
    result = '@here :fire: 50KPV: ' + articleInfo;
    article.history = 50000;
  }

  // below threshold, nothing happened, skip this loop
  return result;
} //end of checkThreshold function

function notifyAboveThreshold(link, text, slack, thumb_url_medium, author, click) {

  articleShares(link).then(function(shares) {
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
               'value': 'Hits: ' + click,
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
} // end of notifyAboveThreshold function

function postData() {
  // set up slack incoming webhook
  var webhookUri = process.env.WEBHOOK_URI;
  var slack = new Slack();
  slack.setWebhook(webhookUri);

  // get article hits
  articleHits().then(function(data){
    for (var i = 0; i < data.length; i++) {

      // connect to smg mongodb
      mongoose.connect(process.env.MONGODB_URI);

      //define variables
      let link = data[i].link;
      let title = data[i].title;
      let click = data[i]._hits;
      let thumb_url_medium = data[i].thumb_url_medium;
      let author = data[i].author;

      let text = '';
      let aboveThreshold = false;
      let apiKey = process.env.API_KEY;
      let articleLink = 'http://dash.parsely.com/' + apiKey + '/find?url=' + link;
      let articleInfo = '<' + articleLink + '|' + title + '>' ;


      Article.findOne({link: link}, function (err, article){
        //find if article already exists in the collection
        if (article === null) {
          //if article hasn't been added to the collection, add the article
          article = new Article({
              title: title,
              link: link,
              click: click,
          });
        } else {
          //article exists, update history if necessary
          let current;
          if (article.history) {
            current = article.history;
          }
          text = getThresholdText(click, current, articleInfo, article);
          if ( text === null) {
            return;
          }

          notifyAboveThreshold(link, text, slack, thumb_url_medium, author, click);

        } //end of else meaning "article" has existed in db

        //save article
        article.save(function(err){
          if (err) {
            console.log('article save failed.', err);
          } else {
            console.log('article save success.');
          }
        }); //end of article save method

      }); //end of findOne method

    } // end of for loop
  }); // end of articleHits function
} // end of postData

module.exports = postData;
