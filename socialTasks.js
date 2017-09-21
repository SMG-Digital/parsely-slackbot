var Article = require('./articleSchema.js');
var socialReferrer = require('./socialFetch').socialReferrer;
var socialText = require('./socialText.js');
var socialThreshold = require('./socialThreshold.js');

function findArticleTask(context, done) {
  Article.findOne({link: context.link}, function (err, article){
    if (article === null) {
      context.article = new Article({
        title: context.title,
        link: context.link,
        hits: context.hits
      });
    } else {
      context.article = article;
    }
    done();
  }).catch(function(err){
    console.log("error from findOne: ", err);
    done(err);
  });
}

function getSocialRefTask(context, done) {
  var totalReferrerClick = 0;
  var socialOrder = -1;
  socialReferrer(context.link).then(function(referrer) {
    for(var i = 0; i < referrer.length; i++){
      totalReferrerClick += referrer[i]._hits;
      if (referrer[i].type === 'social') {
        socialOrder = i;
      }
    }
    context.referrerPercentage = referrer[socialOrder]._hits / totalReferrerClick;
    done();
  }).catch(function(err){
    console.log("error from socialReferrer: ", err);
    done(err);
  });
}

function notifySlackTask(context, done) {
  let currentReferrer;
  let text = '';
  let aboveThreshold = false;
  let apiKey = process.env.API_KEY;
  let articleLink = 'http://dash.parsely.com/' + apiKey + '/find?url=' + context.link;
  let articleInfo = '<' + articleLink + '|' + context.title + '>' ;
  if (context.article.referrerHistory) {
    currentReferrer = context.article.referrerHistory;
  }
  text = socialText.socialText(context.referrerPercentage, currentReferrer, articleInfo, context.article);
  if (text !== null) {
    socialThreshold.socialThreshold(context.link, text, context.slack, context.thumb_url_medium, context.author, context.hits);
  }
  done();
}

function saveArticleTask(context, done) {
  context.article.save(function(err){
    if (err) {
      console.log('social article save failed.', err);
    } else {
      console.log('social article save success.');
    }
    done(err);
  });
}

  module.exports = {
    findArticleTask: findArticleTask,
    getSocialRefTask: getSocialRefTask,
    notifySlackTask: notifySlackTask,
    saveArticleTask: saveArticleTask
  };
