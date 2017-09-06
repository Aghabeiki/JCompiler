const dataModel = require('./dataModelsLoader');
const JCompiler = require('../index');

// example for device join with bookings
// all android devices that travel to bangkok
// all android devices that travel to bangkok ,
let jCompiler = null;
try {
    jCompiler = new JCompiler({
            'device': {
                passport_expiry: {
                    next: {
                        val:'10 years'
                    }
                }
            }/*,
            'booking': {
                passenger_count: {
                    between: [1, 4]
                }
            }*/
        },
        {
            "en-us":
                {
                    "title":
                        "this is a test message.{*child_count*}",
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

}
catch (e) {
    console.log(e.message)
    process.exit(1);
}


function parseHrtimeToSeconds(hrtime) {
    var seconds = (hrtime[0] + (hrtime[1] / 1e9)).toFixed(3);
    return seconds;
}

dataModel((err, models) => {
        if (err) {
            console.log('waterline not loaded ' + err.message);
        }
        else {

            try {
                console.log('jCompiler start working ')
                var start = process.hrtime();
                jCompiler.loadPNS(models, '.collections')
                    .then(results => {
                        "use strict";

                        console.dir(results)
                        console.log(results.length);
                        var seconds = parseHrtimeToSeconds(process.hrtime(start));
                        console.log('jCompiler takes ' + seconds + ' seconds');
                        process.exit(0);
                    })
                    .catch((err) => {
                        "use strict";
                        console.log(err);
                        process.exit(1);
                    })
            }
            catch (e) {
                console.dir(e)
            }


        }
    }
)


