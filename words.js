var _ = require('lodash');
var program = [
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

var html = [
    'html5',
    'css3',
    'webcomponent',
    'webcomponents',
    'web components',
    'web component'
];


var htmlPattern = new RegExp(
    html.join('|'), 'i'
);

var lightWhitelist = [
    'docker',
    'udemy'
];

var lightWhitelistPattern = new RegExp(
   lightWhitelist.join('|'), 'i' 
);

var userBlacklist = [
    'javascriptisez',
    'great_courses',
    'amazing_courses',
    'adstweetbot',
    'webcodegeeks',
    'javacodegeeks',
    'prometeonet',
    'docker',
    'MongoDB',
    '_ericelliott',
    'ReactJS_News',
    'AngularJS_News',
    'melhore_me',
    'creative_punch'
];

var userBlacklistPattern = new RegExp(userBlacklist.join('|'), 'i');

var _userBlacklistRT = _.map(userBlacklist, function(i) {
    return 'RT @' + i;
});

var userBlacklistRTPattern = new RegExp(_userBlacklistRT.join('|'));

var textBlacklistPattern = new RegExp ([
    '\d+%\soff.*udemy.*$'
].join('|'), 'i');

module.exports = {
    program: program,
    html: html ,
    htmlPattern: htmlPattern,
    lightWhitelist: lightWhitelist,
    lightWhitelistPattern: lightWhitelistPattern,
    userBlacklist: userBlacklist,
    userBlacklistPattern: userBlacklistPattern,
    userBlacklistRTPattern: userBlacklistRTPattern,
    textBlacklistPattern: textBlacklistPattern
    
};

