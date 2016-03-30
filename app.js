var MongoClient = require('mongodb').MongoClient;

var classifier = require('./classifier');
var config  = require('./config');
var helper = require('./helper');
var words = require('./words'); 

var async = require('async');
var _ = require('lodash');
var Twit = require('twit');

var T = new Twit(config);

// Change these, depending on what you want your
// database, collection, and tracking hash tag to
// look like.
var dbName = 'twitter-bot';
var collectionName = 'inputs';

var tweetDb, tweetColl;
var tweetsID = [];

var HTML_VALUE = 3;
var MEAN_VALUE = 2;

var START_TIME_TO_RETWEET = 1000 * 60 * 60 * 0.3;
var END_TIME_TO_RETWEET = 1000 * 60 * 60 * 0.4;

// var START_TIME_TO_RETWEET = 20;
// var END_TIME_TO_RETWEET = 30;


var stream = T.stream('statuses/filter', {track: words.program.concat(words.html) });
stream.on('tweet', function(tweet) {
    console.log('Incoming Tweet');
    // Log the tweet no matter what, as log as a connection to Mongo has been established
            
    if(!tweetColl) {
        console.log('**** Sem tweetColl');
        return ;
    }
    // Don't Fav/RT the middle of a convo
    if(tweet.in_reply_to_user_id) {
        return ;
    }

    var screen_name = tweet.user.screen_name;
    var text = tweet.text;
   
    var valueSpecialUser = null;
    _.some(words.specialUsers, function(value, key) {
        if(screen_name.match(key)) {
            valueSpecialUser = value;
            console.log('** Special User --', key + ': ' + value)
            return true;
        }
    });

    if(
        _.isNumber(valueSpecialUser) ||
        // Se nao e retweet
        // !tweet.retweeted_status &&
        tweet.lang === 'en' &&
        classifier.isTextWhitelist(text) &&

        // Não precisa mais
        // !words.blacklist.test(tweet.text.toLowerCase()) &&
        
        // Tem que ter link dentro da propriedade urls 
        (tweet.entities && tweet.entities.urls && tweet.entities.urls.length !== 0) 
      ) {

            console.log('** screen_name --', screen_name);
            console.log('** text --', text);
            console.log('*** id_str', tweet.id_str);


            // Rejeitar stream repetidos
            if(!_.some(tweetsID, tweet.id_str)) {
                tweetsID.push(tweet.id_str); 
            } else {
                console.log('** tweetsID já tem --', tweet.id);
                return;
            }
            
            var postActual = helper.isActualPost(tweet);
            if(!postActual) {
                console.log('** !postActual --', postActual);
                return ;
            }
            
            // userBlackList
            if (classifier.isUserBlacklist(screen_name)) {
                console.log('** UserBlackList --', screen_name);
                return ;
            } 

            // tweet.text.match(words.userBlacklistRTPattern)
            if(classifier.isUserBlacklistRT(text)) {
                console.log('*** RT Blacklist ', text);
                return;
            }
            
            // tweet.text.match(words.textBlacklistPattern)
            if(classifier.isTextBlacklist(tweet)){
                console.log('isTextBlacklist --> ', tweet);
                return;
            
            }

            
            // console.log('******* validUrl', validUrl);
            if(!classifier.isValidUrls(tweet.entities.urls)) {
                console.log('** URL Inválida -->', tweet.entities.urls);       
                return ;
            }
        // }

            // Roll to retweet
            if(words.htmlPattern.test(text)) {
                if(!tweet.retweeted) {
                    console.log(' ** Scheduling html RT');
                    scheduleFuture(retweetTweet, tweet, HTML_VALUE, valueSpecialUser);
                    // scheduleFuture(retweetTweet, tweet, 0);
                    // favorite(tweet);
                }
            } else {
                if (!tweet.retweeted) {
                    console.log('** Scheduling MEAN RT');
                    scheduleFuture(retweetTweet, tweet, MEAN_VALUE, valueSpecialUser);
                    // scheduleFuture(retweetTweet, tweet, 0);
                    // favorite(tweet);
                    // follow(tweet);
                }
            }
        }

});

