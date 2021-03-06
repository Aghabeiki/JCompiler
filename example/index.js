const dataModel = require('./dataModelsLoader');
const { JCompiler } = require('../index');

let jCompiler = null;

try {
  jCompiler = new JCompiler({
    device:{
      passport_expiry:{
        today:'today'
      }
    }

/*
      flight: {
        flight_number: {
          like: '2_5%'
        }
      }
*/
      /**
       * @tutorial like
       * device:{
       * email_address:{
       *    like:'%test.com'
       *   }
       * }
       */

      /**
       * @tutorial booking count in a month more then 1
       * booking: {
       * average_flight_per_month: {
       *    greaterThan: 1
       *  }
       * }
       */
      /**
       * @tutorial deepVerb normal rule.
       *
       *   flight:{
     *     destination_airport_city_name:{
     *       eql:'kuala lumpur'
     *     }
     *   }
       }*/


      /**
       * @tutorial deepLink and deepVerbs rule
       *
       *  device:{
    *    current_location_city_name:{
    *      eql:{
    *        target:"destination_airport_city_name"
    *      }
    *    }
    *  }
       */

      /**
       * @tutorial normal rules.
       *  device:{
  *    current_location_city_name:{
  *      eql:"kuala lumpur"
  *    },
  *    hometown: {
  *      eql:  "Mashhad"
  *    }
  *  }
       */

      /**
       *  @tutorial deepLink rule
       *   device: {
  *      current_location_city_name: {
  *      eql: {
  *        target: 'hometown',
  *      }
  *    },
  * },
       *
       * */

      /**
       * @tutorial special Date equalization. rule
       * 'device': {
    *            passport_expiry: {
    *                equalExactDate: {
    *                    specificDate:'2017-08-25 +08:00'
    *                }
    *            }
    *        }
       */
    },
    {
      'en-us':
        {
          'title':
            'Expire Date',
          'subtitle':
            'Hi {*firstname*}',
          'message':
            'Hi {*firstname*}, your passport expired at {*passport_expiry*}',
          'action':
            '',
          'display':
            true,
          'button_text':
            '',
          'button_url':
            '',
          'image_url':
            ''
        }
    }
  );
}
catch (e) {
  console.log(e.message);
  process.exit(1);
}

function parseHrtimeToSeconds (hrtime) {
  const seconds = (hrtime[ 0 ] + (hrtime[ 1 ] / 1e9)).toFixed(3);

  return seconds;
}

dataModel((err, models) => {
    if (err) {
      console.log('waterline not loaded ' + err.message);
    }
    else {
      try {
        console.log('jCompiler start working ');
        const start = process.hrtime();

        jCompiler.loadPNS(models, '.collections').
          then(results => {
            'use strict';

            console.dir(results);
            console.log(results.length);
            const seconds = parseHrtimeToSeconds(process.hrtime(start));

            console.log('jCompiler takes ' + seconds + ' seconds');
            process.exit(0);
          }).
          catch(err => {
            'use strict';
            console.log(err);
            process.exit(1);
          });
      }
      catch (e) {
        console.dir(e);
      }
    }
  }
);

