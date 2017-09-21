var express = require('express')
var app = express()
popularPost = require('./popularPost');
momentumPost = require('./momentumPost');
engagementPost = require('./engagementPost');
socialPost = require('./socialPost');
appleLohPost = require('./appleLohPost');

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))

app.get('/', function(request, response) {
  response.send('Hello World!');
})

app.listen(app.get('port'), function() {
  console.log('Node app is running at localhost:' + app.get('port'));
  setInterval (function() {
    console.log('loop...');
    popularPost();
    momentumPost();
    engagementPost();
    socialPost();
    appleLohPost();
  }, 5000);
})
