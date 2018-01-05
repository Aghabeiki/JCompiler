'use strict';

const _target = new WeakMap();
const _content = new WeakMap();
const momentJS = require('moment');
const tz = require('countryjs');
const parser = require('./lib/Parser').
  getInstance();
const commons = require('./lib/Commons').
  getInstance();
const isValidDate = function(target) {
  const d = new Date(target);

  if (Object.prototype.toString.call(d) === '[object Date]') {
    // it is a date
    if (isNaN(d.getTime())) { // d.valueOf() could also work
      // date is not valid
      return false;
    }
    else {
      // date is valid
      return true;
    }
  }
  else {
    // not a date
    return false;
  }
};
const generalCompare = (obj, rules) => (commons.validator.ruleGeneralValidator(obj, rules.general) &&
  commons.validator.ruleDateValidator(obj, rules.dateTime));
let Handler = null;

/**
 * The JCompiler Main Object
 *
 * @description this object get the target ( search condition)
 *              and the content ( select rows ) and generate
 *              the query for waterlines and load data
 *
 * @param {JSONTargetObject} target - the target search
 * @param {JSONContentObject} content - the selected column */
class JCompiler {
  /**
   *
   * @param {json} target
   * @param {json} content
   */
  constructor(target, content) {
    Handler = this;
    this.target = parser.rawTargetParser(target);
    this.content = parser.rawContentParser(content);
  }

  /**
   * @desc target getter
   * @return {JSON}
   */
  get target() {
    return _target.get(Handler);
  }

  /**
   * @desc target setter
   * @param {JSON} value
   */
  set target(value) {
    _target.set(Handler, value);
  }

  /**
   * @desc content getter
   * @return {json}
   */
  get content() {
    return _content.get(Handler);
  }

  /**
   * @descn content setter
   * @param {json} value
   */
  set content(value) {
    _content.set(Handler, value);
  }

