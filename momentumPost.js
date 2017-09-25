'use strict';
require('dotenv').config();
var Slack = require('slack-node');
var mongoose = require('mongoose');
var momentumHits = require('./momentumFetch').momentumHits;
var async = require("async");
var eachLimit = async.eachLimit;

var findArticleMomentumTask = require('./momentumTasks').findArticleMomentumTask;
var notifySlackMomentumTask = require('./momentumTasks').notifySlackMomentumTask;
var saveArticleMomentumTask = require('./momentumTasks').saveArticleMomentumTask;

const CONCURRENCY = 4;

function getArticleHits(slack) {
  // get article hits
  momentumHits().then(function(data) {
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
      hits: data._hits,
      thumb_url_medium: data.thumb_url_medium,
      author: data.author,
      slack: slack
    };

    tasks.push(function(done) {
      findArticleMomentumTask(context, done);
    });

    tasks.push(function(done) {
      notifySlackMomentumTask(context, done);
    });

    tasks.push(function(done) {
      saveArticleMomentumTask(context, done);
    });

    async.series(tasks, done);
  }
}

function postData() {
  var webhookUri = process.env.WEBHOOK_URI;
  var slack = new Slack();
  slack.setWebhook(webhookUri);
  getArticleHits(slack);
}

module.exports = postData;
