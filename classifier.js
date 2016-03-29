var words = require('./words');

var _ = require('lodash'); 

var self = {};


// self.isBlacklistComposite = function(fn){
//
// }
self.isUserBlacklist = function (screen_name) {
    var rank = words.userRank[screen_name];
    return rank === 0;
};

self.isUserBlacklistRT = function (text) {
    return _.some(words.userRank, function (value, key) {
        if (value !== 0) return;     
        return text.match('RT @' + key);
    });
};

self.isTextBlacklist = function (text) {
    return self.textLucky(text) === 0;
};

self.validUrls = function(urlsCurrent) {
    return _.filter(urlsCurrent, function(o){
        // Tem que haver alguma url sem ser https://twitter.com*, e não
        // pode ter palavras da blacklist
        //  && !blacklist.test(o.expanded_url)
        // console.log('********** o.expanded_url.match(urlExceptions)', o.expanded_url.match(urlExceptions));
        return o.expanded_url.match(words.urlExceptions); 
    });

};

self.isValidUrls = function(urlsCurrent) {
    var urls = self.validUrls(urlsCurrent); 
    return urls && urls.length > 0;
};

// retorna o menor level match, de 0 - 10. Senão 10 (default)
self.textLucky = function (text) {
    // var pattern = new RegExp(words.textRank.join('|'), 'i');
    var textMatches = _.filter(words.textRank, function (value, key) {
        if (!text.toLowerCase().match(key.toLowerCase())) return false;
        return true;
        
    });

    var level = _.min(textMatches);
    
    return level === undefined || level === null ? 10 : level;
};


self.isTextWhitelist = function(text) {
    var pattern = words.textWhitelistPattern.toLowerCase();
    var str = text.toLowerCase();
    return str.match(pattern);
};

module.exports = self;
// var userBlacklistRTPattern = new RegExp(_userBlacklistRT.join('|'));
