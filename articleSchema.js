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
  popularHistory: { type: Number, default: null },
  momentumHistory: { type: Number, default: null },
  engagementHistory: { type: Number, default: null },
  referrerHistory: { type: Number, default: null },
  appleLohHistory: { type: Number, default: null }
});
//create model
module.exports = mongoose.model('Article', articleSchema);
