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
/**
 * Returns an array with arrays of the given size.
 *
 * @param {Array} myArray  Array to split
 * @param {Integer} chunkSize  Size of every group
 * @return {[Array]}
 */
const chunkArray = (myArray, chunkSize) => {
  const results = [];

  while (myArray.length) {
    results.push(myArray.splice(0, chunkSize));
  }

  return results;
};
/**
 *
 * @param {String} table Table name.
 * @param {String} field Filed name.
 * @param {Object} rootObject
 * @return {T}  An array or String,Number,Boolean or date or Object
 */
const extractValue = (table, field, rootObject) => {
  let currentVal = null;

  switch (table) {
    case 'devices':
      currentVal = rootObject[field];
      break;
    case 'flights':
      currentVal = rootObject.anyFlights.map(flight => flight[field]);
      break;
    case 'bookings':
      currentVal = rootObject.anyBooking.map(booking => booking[field]);
      break;
  }

  return currentVal;
};
/**
 *
 * @param {T|Array} val1 The first value.
 * @param {T|Array} val2 The second value.
 * @param {String} op The operand for compare.
 * @param {Object} mapper the map guide for map first val to second  val;
 * @return {Boolean}
 */
const logicalConfirmDeepMap=(val1, val2, op, mapper)=>{
  if (!val1 || !val2 ) {
    // If any of val is null return false.

    return false;
  }

  let res=false;
  const mappedVal2=Array.isArray(val2)? val2.map(key=>mapper[key]): mapper[val2];

  switch (op) {
    case 'eql':
      if (Array.isArray(val1) && Array.isArray(mappedVal2)) {
        res = val1.some(key=>mappedVal2.indexOf(key)!==-1);
      }
      else if (Array.isArray(val1) && !Array.isArray(mappedVal2)) {
        res = val1.some(key=>key===mappedVal2);
      }
      else if (!Array.isArray(val1) && Array.isArray(mappedVal2)) {
        res = mappedVal2.some(key=> key===val1);
      }
      else {
        res = mappedVal2 === val1;
      }
      break;
  }

  return res;
};

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
/**
 *
 * @param {Object} rule
 * @param {Object} extraInfo
 * @return {{}}
 */
const ruleMapper = (rule, extraInfo) => {
  const extractFromTableInfoValue = (route, lists) => [
    ...lists.reduce((p, v) => {
      p.add(v[route]);

      return p;
    }, new Set())];
  const operands = Object.keys(rule)[0];// We accept only one operands.
  const values = extractFromTableInfoValue(rule[operands][1], extraInfo[rule[operands][0]]);

  return selectOperands(operands, values);
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
    const extraTables = [];

    flightFilter = bookingFilter = deviceFilter = emptyRule;

    if (topKey.indexOf('device') !== -1) {
      // add the device data models to function body
      deviceRules = parser.loadConditions(target['device'],
        new Function('rules', 'return rules.config.isDevice'));
      if (Object.keys(deviceRules.inDeep).length) {
        inDeepRules.push(deviceRules.inDeep);
      }
      if (deviceRules.extraTables.length) {
        extraTables.push(...deviceRules.extraTables);
      }
      if (Object.keys(deviceRules.deepLink).length) {
        deepLinkPreprocessor.push(...deviceRules.deepLink);
      }
    }
    if (topKey.indexOf('flight') !== -1) {
      flightRules = parser.loadConditions(target['flight'],
        new Function('rules', 'return rules.config.isFlight'));
      if (Object.keys(flightRules.inDeep).length) {
        inDeepRules.push(flightRules.inDeep);
      }
      if (flightRules.extraTables.length) {
        extraTables.push(...flightRules.extraTables);
      }
      if (Object.keys(flightRules.deepLink).length) {
        deepLinkPreprocessor.push(...flightRules.deepLink);
      }
    }
    if (topKey.indexOf('booking') !== -1) {
      bookingRules = parser.loadConditions(target['booking'],
        new Function('rules', 'return rules.config.isBooking'));
      if (Object.keys(bookingRules.inDeep).length) {
        inDeepRules.push(bookingRules.inDeep);
      }
      if (bookingRules.extraTables.length) {
        extraTables.push(...bookingRules.extraTables);
      }
      if (Object.keys(bookingRules.deepLink).length) {
        deepLinkPreprocessor.push(...bookingRules.deepLink);
      }
    }

    const that = this;
    const orchestra = async () => {
      let res = [];

      try {
        /* If map have 2 parts , it mean we have normal verbs
           * in the normal verbs, the first part is the table.
           * if the map have more then 2 parts, it mean we have to deep link verbs
           * so need more process.
           */
        const normalVerbs = extraTables.filter(tables => tables.length === 2).
          map(tables => tables[0]);

        extraTables.filter(tables => tables.length > 2).
          reduce((p, v) => {
            v.forEach(item => {
              if (item.startsWith('T_') && p.indexOf(item.replace('T_', '')) === -1) {
                p.push(item.replace('T_', ''));
              }
            });
          }, normalVerbs);

        const extraInfo = (await Promise.all(normalVerbs.map(
          tableName => new Function('sails', `return sails${prefix}.${tableName.toLowerCase()}`).call(that, sails).
            find()
        ))).reduce((p, v, index) => {
          p[normalVerbs[index]] = v;

          return p;
        }, {});

        // Alter the rules.

        inDeepRules.forEach(rules => {
          Object.keys(rules).
            forEach(mainGroup => {
              switch (mainGroup) {
                case 'devices':
                  Object.keys(rules[mainGroup]).
                    forEach(filed => {
                      deviceRules.general[filed] = ruleMapper(rules[mainGroup][filed], extraInfo);
                    });

                  break;
                case 'flights':
                  Object.keys(rules[mainGroup]).
                    forEach(filed => {
                      flightRules.general[filed] = ruleMapper(rules[mainGroup][filed], extraInfo);
                    });

                  break;
                case 'bookings':
                  Object.keys(rules[mainGroup]).
                    forEach(filed => {
                      bookingRules.general[filed] = ruleMapper(rules[mainGroup][filed], extraInfo);
                    });

                  break;
              }
            });
        });

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
            chunkArray(join, 3).
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

            chunkArray(joinedTables, 3).
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
              const currentOp1Value=extractValue(op1.maps[0], op1.maps[1], pns);
              const currentOp2Value=extractValue(OP2Value.targetTable, OP2Value.targetFiled, pns);

              return logicalConfirmDeepMap(currentOp1Value, currentOp2Value, operand, OP2Value.map);
            });

            PNSs = PNSs.filter(filter);
          }
        });// End of deep link processing.

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
