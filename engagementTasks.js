var Article = require('./articleSchema.js');
var engagementText = require('./engagementText.js');
var engagementThreshold = require('./engagementThreshold.js');

function findArticleEngagementTask(context, done) {
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

function notifySlackEngagementTask(context, done) {
  let currentEngagement;
  let text = '';
  let aboveThreshold = false;
  let apiKey = process.env.API_KEY;
  let articleLink = 'http://dash.parsely.com/' + apiKey + '/find?url=' + context.link;
  let articleInfo = '<' + articleLink + '|' + context.title + '>' ;

  if (context.article.engagementHistory) {
    currentEngagement = context.article.engagementHistory;
  }
  text = engagementText.engagementText(context.hits, currentEngagement, articleInfo, context.article, context.timeEngage);
  if (text !== null) {
    engagementThreshold.engagementThreshold(context.link, text, context.slack, context.thumb_url_medium, context.author, context.hits);
  }
  done();
}

function saveArticleEngagementTask(context, done) {
  context.article.save(function(err){
    if (err) {
      console.log('engagement article save failed.', err);
    } else {
      console.log('engagement article save success.');
    }
    done(err);
  });
}

  module.exports = {
    findArticleEngagementTask: findArticleEngagementTask,
    notifySlackEngagementTask: notifySlackEngagementTask,
    saveArticleEngagementTask: saveArticleEngagementTask
  };
