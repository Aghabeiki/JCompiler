const dataModel = require('./dataModelsLoader');
const JCompiler = require('../index');

// example for device join with bookings
// all android devices that travel to bangkok
// all android devices that travel to bangkok ,

let jCompiler = new JCompiler({

        'device': {
            gender: {
                eql: 'man'
            }
        },
        'booking': {
            passenger_count: {
                between: [1, 3]
            }
        }
    },
    {
        "en-us":
            {
                "title":
                    "this is a test message.",
                "subtitle":
                    "this is a test with var firstname {*firstname*}",
                "message":
                    "this is a test with var lastname {*lastname*}, firstname,{*firstname*}",
                "action":
                    "",
                "display":
                    true,
                "button_text":
                    "",
                "button_url":
                    "",
                "image_url":
                    ""
            }
    }
    )
;


dataModel((err, models) => {
        if (err) {
            console.log('waterline not loaded ' + err.message);
        }
        else {

            try {
                console.log('jCompiler start working ')
                jCompiler.loadPNS(models, '.collections')
                    .then(results => {
                        "use strict";
                        let res = results.map(res => {
                            return res.push_token
                        })
                        console.dir(res)
                        console.log(res.length);
                        process.exit(0);
                    })
                    .catch((err) => {
                        "use strict";
                        console.log(err);
                        process.exit(1);
                    })
            }
            catch (e) {
                console.log(e.message)
            }


        }
    }
)