  /**
   * @param {T} sails
   * @param {string} prefix
   * @return {Promise}
   */
  loadPNS(sails, prefix) {
    if (!prefix) {
      prefix = '';
    }
    const functionBody = 'return sails' + prefix + '.devices';

    let deviceRules = {general: {}};
    let flightRules = null,
      bookingRules = null;
    let flightFilter,
      bookingFilter,
      deviceFilter;
    const emptyRule = () => true;
    const target = this.target;
    const topKey = Object.keys(target);
    const inDeepRules = [];

    flightFilter = bookingFilter = deviceFilter = emptyRule;

    if (topKey.indexOf('device') !== -1) {
      // add the device data models to function body
      deviceRules = parser.loadConditions(target['device'],
        new Function('rules', 'return rules.config.isDevice'));
      if (Object.keys(deviceRules.inDeep).length) {
        inDeepRules.push(deviceRules.inDeep);
      }
    }
    if (topKey.indexOf('flight') !== -1) {
      flightRules = parser.loadConditions(target['flight'],
        new Function('rules', 'return rules.config.isFlight'));
      if (Object.keys(flightRules.inDeep).length) {
        inDeepRules.push(flightRules.inDeep);
      }
    }
    if (topKey.indexOf('booking') !== -1) {
      bookingRules = parser.loadConditions(target['booking'],
        new Function('rules', 'return rules.config.isBooking'));
      if (Object.keys(bookingRules.inDeep).length) {
        inDeepRules.push(bookingRules.inDeep);
      }
    }

    const that = this;
    const orchestra = async () => {
      let res = [];

      try {
        // Load extra tables.
        // convert inDeepRules to required tables.
        const extraTables = [];

        inDeepRules.forEach(part => {
          part.extraTables.forEach(requiredFiled => {
            extraTables.push(requiredFiled[0]);
          });
        });
        // todo should support multi level call.
        const extraInfo = (await Promise.all(extraTables.map(
          tableName => new Function('sails', `return sails${prefix}.${tableName.toLowerCase()}`).call(that, sails).
            find()
        ))).reduce((p, v, index) => {
          p[extraTables[index]] = v;

          return p;
        }, {});
        /**
         *
         * @param {string} route
         * @param {array} lists
         * @return {array}
         */
        const extractValue = (route, lists) => [
          ...lists.reduce((p, v) => {
            p.add(v[route]);

            return p;
          }, new Set())];
        /**
         *
         * @param {string} operands
         * @param {string} values
         * @return {{}}
         */
        const selectOperands = (operands, values) => {
          let rule = {};

          switch (operands) {
            case 'eql':
              if (values.length === 1) {
                // Simple equal.
                rule = values[0];
              }
              else if (values.length > 1) {
                // In a list.
                rule = values;
              }
              else {
                // Not valid at all( null).
                rule = null;
              }

              break;
          }

          return rule;
        };
        const ruleMapper = (rule, extraInfo) => {
          const operands = Object.keys(rule)[0];// We accept only one operands.
          const values = extractValue(rule[operands][1], extraInfo[rule[operands][0]]);

          return selectOperands(operands, values);
        };
        // Alter the rules.

        inDeepRules.forEach(({rules}) => {
          Object.keys(rules).
            forEach(mainGroup => {
              switch (mainGroup) {
                case 'devices':
                  Object.keys(rules[mainGroup]).
                    forEach(filed => {
                      deviceRules.general[filed] = ruleMapper(rules[mainGroup][filed], extraInfo);
                    });

                  break;
              }
            });
        });
        // update the rules.

        deviceFilter = obj => commons.validator.ruleDateValidator(obj, deviceRules.dateTime);

        if (flightRules) {
          flightFilter = obj => generalCompare(obj, flightRules);
        }
        if (bookingRules) {
          bookingFilter = obj => generalCompare(obj, bookingRules);
        }

        const devices = await (new Function('sails', functionBody).call(that,
          sails).
          find({where: deviceRules.general}).
          populate(['anyFlights', 'anyBooking']));
        const PNSs = devices.filter(device => {
          let out;

          if (!deviceFilter(device)) {
            out = false;
          }
          else {
            out = true;
            if (flightFilter !== emptyRule) {
              out = out && device.anyFlights.filter(flightFilter).length !== 0;
            }
            if (bookingFilter !== emptyRule) {
              out = out && device.anyBooking.filter(bookingFilter).length !== 0;
            }
          }

          return out;
        });

        res = PNSs.map(PNS => {
          const tmp = {};

          tmp.pnsID = PNS.push_token;
          tmp.lang = PNS.device_locale || 'en-us';
          let params;

          if (PNS.device_locale !== undefined && PNS.device_locale !== null &&
            Handler.content[PNS.device_locale.toLowerCase()] !==
            undefined) {
            params = Handler.content[PNS.device_locale.toLowerCase()];
          }
          else if (Handler.content['en-us'] !== undefined) {
            params = Handler.content['en-us'];
          }
          else {
            params = Handler.content[Object.keys(Handler.content)[0]];
          }
          tmp.params = {};
          Object.keys(params).
            map(key => params[key]).
            reduce((p, v) => {
              v.forEach(param => {
                if (p.filter(key => key.name === param.name).length !== 1) {
                  p.push(param);
                }
              });

              return p;
            }, []).
            forEach(param => {
              let val = '';

              switch (param.target.maps[0]) {
                case 'devices':
                  val = PNS[param.target.maps[1]];
                  try {
                    if (val !== undefined && val !== null && isValidDate(val)) {
                      tz.timezones(PNS.country);

                      if (PNS.latitude !== null && PNS.latitude !== undefined) {
                        const tzwhere = require('tzwhere');

                        tzwhere.init();
                        const min = tzwhere.tzOffsetAt(PNS.latitude,
                          PNS.longitude) / 60000;

                        val = momentJS(val).
                          utcOffset(min).
                          format('DD-MMM-YYYY hh:mm A');
                      }
                      else if (tz !== undefined && tz !== null &&
                        tz.length >= 0) {
                        val = momentJS(val).
                          utcOffset(tz[0].replace('UTC', '')).
                          format('DD-MMM-YYYY hh:mm A');
                      }
                      else {
                        val = momentJS(val).
                            format('DD-MMM-YYYY hh:mm A') +
                          ' (in UTC timezone) ';
                      }
                    }
                  }
                  catch (err) {
                    console.log(err);// eslint-disable-line no-console
                  }
                  break;
                case 'flights':
                  val = PNS.anyFlights.reduce((p, v, i, arr) => p + (i != 0 ? ',' : '') + v[param.target.maps[1]],
                    '');
                  break;
                case 'bookings':
                  val = PNS.anyBooking.reduce((p, v, i, arr) => p + (i != 0 ? ',' : '') + v[param.target.maps[1]],
                    '');
                  break;
                default:
                  val = 'NotFound';
                  break;
              }
              tmp.params[param.name] = val;
            });

          return tmp;
        });
      }
      catch (err) {
        res = err;
      }

      return res;
    };

    return new Promise((resolve, reject) => {
      orchestra().
        then(res => {
          if (res instanceof Error) {
            reject(res);
          }
          else {
            resolve(res);
          }
        }).
        catch(err => {
          reject(err);
        });
    });
  }
}

module.exports = JCompiler;
