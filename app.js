var Twit = require('twit');
var moment = require('moment');
var config  = require('./config');
var MongoClient = require('mongodb').MongoClient;

var words = require('./words'); 

var T = new Twit(config);

// Change these, depending on what you want your
// database, collection, and tracking hash tag to
// look like.
var dbName = 'twitter-bot';
var collectionName = 'inputs';


var tweetDb, tweetColl;

var stream = T.stream('statuses/filter', {track: words.program.concat(words.html) });
stream.on('tweet', function(tweet) {
    console.log('Incoming Tweet');
    // Log the tweet no matter what, as log as a connection to Mongo has been established
    
    // if(tweetColl) {
    //     return ;
    // }
    // tweetColl.insert(tweet, function(err, result) {
        // if(err) console.log(err);
        // else console.log('Tweet logged');
        
    // });
    var text = tweet.text.toLowerCase();
    
    if(
        // Se nao e retweet
        !tweet.retweeted_status &&
        !tweet.in_reply_to_user_id &&
        (tweet.lang === 'en' || tweet.lang === 'pt-BR') &&
        // whitelist.test(text) &&
        empregos_whitelist.test(text) 
      ) {

        if (!tweet.retweeted) {
            console.log('Scheduling VAGA  RT');
            scheduleFuture(retweetTweet, tweet, 6);
        }
    }

    // Vaga de empregos
    
    if(
        // Se nao e retweet
        // !tweet.retweeted_status &&
        // Don't Fav/RT the middle of a convo
        !tweet.in_reply_to_user_id &&                                     
        // Prevent Fav/RT/Following specific users
        !user_blacklist.test(tweet.user.screen_name) &&
        (tweet.lang === 'en' || tweet.lang === 'pt-BR') &&
        whitelist.test(text) &&
        !blacklist.test(text) &&
        // Tem que ter link
        /https|http/g.exec(text) 
      ) {
        // Consta na whitelist, mas precisa de uma moderada.
        // if (words.lightWhitelistPattern.test(text) && isLucky(1/4)) {
        //     console.log('***** ligh whitelist', text);
        //     return ;
        // }
              
        // console.log('scheduling RT');            
        // scheduleFuture(retweetTweet, tweet);

        // Rejeita algumas urls, como reddit
        if(tweet.entities && tweet.entities.urls && tweet.entities.urls.expanded_url) {
            if (words.blacklistPattern(tweet.entities.urls.expanded_url)) {
                console.log('********** Rejeitada url expandida', tweet.entities.urls.expanded_url);
                return ;
            } 
        }

        // Roll to retweet
        if(words.htmlPattern.test(text)) {
            if(!tweet.retweeted) {
                console.log('Scheduling html RT');
                scheduleFuture(retweetTweet, tweet, 4);
                favorite(tweet);
            }
        } else {
            if (!tweet.retweeted) {
                console.log('Scheduling MEAN RT');
                scheduleFuture(retweetTweet, tweet, 2);
                favorite(tweet);
                follow(tweet);
            }
        }
    }

});

//
// Naive blacklist, based on regex
var blacklist = new RegExp([
    'bootstrap',
    'portfolio',
    '\.amazon\.com\/',
    'meeting',
    'meetup',
    'java',
    'python',
    'ruby',
    'php'
    
].join('|'), 'i');

// Naive blacklist, based on regex
var whitelist = new RegExp([
    'free',
    'gratis',
    'grátis',
    'learning',
    'aprenda',
    'aprendendo',
    'learncode',
    'learntocode',
    'learningcode',
    'learn',
    'aprender',
    'beginners',
    'beginner',
    'iniciante',
    'iniciantes',
    'course',
    'curso',
    'tutorials',
    'tutorial',
    'discount',
    'desconto'
].join('|'), 'i');

var user_blacklist = new RegExp([
    'javascriptisez',
    'great_courses',
    'amazing_courses',
    'adstweetbot',
    'webcodegeeks',
    'docker'
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

    setTimeout(fn.bind(this, arg, count), randomMsBetween((1000 * 60 * 60 * 1), (1000 * 60 * 60 * 1.5)));
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
       // Desnecessario, por retweets estarem removidos do criterio 
        if(data.retweeted_status) {
            console.log('****** data.retweeted_status.created_at'); 
            created_at = data.retweeted_status.created_at; 
        } else {
            created_at = data.created_at;
        }
       
       if (!isTweetDateToday()) {
           console.log('******** POST ANTIGO -->', created_at);
           return ;
        }



        console.log('Date:',  created_at);
        console.log('count (arg) -->', count);
        console.log('data.retweet_count -->', data.retweet_count);

        if(data.retweet_count >= count) { 

            console.log('******** Retweeting !!!');
            console.log('retweet_count -->', data.retweet_count);

            console.log('******** Search alternative date', data);

            T.post('statuses/retweet/:id', { id: tweet.id_str }, cb);
        }
        
        function isTweetDateToday() {
            var today = moment().locale('en');
            return today.isSame(new Date(created_at), 'day');
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
// MongoClient.connect('mongodb://localhost:27017/' + dbName, function(err, db) {
//     if(err) {
//         console.log('ERROR: Cannot connect to mongo, tweets will not be logged');
//     } else {
//         console.log('Connected to mongo');
//         tweetDb = db;
//         tweetColl = db.collection(collectionName);
//     }
// });
//
// //Gracefully handle SIGINT
// process.on( 'SIGINT', function() {
//     console.log( "\nGracefully shutting down from SIGINT (Ctrl-C)" );
//     if(tweetDb) {
//         tweetDb.close();
//     }
//     if(stream){
//         stream.stop();
//     }
//
//     process.exit();
// });
