'use strict';
require('dotenv').config();
var Slack = require('slack-node');
var mongoose = require('mongoose');
var async = require("async");
var appleLohData = require('./appleLohFetch').appleLohData;
var async = require("async");
var eachLimit = async.eachLimit;

var findArticleAppleLohTask = require('./appleLohTasks').findArticleAppleLohTask;
var notifySlackAppleLohTask = require('./appleLohTasks').notifySlackAppleLohTask;
var saveArticleAppleLohTask = require('./appleLohTasks').saveArticleAppleLohTask;
var getContextTask = require('./appleLohTasks').getContextTask;

const CONCURRENCY = 4;

function getArticleHits(slack) {
  appleLohData().then(function(data) {
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
    console.log("error from appleLohData: ", err);
  });

  function processArticle(data, done) {
    var tasks = [];
    var context = {};

    tasks.push(function(done) {
      getContextTask(data.url, context, slack, done);
    });

    tasks.push(function(done) {
      findArticleAppleLohTask(context, done);
    });

    tasks.push(function(done) {
      notifySlackAppleLohTask(context, done);
    });

    tasks.push(function(done) {
      saveArticleAppleLohTask(context, done);
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
