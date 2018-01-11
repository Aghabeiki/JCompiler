'use strict';

const _target = new WeakMap();
const _content = new WeakMap();
const momentJS = require('moment');
const _ = require('lodash');
const tz = require('countryjs');
const parser = require('./lib/Parser').
  getInstance();
const commons = require('./lib/Commons').
  getInstance();

/**
 *
 * @param {String} operands
 * @param {Array} values
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
 * @typedef {Object} JSONTargetObject
 * @typedef {Object} JSONContentObject
 *
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
  loadPNS(sails, prefix = '') {
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
    const deepLinkPreprocessor = [];
    const extraTables = new Set();

    flightFilter = bookingFilter = deviceFilter = emptyRule;

    if (topKey.indexOf('device') !== -1) {
      // add the device data models to function body
      deviceRules = parser.loadConditions(target['device'],
        new Function('rules', 'return rules.config.isDevice'));
      if (Object.keys(deviceRules.inDeep).length) {
        inDeepRules.push(...deviceRules.inDeep);
      }
      if (deviceRules.extraTables.length) {
        deviceRules.extraTables.forEach(item => extraTables.add(item));
      }
      if (Object.keys(deviceRules.deepLink).length) {
        deepLinkPreprocessor.push(...deviceRules.deepLink);
      }
    }
    if (topKey.indexOf('flight') !== -1) {
      flightRules = parser.loadConditions(target['flight'],
        new Function('rules', 'return rules.config.isFlight'));
      if (Object.keys(flightRules.inDeep).length) {
        inDeepRules.push(...flightRules.inDeep);
      }
      if (flightRules.extraTables.length) {
        flightRules.extraTables.forEach(item => extraTables.add(item));
      }
      if (Object.keys(flightRules.deepLink).length) {
        deepLinkPreprocessor.push(...flightRules.deepLink);
      }
    }
    if (topKey.indexOf('booking') !== -1) {
      bookingRules = parser.loadConditions(target['booking'],
        new Function('rules', 'return rules.config.isBooking'));
      if (Object.keys(bookingRules.inDeep).length) {
        inDeepRules.push(...bookingRules.inDeep);
      }
      if (bookingRules.extraTables.length) {
        bookingRules.extraTables.forEach(item => extraTables.add(item));
      }
      if (Object.keys(bookingRules.deepLink).length) {
        deepLinkPreprocessor.push(...bookingRules.deepLink);
      }
    }
    const that = this;
    const orchestra = async () => {
      let res = [];

      try {
        const normalVerbs = Array.from(extraTables);
        const extraInfo = (await Promise.all(normalVerbs.map(
          tableName => new Function('sails', `return sails${prefix}.${tableName.toLowerCase()}`).call(that, sails).
            find()
        ))).reduce((p, v, index) => {
          p[normalVerbs[index]] = v;

          return p;
        }, {});

        // update the rules.

        deviceFilter = obj => commons.validator.ruleDateValidator(obj, deviceRules.dateTime || {});

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
        let PNSs = devices.filter(device => {
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

        deepLinkPreprocessor.forEach(rules => {
          // check op1 & op2
          const op1 = rules.config;
          const op2 = Object.keys(rules.value).
            filter((undefined, index) => index === 0).
            // Skip all operands expect first one.
            reduce((p, v) => {
              if (_.isObject(rules.value[v]) && typeof rules.value[v].target === 'string') {
                p = commons.commons.getVerbConfig(rules.value[v].target);
              }
              else {
                p = rules.value[v];
              }

              return p;
            }, {});
          const operand = Object.keys(rules.value)[0]; // Skip all operands expect first one.
          // Resolve the OPs
          let OP2Value = null;

          if (op2.target && (op2.target.hasOwnProperty('shouldPreProcessed') &&
              typeof op2.target.shouldPreProcessed === 'boolean' && op2.target.shouldPreProcessed)) {
            // do something

            const [table, filed, ...join] = op2.target.maps;

            OP2Value = {
              targetTable: table.replace('T_', ''),
              targetFiled: filed.replace('F_', ''),
              map: {},
            };
            commons.commons.chunkArray(join, 3).
              forEach((parts, index) => {
                const [destinationField, table, field] = parts;

                extraInfo[table.replace('T_', '')].forEach(row => {
                  if (!index) {
                    OP2Value.map[row[destinationField.replace('F_', '')]] = row[field.replace('F_', '')];
                  }
                  else {
                    const objectKeys = Object.keys(OP2Value.map);

                    for (let i = 0; i < objectKeys.length; i++) {
                      if (OP2Value.map[objectKeys[i]] === row[destinationField.replace('F_', '')]) {
                        OP2Value.map[objectKeys[i]] = row[field.replace('F_', '')];
                      }
                    }
                  }
                });
              });
          }
          else {
            OP2Value = op2;
          }

          if (op1.shouldPreProcessed) {
            /* todo I disable this part because right now I dent have any deep link in device.
            if( op1.isDevice){
              // do device processing
            }*/

            /* Two first is table and base filed from the baseSelector and the rest
               is join table , each join have 3 part , so split the join tables to 3 base chunks.
             */
            let secondParts = selectOperands(operand, OP2Value);
            const [targetTable, baseFiled, ...joinedTables] = rules.config.maps;

            commons.commons.chunkArray(joinedTables, 3).
              reverse().
              reduce((p, v) => {
                const [destinationField, table, searchField] = v.
                  map(item => item.replace('T_', '').
                    replace('F_', ''));

                if (extraInfo[table]) {
                  const filtering = part => {
                    let res = false;

                    if (typeof secondParts === 'string' ||
                      typeof secondParts === 'number' ||
                      typeof secondParts === 'boolean') {
                      res = part[searchField] == secondParts; // eslint-disable-line eqeqeq
                    }
                    else {
                      res = false;
                    }

                    return res;
                  };

                  secondParts = extraInfo[table].
                    filter(filtering).
                    // Run the rules.
                    reduce((p, v, index, array) => { // Format the results.
                      p.push(v[destinationField]);
                      if (array.length === index + 1) {// Collapse the results.
                        p = Array.from(new Set(p));
                        if (p.length === 1) {
                          p = p[0];
                        }
                      }

                      return p;
                    }, []);
                }
              }, []);

            // Filter PNS based the new rules and update it.

            const myCompare = (val1, val2) => {
              let res = false;
              const typeOfVal2 = typeof val2;

              if (Array.isArray(val2)) {
                res = val2.indexOf(val1) !== -1;
              }
              else if (['string', 'number', 'boolean'].indexOf(typeOfVal2) !== -1) {
                res = val1 == val2;// eslint-disable-line eqeqeq
              }

              return res;
            };

            PNSs = PNSs.filter(pns => {
              let baseSelector = pns;
              let byPassed = false;

              switch (targetTable.replace('T_', '')) {
                case 'flights':
                  baseSelector = baseSelector.anyFlights;
                  break;
                case 'bookings':
                  baseSelector = baseSelector.anyBooking;
              }
              for (let i = 0; i < baseSelector.length && !byPassed; i++) {
                byPassed = myCompare(baseSelector[i][baseFiled.replace('F_', '')], secondParts);
              }

              return byPassed;
            });
          }// End of OP1 deep processing.
          else { // OP2 processing
            const filter = (pns => {
              const currentOp1Value = parser.extractValue(op1.maps[0], op1.maps[1], pns);
              const currentOp2Value = parser.extractValue(OP2Value.targetTable, OP2Value.targetFiled, pns);

              return commons.validator.logicalConfirmDeepMap(currentOp1Value, currentOp2Value, operand, OP2Value.map);
            });

            PNSs = PNSs.filter(filter);
          }
        });// End of deep link processing.

        inDeepRules.forEach(rule => {
          PNSs = PNSs.filter(pns => {
            const currentOP1Value = parser.extractValue(rule.maps[0], rule.maps[1], pns);
            const operand = Object.keys(rule.rules)[0];
            const currentOP2Value = parser.extractValue(rule.rules[operand][0], rule.rules[operand][1], pns);

            return commons.validator.logicalConfirmDeepMap(currentOP1Value, currentOP2Value, operand);
          });
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
                    if (val !== undefined && val !== null && commons.validator.isValidDate(val)) {
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
