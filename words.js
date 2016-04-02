var _ = require('lodash');

var words = {};

words.program = [
    'javascript',
    'ES6 ',
    'TypeScript',
    // 'node',
    'nodejs',
    'node.js',
    'node_js',
    'node js',
    'angular js',
    'angular.js',
    'angularjs',
    'angular_js',
    'angular2',
    'angular2.0',
    'angular 2',
    'angularmaterial',
    'materialdesign',
    'angularmaterialdesign',
    'angular material',
    'angular material design',
    'material design',
    'expressjs',
    'express js',
    'express.js',
    'express_js',
    // 'mongodb',
    'rxjs',
    'reactjs',
    'react_js',
    'react.js',
    'react js',
    'fullstack dev',
    'fullstack developer',
    'fullstack mean',
    'mean dev',
    'mean developer',
    // 'mongoose',
    'phonegap',
    'ionic',
    'ionicframework',
    'ionic framework',
    'docker',
    // 'saas',
    // 'Karma',
    // 'Protractor',
    // 'Mocha',
    // 'Sinon',
    // 'Chai',
    'lodash',
    'webstorm'

];

words.html = [
    'html5',
    'css3',
    'webcomponent',
    'webcomponents',
    'web components',
    'web component'
];


words.htmlPattern = new RegExp(
    words.html.join('|'), 'i'
);

words.lightWhitelist = [
    'docker',
    'udemy'
];

words.lightWhitelistPattern = new RegExp(
   words.lightWhitelist.join('|'), 'i' 
);

// 0 - 10 --> 0 nao posta, 10 posta, 5 tem 50% chances (chance eh 5 de 10)
words.textRank = {
    'docker': 3,
    'eggheadio': 3,
    'udemy': 1,
    'python': 3,
    'course': 3,
    'portfolio': 0,
    '.amazon\\.com/': 0,
    'meeting': 0,
    'meetup': 0,
    'java\\s': 0,
    'ruby': 0,
    'rails': 0,
    'php': 0,
    'laravel': 0,
    'of.*course': 0,
    'weekly': 0,
    'daily': 0,
    'live.*in': 0,
    'workshop': 0,
    '\\d+% off': 0

};
// 0 - 10
words.userRank = {
    'eggheadio': 3,
    'javascriptisez': 0,
    'moderndevelopr': 0,
    'great_courses': 0,
    'amazing_courses': 0,
    'adstweetbot': 0,
    'webcodegeeks': 0,
    'javacodegeeks': 0,
    'prometeonet': 0,
    'docker': 0,
    'MongoDB': 0,
    '_ericelliott': 0,
    'ReactJS_News': 0,
    'AngularJS_News': 0,
    'melhore_me': 0,
    'creative_punch': 0,
    'JavascriptAgent': 0,
    // UDEMY
    'cheapocourses__': 0,
    'cheap_courses_': 0,
    'CouponsMonsters': 0,
    'EntrepreneurHlp': 0,
    'ameanmbot': 0,
    // Abizy
    'AdamSmitht1': 0,
    //Bots
    'javascriptbot_': 0

};

words.specialUsers = {
    'smashingmag': 15,
    'DZone': 5,
    'Medium': 15, 
    'littleBits': 6, 
    'scotch_io': 5,
    'RisingStack': 2,
    'codrops': 5,
    'speckyboy': 5,
    'DesignerDepot': 5,
    'html5': 5,
    'infoworld': 5,
    'stamplay': 3,
    'nodejs': 15,
    'learncodeacad': 2,
    'LevelUpTuts': 3,
    'newthinktank': 2,
    'bucky_roberts': 3,
    'codek_tv': 4
};

// (?!https\:\/\/twitter.com.*|http\:\/\/twitter.com.*|.*https\:\/\/stackoverflow.com.*|.*http\:\/\/stackoverflow.com.*|http\:\/\/.*\.(png|jpg|jpeg|gif))(https.*|http.*)
words.urlExceptions = [
    '(?!',
    'https://twitter.com.*',
    '|',
    'http://twitter.com.*',
     
    '|',
    '.*https://www.reddit.com/.*',
    '|',
    '.*http://www.reddit.com/.*',

    '|',
    '.*https://stackoverflow.com.*',
    '|',
    '.*http://stackoverflow.com.*',

    '|',
    '.*http://gettopical.com.*',
    '|',
    '.*https://gettopical.com.*',

    '|',
    'http://.*\\.(png|jpg|jpeg|gif))',

    '(https.*|http.*)'
    
].join('');

// Se além do whitelist, tiver um textBias, reduz atributos retweet do post
// 100% equivale a chance 100 de retweet (value 0). Nunca usar.
// 0% equivale, a valor inalterado.
// 50% equivale a soma da metade do seu proprio valor dele próprio
words.textBiasPercent = {
    'discount': 50,
    'free\\s ': 50,
    'game\\s': 50,
    'games\\s': 50,
    'gamedev': 50,
    'phaser': 50,
    'big.data': 50,
    'bigdata': 50,
    'machine.learning': 50,
    'machinelearning': 50,
    'internet.of.things': 50,
    'internetofthings': 50,
    'neural.network': 50,
    'neuralnetwork': 50,
    'data.mining': 50,
    'datamining ': 50,
    'video\\s': 50,
    'youtube\\s': 50,
    'Watch.Now': 50,
    'robotics': 50,
    'johnny.five': 50,
    'johnnyfive': 50,
    'arduino': 50
};

// Naive blacklist, based on regex
words.textWhitelist = [
    'basics about',
    'beginners',
    'beginner',
    'Building a',
    'free.*course',
    'getting started',
    'gettingstarted',
    'quick start',
    'quickstart',
    'How to',
    'Howto',
    'Intro to',
    'jumpstart',
    'learning',
    'learncode',
    'learntocode',
    'learningcode',
    'learn',
    'start coding',
    'startcoding',
    'Tips To Improve',
    'tutorials',
    'tutorial',
    'zero to hero',
    'zerotohero'
];

words.textWhitelistPattern = words.textWhitelist.join('|');

words.empregos_whitelist = new RegExp([
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


module.exports = words;

// module.exports = {
//     program: program,
//     html: html ,
//     htmlPattern: htmlPattern,
//     lightWhitelist: lightWhitelist,
//     lightWhitelistPattern: lightWhitelistPattern,
//     textBlacklistPattern: textBlacklistPattern,
//     textRank: textRank,
//     userRank: userRank
//     
// };
// userBlacklist: userBlacklist,
// userBlacklistPattern: userBlacklistPattern,
// userBlacklistRTPattern: userBlacklistRTPattern,

// var userBlacklist = [
//     'javascriptisez',
//     'great_courses',
//     'amazing_courses',
//     'adstweetbot',
//     'webcodegeeks',
//     'javacodegeeks',
//     'prometeonet',
//     'docker',
//     'MongoDB',
//     '_ericelliott',
//     'ReactJS_News',
//     'AngularJS_News',
//     'melhore_me',
//     'creative_punch'
// ];
//
// var userBlacklistPattern = new RegExp(userBlacklist.join('|'), 'i');

// words.textBlacklistPattern = new RegExp ([
// ].join('|'), 'i');

// Naive blacklist, based on regex
// words.blacklist = new RegExp([
//     // 'bootstrap',
//     'portfolio',
//     '.amazon.com/',
//     'meeting',
//     '.*meetup.*',
//     'java',
//     'python',
//     'ruby',
//     'rails',
//     'php',
//     'laravel',
//     'of course'
//     
// ].join('|'), 'i');


