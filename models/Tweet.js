var mongoose = require('mongoose');

// Create a new schema for our tweet data
var schema = new mongoose.Schema({
    twid       : String
  , active     : Boolean
  , author     : String
  , avatar     : String
  , body       : String
  , date       : Date
  , screenname : String
});

// Create a static getTweets method, returning tweet data from database
schema.statics.getTweets = function(page, skip, callback) {

  var tweets = [],
      start = (page * 10) + (skip * 1);

  // Query the db, using skip and limit to achieve page chunks
  Tweet.find({},'twid active author avatar body date screenname',{skip: start, limit: 10}).sort({date: 'desc'}).exec(function(err,docs){

    if(!err) {
      tweets = docs;
      tweets.forEach(function(tweet){
        tweet.active = true;
      });
    }

    callback(tweets);

  });

};

// Return model based upon the defined schema
module.exports = Tweet = mongoose.model('Tweet', schema);
