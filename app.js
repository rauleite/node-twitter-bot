var Twit = require('twit');
var moment = require('moment');
var _ = require('lodash');
var config  = require('./config');
var MongoClient = require('mongodb').MongoClient;
var async = require('async');
var words = require('./words'); 

var T = new Twit(config);

// Change these, depending on what you want your
// database, collection, and tracking hash tag to
// look like.
var dbName = 'twitter-bot';
var collectionName = 'inputs';


var tweetDb, tweetColl;


// Naive blacklist, based on regex
var blacklist = new RegExp([
    // 'bootstrap',
    'portfolio',
    '\.amazon\.com\/',
    'meeting',
    '.*meetup.*',
    'java',
    'python',
    'ruby',
    'rails',
    'php',
    'laravel',
    'of course'
    
].join('|'), 'i');

// Naive blacklist, based on regex
var whitelist = new RegExp([
    'free',
    // 'gratis',
    // 'grátis',
    'learning',
    // 'aprenda',
    // 'aprendendo',
    'learncode',
    'learntocode',
    'learningcode',
    'learn',
    // 'aprender',
    'beginners',
    'beginner',
    // 'iniciante',
    // 'iniciantes',
    'course',
    // 'curso',
    'tutorials',
    'tutorial',
    'discount',
    // 'desconto',
    'getting started',
    'gettingstarted',

    'quick start',
    'quickstart',
    'zero to hero',
    'zerotohero',
    'start coding',
    'startcoding',
    'basics about',
    'How to',
    'Howto',
    'jumpstart',
    'Tips To Improve',
    'Building a',
    'Intro to'
    
].join('|'), 'i');


var empregos_whitelist = new RegExp([
    'vaga',
    'vagas',
    'carreira',
    'emprego',
    'freelance',
    'freelancer',
    'vacancy',
    'vacancies',
    'homeoffice',
    'home office',
    'home-office',
    'job',
    'trabalho',
    'work'

].join('|'), 'i');

// (?!https\:\/\/twitter.com.*|http\:\/\/twitter.com.*|.*https\:\/\/stackoverflow.com.*|.*http\:\/\/stackoverflow.com.*|http\:\/\/.*\.(png|jpg|jpeg|gif))(https.*|http.*)
var urlExceptions = new RegExp ([
    '(?!',
    'https\:\/\/twitter.com.*',
    '|',
    'http\:\/\/twitter.com.*',
    
    '|',
    '.*https\:\/\/stackoverflow.com.*',
    '|',
    '.*http\:\/\/stackoverflow.com.*',

    '|',
    '.*http\:\/\/gettopical.com.*',
    '|',
    '.*https\:\/\/gettopical.com.*',

    '|',
    'http\:\/\/.*\.(png|jpg|jpeg|gif))',

    '(https.*|http.*)'
    
].join(''), 'i');


