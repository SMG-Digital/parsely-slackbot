'use strict';
require('dotenv').config();
var Slack = require('slack-node');
var mongoose = require('mongoose');
var engagementHits = require('./engagementFetch').engagementHits;
var async = require("async");
var eachLimit = async.eachLimit;

var findArticleEngagementTask = require('./engagementTasks').findArticleEngagementTask;
var notifySlackEngagementTask = require('./engagementTasks').notifySlackEngagementTask;
var saveArticleEngagementTask = require('./engagementTasks').saveArticleEngagementTask;

const CONCURRENCY = 4;

function getArticleHits(slack) {
  // get article hits
  engagementHits().then(function(data) {
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
      timeEngage: data.metrics.avg_engaged,
      slack: slack
    };

    tasks.push(function(done) {
      findArticleEngagementTask(context, done);
    });

    tasks.push(function(done) {
      notifySlackEngagementTask(context, done);
    });

    tasks.push(function(done) {
      saveArticleEngagementTask(context, done);
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
