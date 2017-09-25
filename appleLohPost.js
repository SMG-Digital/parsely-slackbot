require('dotenv').config();
var Slack = require('slack-node');
var mongoose = require('mongoose');
var async = require("async");
var appleLohData = require('./appleLohFetch').appleLohData;
var appleLohDetailedInfo = require('./appleLohFetch').appleLohDetailedInfo;
var async = require("async");
var eachLimit = async.eachLimit;

var findArticleAppleLohTask = require('./AppleLohTasks').findArticleAppleLohTask;
var notifySlackAppleLohTask = require('./AppleLohTasks').notifySlackAppleLohTask;
var saveArticleAppleLohTask = require('./AppleLohTasks').saveArticleAppleLohTask;

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
    appleLohDetailedInfo(data.url).then(function(data){
      var tasks = [];
      var context = {
        link: data[0].link,
        title: data[0].title,
        hits: data[0]._hits,
        thumb_url_medium: data[0].thumb_url_medium,
        author: data[0].author,
        slack: slack
      };

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
    });
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
