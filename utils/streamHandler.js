var Tweet = require('../models/Tweet');

module.exports = function(stream, io){

  // wait for incoming tweets
  stream.on('data', function(data) {

    if (data['user'] !== undefined) {

      // Construct a new tweet object
      var tweet = {
        twid: data['id_str'],
        active: false,
        author: data['user']['name'],
        avatar: data['user']['profile_image_url'],
        body: data['text'],
        date: data['created_at'],
        screenname: data['user']['screen_name']
      };

      var tweetEntry = new Tweet(tweet);

      tweetEntry.save(function(err) {
        if (!err) {
          io.emit('tweet', tweet);
        }
      });

    }

  });

};
