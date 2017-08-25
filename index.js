var express = require('express')
var app = express()
slackPost = require('./slackPost');

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))

app.get('/', function(request, response) {
  response.send('Hello World!');
})

app.listen(app.get('port'), function() {
  console.log('Node app is running at localhost:' + app.get('port'));
  var history = {};
  setInterval (function() {
    console.log('loop...');
    slackPost(history);
  }, 5000);
})
