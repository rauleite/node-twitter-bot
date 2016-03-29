var _ = require('lodash');

var self = {};

self.program = [
    'javascript',
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

self.html = [
    'html5',
    'css3',
    'webcomponent',
    'webcomponents',
    'web components',
    'web component'
];


self.htmlPattern = new RegExp(
    self.html.join('|'), 'i'
);

self.lightWhitelist = [
    'docker',
    'udemy'
];

self.lightWhitelistPattern = new RegExp(
   self.lightWhitelist.join('|'), 'i' 
);

self.textRank = {
    'docker': 3,
    'udemy': 3,
    'portfolio': 0,
    '.amazon\\.com/': 0,
    'meeting': 0,
    'meetup': 0,
    'java\\s': 0,
    'python': 0,
    'ruby': 0,
    'rails': 0,
    'php': 0,
    'laravel': 0,
    'of course': 0,
    '\\d+% off.*udemy.*$': 0

};

self.userRank = {
    'javascriptisez': 0,
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
    // UDEMY
    'cheapocourses__': 0,
    'cheap_courses_': 0,
    // Abizy
    'AdamSmitht1': 0

};
// (?!https\:\/\/twitter.com.*|http\:\/\/twitter.com.*|.*https\:\/\/stackoverflow.com.*|.*http\:\/\/stackoverflow.com.*|http\:\/\/.*\.(png|jpg|jpeg|gif))(https.*|http.*)
self.urlExceptions = [
    '(?!',
    'https://twitter.com.*',
    '|',
    'http://twitter.com.*',
    
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

// self.textBlacklistPattern = new RegExp ([
// ].join('|'), 'i');

// Naive blacklist, based on regex
// self.blacklist = new RegExp([
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

// Se além do whitelist, tiver um textBias, reduz atributos retweet do post
self.textBias = [
    'discount',
    'free',
    'game',
    'big data',
    'machine learning',
    'internet of things',
    'neural network',
    'data mining',
    'video',
    'youtube'
];
// Naive blacklist, based on regex
self.textWhitelist = [
    'basics about',
    'beginners',
    'beginner',
    'Building a',
    'course',
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

self.textWhitelistPattern = self.textWhitelist.join('|');
self.textBiasPattern = self.textBias.join('|');

self.empregos_whitelist = new RegExp([
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


module.exports = self;

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


