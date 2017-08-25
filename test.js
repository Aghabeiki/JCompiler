let moment = require('moment');


for (let i = 1; i < 13; i++) {
    let str = "2017/"
    if (i < 10) {
        str += ('0' + i.toString());
    }
    else {
        str += i.toString();
    }
    str += '/02';
    console.log('me', str);
    let d = new Date(str).toISOString();
    let c = moment(d).utc();
    console.log(d, c.month(), c.toISOString())

}
