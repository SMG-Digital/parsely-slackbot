'use strict';
require('dotenv').config();
var Slack = require('slack-node');
var mongoose = require('mongoose');
var async = require("async");
var socialHits = require('./socialFetch').socialHits;
var async = require("async");
var eachLimit = async.eachLimit;

var findArticleTask = require('./socialTasks').findArticleTask;
var getSocialRefTask = require('./socialTasks').getSocialRefTask;
var notifySlackTask = require('./socialTasks').notifySlackTask;
var saveArticleTask = require('./socialTasks').saveArticleTask;

const CONCURRENCY = 4;

function getArticleHits(slack) {
  // get article hits
  socialHits().then(function(data) {
    // connect to smg mongodb
    mongoose.connect(process.env.MONGODB_URI);

    eachLimit(data, CONCURRENCY, processArticle,function(error){
      if (error) {
        console.log("error: ", error);
      } else {
        console.log("Article run success!");
      }
    });

  }).catch(function(err){
    console.log("error from eachLimit: ", err);
  });

  function processArticle(data, done) {
    var tasks = [];
    var context = {
      link: data.link,
      title: data.title,
      hits: data.metrics.views,
      thumb_url_medium: data.thumb_url_medium,
      author: data.author,
      slack: slack
    };

    tasks.push(function(done) {
      findArticleTask(context, done);
    });

    tasks.push(function(done) {
      getSocialRefTask(context, done);
    });

    tasks.push(function(done) {
      notifySlackTask(context, done);
    });

    tasks.push(function(done) {
      saveArticleTask(context, done);
    });

    async.series(tasks, done);
  }
}
function postData() {
  // set up slack incoming webhook
  let webhookUri = process.env.WEBHOOK_URI;
  let slack = new Slack();
  slack.setWebhook(webhookUri);
  getArticleHits(slack);
}

module.exports = postData;
