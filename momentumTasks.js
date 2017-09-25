'use strict';
var Article = require('./articleSchema.js');
var momentumText = require('./momentumText.js');
var momentumThreshold = require('./momentumThreshold.js');

function findArticleMomentumTask(context, done) {
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

function notifySlackMomentumTask(context, done) {
  let currentMomentum;
  let text = '';
  let aboveThreshold = false;
  let apiKey = process.env.API_KEY;
  let articleLink = 'http://dash.parsely.com/' + apiKey + '/find?url=' + context.link;
  let articleInfo = '<' + articleLink + '|' + context.title + '>' ;

  if (context.article.momentumHistory) {
    currentMomentum = context.article.momentumHistory;
  }
  text = momentumText.momentumText(context.hits, currentMomentum, articleInfo, context.article);
  if (text !== null) {
    momentumThreshold.momentumThreshold(context.link, text, context.slack, context.thumb_url_medium, context.author, context.hits);
  }
  done();
}

function saveArticleMomentumTask(context, done) {
  context.article.save(function(err){
    if (err) {
      console.log('momentum article save failed.', err);
    } else {
      console.log('momentum article save success.');
    }
    done(err);
  });
}

  module.exports = {
    findArticleMomentumTask: findArticleMomentumTask,
    notifySlackMomentumTask: notifySlackMomentumTask,
    saveArticleMomentumTask: saveArticleMomentumTask
  };