var stream = T.stream('statuses/filter', {track: words.program.concat(words.html) });
stream.on('tweet', function(tweet) {
    console.log('Incoming Tweet');
    // Log the tweet no matter what, as log as a connection to Mongo has been established
    
    if(!tweetColl) {
        console.log('**** Sem tweetColl');
        return ;
    }

    var text = tweet.text.toLowerCase();
    // var urlNotTwitterPattern = /(?!https\:\/\/twitter.com.*|http\:\/\/twitter.com.*|http\:\/\/.*\.(png|jpg|jpeg|gif))(https.*|http.*)/g;
    // if(
    //     // Se nao e retweet
    //     // !tweet.retweeted_status &&
    //     !tweet.in_reply_to_user_id &&
    //     (tweet.lang === 'en' || tweet.lang === 'pt-BR') &&
    //     // whitelist.test(text) &&
    //     empregos_whitelist.test(text) 
    //   ) {
    //
    //     if (!tweet.retweeted) {
    //         console.log('Scheduling VAGA  RT');
    //         scheduleFuture(retweetTweet, tweet, 6);
    //     }
    // }

    // Vaga de empregos
    
    if(
        // Se nao e retweet
        // !tweet.retweeted_status &&
        // Don't Fav/RT the middle of a convo
        !tweet.in_reply_to_user_id &&                                     
        // Prevent Fav/RT/Following specific users
        !tweet.user.screen_name.match(words.userBlacklistPattern) &&
        (tweet.lang === 'en' || tweet.lang === 'pt-BR') &&
        whitelist.test(tweet.text.toLowerCase()) &&
        !blacklist.test(tweet.text.toLowerCase()) &&
        // Tem que ter link, que não comece com https:twitter.com
        // urlNotTwitterPattern.test(text) && ------- deprecated
        // Tem que ter link dentro da propriedade urls 
        (tweet.entities && tweet.entities.urls && tweet.entities.urls.length !== 0) 
      ) {
            if(!isActualPost(tweet)) {
                return ;
            }

            if(tweet.entities.in_reply_to_screen_name) {
                if(!tweet.entities.in_reply_to_screen_name.match(words.userBlacklistPattern)) {
                    console.log('***** words.userBlacklistPattern in_reply_to_screen_name', tweet.entities.in_reply_to_screen_name);
                    return ;
                }
            }
            if(
                tweet.text.match(words.userBlacklistRTPattern) ||
                tweet.text.match(words.textBlacklistPattern)
              ) {
                console.log('*** Pattern in text', tweet.text.match(words.userBlacklistRTPattern));
                console.log('*** Pattern in text', tweet.text.match(words.textBlacklistPattern));
                return ;
            }
            // Consta na whitelist, mas precisa de uma moderada.
            if (words.lightWhitelistPattern.test(text) && isLucky(3/4)) {
                console.log('***** ligh whitelist', text);
                return ;
            }
                  
            console.log('***** is in blacklist?', words.userBlacklistPattern.test(tweet.user.screen_name)); 
            console.log('***** screen_name', tweet.user.screen_name);

            // console.log('scheduling RT');            
            // scheduleFuture(retweetTweet, tweet);

            // console.log("--- entities", tweet.entities);
            // console.log("--- urls", tweet.entities.urls);
            // Rejeita algumas urls, como reddit
            // if(tweet.entities && tweet.entities.urls && tweet.entities.urls.length !== 0) {
            var urlsCurrent = tweet.entities.urls; 

            // console.log('****** URLs Testada', urlsCurrent);
            
            var validUrl = _.filter(urlsCurrent, function(o){
                // Tem que haver alguma url sem ser https://twitter.com*, e não
                // pode ter palavras da blacklist
                //  && !blacklist.test(o.expanded_url)
                console.log('********** o.expanded_url', o.expanded_url);
                console.log('********** o.expanded_url.match(urlExceptions)', o.expanded_url.match(urlExceptions));
                return o.expanded_url.match(urlExceptions); 
            });

            // console.log('******* validUrl', validUrl);
            console.log('******* text', text);
            if(!validUrl || validUrl.length === 0) {
                console.log('****** URL Inválida urlExceptions', validUrl);       
                return ;
            }
        // }

        // Roll to retweet
        if(words.htmlPattern.test(text)) {
            if(!tweet.retweeted) {
                console.log('Scheduling html RT');
                // scheduleFuture(retweetTweet, tweet, 3);
                scheduleFuture(retweetTweet, tweet, 3);
                // favorite(tweet);
            }
        } else {
            if (!tweet.retweeted) {
                console.log('Scheduling MEAN RT');
                // scheduleFuture(retweetTweet, tweet, 2);
                scheduleFuture(retweetTweet, tweet, 2);
                // favorite(tweet);
                // follow(tweet);
            }
        }
    }

});

function favorite(tweet) {
    if(!tweet.favorited && isLucky(1/13)) {
        console.log('Scheduling Favorite');
        scheduleFuture(favoriteTweet, tweet);
    }
}

function follow(tweet) {
    if(!tweet.user.following && isLucky(1/40)) {
        console.log('Scheduling Follow');
        scheduleFuture(followUser, tweet.user);
    }
}

// Instead of Fav/RT/Follow immediately, do it after a variable delay.
// Makes things seem a bit more human.
var scheduleFuture = function(fn, arg, count) {
    // 40 minutos a 1 hora e meia

    setTimeout(fn.bind(this, arg, count), randomMsBetween((1000 * 60 * 60 * 0.3), (1000 * 60 * 60 * 0.4)));
    // setTimeout(fn.bind(this, arg, count), randomMsBetween(2000, 3000));
    
};

//Choose a random number between two given numbers
var randomMsBetween = function(low, high) {
    return Math.floor(Math.random() * (high - low)) + low;
};

// Naive dice roll
var isLucky = function(chances) {
    return (Math.random() < chances);
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
                console.log(' *** qtdMatched', qtdMatched);
                console.log(' *** qtdMatched >= qtdPerm', qtdMatched >= qtdPerm);

                if (qtdMatched >= qtdPerm) {
                    isSimilarTweet = true; 
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

            T.post('statuses/retweet/:id', { id: tweet.id_str }, cb);
            
            return callback(null, 'Tweet Inserted');
     
        }

              
    });
};

var followUser = function(user) {
    console.log('Following user: ' + user.screen_name);
    T.post('friendships/create', {screen_name: user.screen_name, follow: true}, cb);
};

function isActualPost(data) {
    var created_at = null;
    var result = false;
    // Desnecessario, por retweets estarem removidos do criterio 
    if(data.retweeted_status) {
        // console.log('****** data.retweeted_status.created_at'); 
        created_at = data.retweeted_status.created_at; 
    } else {
        created_at = data.created_at;
    }

    if (isTweetDateToday(created_at)) {
       result = true;
    } else {
       console.log('******** POST ANTIGO -->', created_at);
    }

    return result; 
    
}

function isTweetDateToday(created_at) {
    var today = moment().locale('en');
    return today.isSame(new Date(created_at), 'day');
}


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
