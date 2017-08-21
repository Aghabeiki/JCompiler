const dataModel = require('./dataModelsLoader');
const JCompiler = require('../index');

// example for device join with bookings
// all android devices that travel to bangkok
// all android devices that travel to bangkok ,

let jCompiler = new JCompiler({
    device: {
        device_type: {
            eql: 'android'
        },
        country: {
            eql:'my'
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
            console.log('waterline not loaded ' + err.message);
        }
        else {

            try {
                console.log('jCompiler start working ')
                jCompiler.waterlineQueryFunctionBuilder('.collections').call(this, models, (err, rawPNSList) => {
                    "use strict";
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log('res:\n');
                        console.dir(rawPNSList);
                        console.log('\n')

                    }
                    console.log('jCompiler end;')
                    process.exit(1);
                })
            }
            catch (e) {
                console.log(e.message)
            }


        }
    }
)


