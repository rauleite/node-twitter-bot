var moment = require('moment');
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
    // var newMoment = moment(str3);
    // console.log(m.isBefore(date, 'day'));
    // console.log('date', date.toString());
    // console.log('m', m.toString());
    console.log(moment().isSame(new Date(str2), 'day'));
}, 1000);

