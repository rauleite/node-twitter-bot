var moment = require('moment');

var self = {};

// Naive dice roll
self.isLucky = function(chances) {
    return (Math.random() < chances);
};

self.isActualPost = function(tweet) {
    var created_at = null;
    var result = null;
    // Desnecessario, por retweets estarem removidos do criterio 
    if(tweet.retweeted_status) {
        // console.log('****** tweet.retweeted_status.created_at'); 
        created_at = tweet.retweeted_status.created_at; 
    } else {
        created_at = tweet.created_at;
    }

    if (self.isTweetDateToday(created_at)) {
       result = created_at;
    } 

    return result; 
    
};

self.isTweetDateToday = function(created_at) {
    var today = moment().locale('en');
    return today.isSame(new Date(created_at), 'day');
};

module.exports = self;
