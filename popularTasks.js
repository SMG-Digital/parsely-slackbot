'use strict';
var Article = require('./articleSchema.js');
var popularText = require('./popularText.js');
var popularThreshold = require('./popularThreshold.js');

function findArticlePopularTask(context, done) {
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

function notifySlackPopularTask(context, done) {
  let currentPopular;
  let text = '';
  let aboveThreshold = false;
  let apiKey = process.env.API_KEY;
  let articleLink = 'http://dash.parsely.com/' + apiKey + '/find?url=' + context.link;
  let articleInfo = '<' + articleLink + '|' + context.title + '>' ;

  if (context.article.popularHistory) {
    currentPopular = context.article.popularHistory;
  }
  text = popularText.popularText(context.hits, currentPopular, articleInfo, context.article);
  if (text !== null) {
    popularThreshold.popularThreshold(context.link, text, context.slack, context.thumb_url_medium, context.author, context.hits);
  }
  done();
}

function saveArticlePopularTask(context, done) {
  context.article.save(function(err){
    if (err) {
      console.log('popular article save failed.', err);
    } else {
      console.log('popular article save success.');
    }
    done(err);
  });
}

  module.exports = {
    findArticlePopularTask: findArticlePopularTask,
    notifySlackPopularTask: notifySlackPopularTask,
    saveArticlePopularTask: saveArticlePopularTask
  };