function favorite(tweet) {
    if(!tweet.favorited && helper.isLucky(1/13)) {
        console.log('Scheduling Favorite');
        scheduleFuture(favoriteTweet, tweet);
    }
}

function follow(tweet) {
    if(!tweet.user.following && helper.isLucky(1/40)) {
        console.log('Scheduling Follow');
        scheduleFuture(followUser, tweet.user);
    }
}

// Instead of Fav/RT/Follow immediately, do it after a variable delay.
var scheduleFuture = function(fn, tweet, resistValue, valueSpecialUser) {
    // Pode reduzir resitencia (aumentar chance dele ser postado)
    var resistValueWhithBias = classifier.biasRetweetValue(resistValue, tweet);
    // Pode aumentar resistencia (reduzir chance dele ser postado)
    var hours = helper.tweetedAtHours(tweet);

    if(hours > 1) {
        if(hours < 2) {
            resistValueWhithBias += 1;  
        } else if(hours < 4) {
            resistValueWhithBias += 2;  
        } else if(hours < 6) {
            resistValueWhithBias += 3;  
        } else if(hours < 8) {
            resistValueWhithBias += 4;  
        } else if(hours < 10) {
            resistValueWhithBias += 5;  
        } else if(hours < 12) {
            resistValueWhithBias += 6;  
        } else if(hours < 14) {
            resistValueWhithBias += 7;  
        } else if(hours < 16) {
            resistValueWhithBias += 8;  
        } else if(hours < 18) {
            resistValueWhithBias += 9;  
        } else if(hours < 20) {
            resistValueWhithBias += 10;  
        } else if(hours < 22) {
            resistValueWhithBias += 11;  
        } else if(hours < 24) {
            resistValueWhithBias += 12;  
        }

    }
    if(valueSpecialUser) {
        resistValueWhithBias += valueSpecialUser;
    }

    console.log('*** special user?', valueSpecialUser);
    console.log('*** diff hours -- ', hours)
    console.log('*** Bias hours? --', resistValueWhithBias);
    setTimeout(fn.bind(this, tweet, resistValueWhithBias), randomMsBetween(START_TIME_TO_RETWEET, END_TIME_TO_RETWEET));
    
};

//Choose a random number between two given numbers
var randomMsBetween = function(low, high) {
    return Math.floor(Math.random() * (high - low)) + low;
};


var favoriteTweet = function(tweet, count) {
    console.log('Favoriting tweet:' + tweet.text);
    T.post('favorites/create', { id: tweet.id_str }, cb);
    // T.post('favorites/create', { id: tweet.id_str }, cb, count);
};

