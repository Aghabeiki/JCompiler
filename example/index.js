const dataModel = require('./dataModelsLoader');
const JCompiler = require('../index');

// example for device join with bookings
// all android devices that travel to bangkok
// all android devices that travel to bangkok ,

let jCompiler = new JCompiler({
    device: {
        device_type: {
            eql: 'android'
        }
    }
}, {
    "en-us": {
        "title": "this is a test message.",
        "subtitle": "this is a test with var firstname {*firstname*}",
        "message": "this is a test with var lastname {*lastname*}, firstname,{*firstname*}",
        "action": "",
        "display": true,
        "button_text": "",
        "button_url": "",
        "image_url": ""
    }
});
dataModel((err, models) => {
        if (err) {
            throw new Error('waterline not loaded');
        }
        else {

            jCompiler.waterlineQueryFunctionBuilder('.collections').call(this, models, (err, rawPNSList) => {
                "use strict";
                if (err) {
                    console.log(err);
                }
                else {
                    console.dir(rawPNSList);
                    process.exit(1);
                }
            })

        }
    }
)


