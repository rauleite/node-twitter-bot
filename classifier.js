var words = require('./words');
var helper = require('./helper');

var _ = require('lodash'); 

var classifier = {};


// classifier.isBlacklistComposite = function(fn){
//
// }
classifier.isUserBlacklist = function (screen_name) {
    var rank = words.userRank[screen_name];
    return rank === 0;
};

classifier.isUserBlacklistRT = function (text) {
    return _.some(words.userRank, function (value, key) {
        if (value !== 0) return;     
        return text.match('RT @' + key);
    });
};

classifier.isTextBlacklist = function (tweet) {
    return classifier.textLucky(tweet) === 0;
};

// Tem que haver alguma url sem ser https://twitter.com*, e não
// pode ter palavras da blacklist
classifier.validUrls = function(urlsCurrent) {
    return _.filter(urlsCurrent, function(o){
        return o.expanded_url.match(words.urlExceptions); 
    });

};

classifier.isValidUrls = function(urlsCurrent) {
    var urls = classifier.validUrls(urlsCurrent); 
    return urls && urls.length > 0;
};

// retorna o menor level match, de 0 - 10. Senão 10 (default)
classifier.textLucky = function (tweet) {
    var level = helper.filterMinMatch(words.textRank, tweet.text);
    return level === undefined || level === null ? 10 : level;
};


classifier.isTextWhitelist = function (text) {
    var pattern = words.textWhitelistPattern.toLowerCase();
    var str = text.toLowerCase();
    return str.match(pattern);
};

// retorna o maior bias matched, de 0 - j
classifier.biasRetweetValue = function (originalValue, tweet) {
    var biasValue = helper.filterMaxMatch(words.textBiasPercent, tweet.text);
    if(!_.isNumber(biasValue)) {
        return originalValue;
    }
    // Arredonda: 1.4 = 1; 1.6 = 2; 1.5 = 2;
    return _.round(helper.biasCalc(originalValue, biasValue));
};

module.exports = classifier;
// var userBlacklistRTPattern = new RegExp(_userBlacklistRT.join('|'));
