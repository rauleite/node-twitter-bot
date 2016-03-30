var moment = require('moment');
var _ = require('lodash');
var helper = {};

// Naive dice roll
helper.isLucky = function(chances) {
    return (Math.random() < chances);
};

helper.isActualPost = function(tweet) {
    var created_at = helper.dateTweetOrRetweet(tweet);
    
    if (helper.isTweetDateToday(created_at)) {
       return created_at;
    } 

    return null; 
    
};


helper.tweetedAtHours = function(tweet) {
    var created_at = helper.dateTweetOrRetweet(tweet);
    
    var created = moment(new Date(created_at)).locale('en');
    console.log('created 1 --', created.hours())

    // created.add(hours, 'hours');
    // console.log('created 2 --', created._d)

    var now = moment(new Date()).locale('en');
    console.log('now --', now.hours())
    
    // var result = created.isBefore(now, 'hours');
    var result = now.hours() - created.hours();
    console.log('result --', result)
    return result;
};

helper.isTweetDateToday = function(created_at) {
    var today = moment().locale('en');
    return today.isSame(new Date(created_at), 'day');
};

helper.dateTweetOrRetweet = function(tweet) {
    if(tweet.retweeted_status) {
        return tweet.retweeted_status.created_at; 
    } else {
        return tweet.created_at;
    }
};

helper.filterMatches = function(mapObj, text) {
    text = text.toLowerCase();
    var valuesMatched = [];
    _.forEach(mapObj, function (value, key) {
        // console.log(key)
        // console.log(text)
        // console.log(value)
        if (text.match(key.toLowerCase())) { 
            valuesMatched.push(value);
        }
    });
    return valuesMatched;

   
};

// Retorna um numero ou um array vazio
helper.filterMinMatch = function(mapObj, text) {
    console.log('texttttt', text)
    return _.min(helper.filterMatches(mapObj, text));
};

// Retorna um numero ou um array vazio
helper.filterMaxMatch = function(mapObj, text) {
    return _.max(helper.filterMatches(mapObj, text));
};

helper.biasCalc = function (originalValue, biasValue) {

    var result = originalValue - (originalValue * biasValue / 100);
    // Defensive
    if(!_.isNumber(result)) {
        throw new Error(result + ' is not a Number');
    }
    return result;
};
module.exports = helper;
