var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//define the article schema
var articleSchema = new Schema({
  title:  String,
  link: {
    type: String,
    index: {
      unique: true
    }
  },
  click: { type: Number, default: null },
  history: { type: Number, default: null }
});
//create model
module.exports = mongoose.model('Article', articleSchema);