var retweetTweet = function(tweet, count) {
    console.log('Try retweet tweet:', tweet.text);
    T.get('statuses/show/:id', {id: tweet.id_str}, function(err, data, response) {

        if (!data || err) {
            console.log(err);
            return ;
        }
       // console.log('Date:',  created_at);
        console.log('count (arg) -->', count);
        console.log('data.retweet_count -->', data.retweet_count);

        if(data.retweet_count < count) { 
            return ;    
        }

        console.log(1);

        async.waterfall([
            async_findDb,
            async_matchText, 
            async_sendManager
        ],
       function(err, result) {
            if(err) {
                new Error(err);
            } 
            console.log(result);
       });

        console.log(2);
        function async_findDb(callback) {
            console.log(3);
            var allTweetTexts = tweetColl.find().toArray(function(err, docsList) {
                if(err) {
                    console.log(err); 
                }
                // console.log('*** DOCS', docsList);
                callback(null, docsList);
            });

        }

        function async_matchText(docsList, callback) {
                        
            // console.log('docsList', docsList);
            // console.log('!docsList', !docsList);
            var isSimilarTweet = false;
            var wordsList = data.text.split(' ');

            if(!docsList || docsList.length <= 0) {
                return callback(null, wordsList);
            }
                
            _.some(docsList, function(doc) {
                var wordsListDb = doc.text; 
                // console.log('****** wordsListDb', wordsListDb);
                // console.log('****** data.text.split(" ")', data.text.split(' '));
                
                // wordsList : Array Words of text 
                var textItemMatched = _.filter(wordsList, function(word){
                    // console.log('*** Primeiro -->  Filter');
                    // wordsListDb : Array Words of Text (in DB)
                    return _.some(wordsListDb, function(wordDb){
                        // console.log('*** Segundo --> Filter');
                        // console.log('word', word);
                        // console.log('wordDb', wordDb);
                        
                        // o ultimo word é indefinido
                        if(word === undefined || wordDb === undefined) return false;
                        
                        if(word.toLowerCase() === wordDb.toLowerCase()) {
                            // console.log('IGUAL', word);
                            // Remove wordDb do wordsListDb
                            var index = wordsListDb.indexOf(wordDb);
                            wordsListDb.splice(index, 1);
                            // _.some wordsListDb
                            return true; 
                        }
                        
                        // _.some wordsListDb
                        return false; 
                    }); 
                });
                // console.log('wordsList.length', wordsList.length);
                var percent = 70;
                var qtdPerm = wordsList.length * percent / 100;
                // console.log('qtdPerm', qtdPerm);
                var qtdMatched = textItemMatched.length; 
                
                if (qtdMatched >= qtdPerm) {
                    isSimilarTweet = true; 
                    console.log(' *** qtdMatched', qtdMatched);
                    console.log(' *** qtdMatched >= qtdPerm', qtdMatched >= qtdPerm);
                    // _.some docsList - break
                    return true;
                }
                //_.some docsList - continue
                return false;
            });

            if(isSimilarTweet) {
                // isSimilarTweet = false;
                return callback('*** Já possui SIMILAR');
            } else {
                return callback(null, wordsList);
            }

        }

        function async_sendManager(wordsList, callback) {
            console.log(4);
            
            // var wordsList = tweet.text.split(' ');
            console.log('wordsList', wordsList );
            tweetColl.insert({text: wordsList}, function(err, result) {

                if(err) {
                    console.log('ERRO de INSERÇÃO', err);
                    return callback('Erro de INSERÇÃO');
                }
            });

            console.log('******** Retweeting !!!');
            console.log('retweet_count -->', data.retweet_count);

            // console.log('******** Search alternative date', data);
            
            var textLucky = classifier.textLucky(data); 
            var wasLucky = helper.isLucky(textLucky / 10);
            console.log('Text -->', data.text);
            console.log('Text Lucky -->', textLucky);
            console.log('Was Lucky --> helper.isLucky(textLucky / 10)', wasLucky);
            if(wasLucky) {
                T.post('statuses/retweet/:id', { id: tweet.id_str }, cb);
            } else {
                console.log('docker -- ext not lucky', data.text + ' --> ' + textLucky);
            }

            
            return callback(null, 'Tweet Inserted');
     
        }

              
    });
};

var followUser = function(user) {
    console.log('Following user: ' + user.screen_name);
    T.post('friendships/create', {screen_name: user.screen_name, follow: true}, cb);
};

// Simple callback to swallow successes and log errors
var cb = function(err, data, response) {
    if(err) {
        console.log(err);
        return;
    }
    // console.log(data);
};

//Connect to a local Mongo Instance
MongoClient.connect('mongodb://localhost:27019/' + dbName, function(err, db) {
    if(err) {
        console.log('ERROR: Cannot connect to mongo, tweets will not be logged');
        console.log(err);
    } else {
        console.log('Connected to mongo');
        tweetDb = db;
        tweetColl = db.collection(collectionName);
    }
});

//Gracefully handle SIGINT
process.on( 'SIGINT', function() {
    console.log( "\nGracefully shutting down from SIGINT (Ctrl-C)" );
    if(tweetDb) {
        tweetDb.close();
    }
    if(stream){
        stream.stop();
    }

    process.exit();
});
