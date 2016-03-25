var moment = require('moment');
var _ = require('lodash');
var str = '2016-03-12T11:31:41-03:00';
var str2 = '2016-04-12T22:31:45-03:00';
var str3 = 'Wed Jun 06 20:07:10 +0000 2012';
var date = new Date(str);

console.log(date);
// var date_tmp = moment('Wed Jun 06 20:07:10 +0000 2012', 'DD-MM-YYYY').format();

var m = moment(str, 'ddMMM DD HH:mm:ss ZZ YYYY', 'en');

var m = moment();

moment.locale('en');

setTimeout(function () {
    // console.log(moment().isSame(new Date(str2), 'day'));
}, 1);


// var r = new RegExp('(?!https\:\/\/twitter.com)(https|http)', 'i');
var result = /(?!https\:\/\/twitter.com)(https|http)/gi.test('http://twitter.com https://twitter.com ');
console.log(result);
// console.log(result ? true : false);
var text = '@nodejs,Judiciary has lost its independence. Hope of common man is gone  #BuhariIsADisaster #FreeNnamdiKanu';
var result2 = /(?!https\:\/\/twitter.com)(https|http)/g.test(text);

console.log(result2);



var urlNotTwitterPattern = /(?!https\:\/\/twitter.com|http\:\/\/twitter.com|http\:\/\/.*\.(png|jpg|jpeg|gif))(https|http)/g;
var urls = [
    {
        url:'https://twitter.com/googlecloud/status/690305876364763136'
    },
    {
        url:"http://creative-punch.net/2013/12/create-a-modern-flat-metro-style-menu-with-flip-effect-using-the-css3-transform-property"
        
        // url:'https://twitter.com/googlecloud/status/690305876364763136'
    },
    {
        url: 'http://bit.ly/1jZKmmI'
    }

];
var testUrl = _.filter(urls, function(o){
    console.log('-->', urlNotTwitterPattern.test(o.url));
    return urlNotTwitterPattern.test(o.url);
});

console.log(testUrl);


console.log('----------------- String in array ----------------------------');

var text = 'RT @KendrickColeman: get your learn on for free… Docker, CoreOS, Cloud Foundry, Kubernetes and OpenStack via @edXOnline  https://t.co/YM3Cw…';


// var text2 = 'RT @KendrickColeman: get your learn on for free… Docker, CoreOS, Cloud Foundry, Kubernetes and OpenStack via @edXOnline  https://t.co/YM3Cw…';

var text2 = 'RT get @KendrickColeman :yoaur learn  for free… Docker, CoreOS, on Cloud Foundry,  and OpenStack via Kubernete s@edXOnline  https://t.co/YM3Cw…';

var textArr = text.split(' ');
var textArr2 = text2.split(' ');

// console.log(textArr);


var index = 0;
var resultStringinArray = _.filter(textArr, function(i){
    // console.log('*** Primeiro Filter');
    return _.some(textArr2, function(j){
        // console.log('*** Primeiro Filter');
        // console.log('i', i);
        // console.log('j', j);
        if(i === undefined || j === undefined) return false;
        //
        if(i.toLowerCase() === j.toLowerCase()) {
            console.log('IGUAL', i);
            index = textArr2.indexOf(j);
            textArr2.splice(index, 1);
            // console.log('REMOVED');
            return true; 
        }
        

        return false; 
    }); 
});

console.log(resultStringinArray);

console.log(textArr.length);
console.log(textArr.length * 70 / 100);
console.log(resultStringinArray.length);
console.log(resultStringinArray.length >= textArr.length * 70 / 100);

console.log('--------------------------------- isEmpty ------------------------------');

var isEmpty = _.isEmpty([undefined]);
console.log('isEmpty', isEmpty);
