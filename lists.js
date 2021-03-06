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
    'mongodb',
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

var htmlPattern = new RegExp(
    html.join('|'), 'i'
);

var html = [
    'html5',
    'css3',
    'webcomponent',
    'webcomponents',
    'web components',
    'web component'
];

var urlBlacklist = [
    'reddit'
];

var urlBlacklistPattern = new RegExp(
   urlBlacklist.join('|'), 'i' 
);

module.exports = {
    program: program,
    html: html ,
    htmlPattern: htmlPattern,
    urlBlacklist: urlBlackList,
    urlBlacklistPattern: urlBlacklistPattern
};

