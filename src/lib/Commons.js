'use strict';

const verbs = require('./ValidVerbs');
const operands = require('./operands');
const _ = require('lodash');
const dateTypeVerbs = [
  'minutes',
  'hours',
  'days',
  'weeks',
  'months',
  'quarters',
  'years'];

let Handler = null;

/**
 * @classdesc Commons Library singleton.<br>
 *              <p>
 *               This class provide some commons libraries <br>
 *               <b>Note 1:</b> for call the method use the namespace<br>
 *              </p>
 * @class
 * @hideconstructor
 *
 */
class Commons {
  /**
   * @private
   */
  constructor() {
    /* eslint-disable no-extend-native*/
    String.prototype.replaceAll = function(search, replacement) {
      const target = this;

      return target.split(search).
        join(replacement);
    };
    Date.prototype.unix = function() {
      return Number.parseInt(this.getTime() / 1000);
    };
    /* eslint-enable no-extend-native*/
    Handler = this;
  }

  /**
   * @desc <p>namespace:<b>commons</b></p>
   * @example Commons.commons.replaceAll('test','t','') => `es`
   * @param {string} target
   * @param {string} search
   * @param {string} replacement
   * @return {string}
   */
  replaceAll(target, search, replacement) {
    return target.split(search).
      join(replacement);
  }

  /**
   * @desc <p>namespace:<b>validator</b></p><br><p> check for null, empty string, undefined and Object properties </p>
   * @example Commons.validator.isEmpty({}) => true
   * @param {Object} obj
   * @param {boolean} checkEmptyObject if set true will check the object has any properties default is enable
   * @return {boolean}
   */
  isEmpty(obj, checkEmptyObject) {
    if (checkEmptyObject === undefined) {
      checkEmptyObject = true;
    }

    return (obj === null || obj === '' || obj === undefined
      || ( checkEmptyObject && !Object.keys(obj).length ));
  }

  /**
   * @desc <p>namespace:<b>validator</b></p>
   * @example Commons.validator.isLanguageISO('en-us') => true
   * @param {string} lang - language code
   * @todo put the ISO code number for docs
   * @return {boolean} will be true if the language code match with ISO XXX
   */
  isLanguageISO(lang) {
    let output = true;

    try {
      const lcid = require('lcid');
      const formattedLCID = Object.keys(lcid.all).
        reduce((p, v) => {
          p[v.toUpperCase().
            replace('_', '-')] = lcid.all[v];

          return p;
        }, {});

      if (lang.split(';').
          reduce((p, v) => {
            const tmp = v.split(',').
              filter(vv => vv.length !== 0);

            tmp.forEach(vvv => {
              p.push(vvv.toUpperCase());
            });

            return p;
          }, []).
          filter(lang => formattedLCID[lang] !== undefined).length === 0) {
        throw new Error();
      }
    }
    catch (e) {
      output = false;
    }

    return output;
  }

  /**
   * @desc <p>namespace:<b>validator</b></p>
   * @param {string} verb
   * @return {boolean} will be true if the verb be in {@link verbList}
   */
  isValidVerb(verb) {
    return verbs[verb] !== undefined;
  }

  /**
   * @desc <p>namespace:<b>validator</b></p>
   * @param {string} key
   * @return {boolean}  will be true if the input be one of [user,bookings,location]
   */
  topKeyValidator(key) {
    let output = false;

    switch (key.toLowerCase()) {
      case 'device':
      case 'booking':
      case 'flight':
      case 'location':
        output = true;
        break;
    }

    return output;
  }

  /**
   * @desc <p>namespace:<b>parser</b></p><br><p><b>note:</b> the verbs in string should be in `{*VerbName*}`</p>
   * @param {string} sentences -
   * @return {*}
   */
  getVerbsInString(sentences) {
    // space splitter
    const vars = sentences.split(' ').
      reduce((p, v) => {
        // , splitter
        if (v.split(',').length !== 1) {
          v.split(',').
            forEach(parts => {
              p.push(parts);
            });
        }
        // ; splitter
        else if (v.split(';').length !== 1) {
          v.split(';').
            forEach(parts => {
              p.push(parts);
            });
        }
        // splitter
        else if (v.split('.').length !== 1) {
          v.split('.').
            forEach(parts => {
              p.push(parts);
            });
        }
        // ! splitter
        else if (v.split('!').length !== 1) {
          v.split('!').
            forEach(parts => {
              p.push(parts);
            });
        }
        // ? splitter
        else if (v.split('?').length !== 1) {
          v.split('?').
            forEach(parts => {
              p.push(parts);
            });
        }
        // : splitter
        else if (v.split(':').length !== 1) {
          v.split(':').
            forEach(parts => {
              p.push(parts);
            });
        }
        else {
          p.push(v);
        }

        return p;
      }, []).
      filter(parts => parts.match(/\{\*.*\*\}/g) !== null);

    if (!vars.length) {
      return [];
    }
    else {
      const filteredVars = vars.filter(part => {
        const tmp = part.replaceAll('*}', '').
          replaceAll('{*', '').
          toLowerCase();

        return Handler.isValidVerb(tmp);
      });

      if (!filteredVars.length) {
        throw new Error(' the var(s)' + JSON.stringify(vars) +
          ' is(are) not in the verb list');
      }
      else {
        return filteredVars.map(parts => {
          const tmp = Handler.replaceAll(Handler.replaceAll(parts, '*}', ''),
            '{*', '').
            toLowerCase();

          return {name: parts, target: verbs[tmp]};
        });
      }
    }
  }

  /**
   * @desc <p>namespace:<b>commons</b><p>
   * @param {string} verb name {@link verbList}
   * @return {JSON} verb config
   */
  getVerbConfig(verb) {
    return verbs[verb] || null;
  }

  /**
   * @desc <p>namespace:<b>validator</b><p>
   * @param {JSON} value
   * @param {JSON} acceptableOperands
   * @return {boolean} true if the requested operands match all with acceptable operands under the fields config
   */
  validRules(value, acceptableOperands) {
    const requestedOperands = Object.keys(value);

    return requestedOperands.filter(requestedOperand => acceptableOperands.indexOf(requestedOperand) !== -1).length ===
      requestedOperands.length;
  }

  /**
   * @desc <p>namespace:<b>validator</b><p>
   * @param {JSON} values
   * @return {boolean}
   */
  paramValidator(values) {
    let res = false;

    Object.keys(values).
      forEach(operandKey => {
        let parts = false;

        if (operands[operandKey].isDateTime) {
          // / in date time comparing we have complex query
          // todo implement load value structure from operands config file.
          if (operandKey.toLowerCase() !== 'today' &&
            operands[operandKey].type.val === undefined
            && values[operandKey].val === undefined) {
            res = parts || true;
          }
          if (operandKey.toLowerCase() === 'today') {
            res = true;
          }
          // to handel equal exact date
          else if (operandKey === 'equalExactDate' &&
            values[operandKey].specificDate) {
            res = true;
          }
          else {
            const value = values[operandKey];

            res = parts || (typeof value.val === 'string' &&
              value.val.length !== 0 &&
              value.val.split(' ').length === 2 &&
              dateTypeVerbs.indexOf(value.val.split(' ')[1].toLowerCase()) !==
              -1);
          }
        }
        else if (_.isObject(values[operandKey]) &&
          Object.keys(values[operandKey]).length === 1
          && values[operandKey].target &&
          typeof values[operandKey].target === 'string') {
          // For compare two pair.
          parts = this.isValidVerb(values[operandKey].target);
          res = parts || res;
        }
        else {
          operands[operandKey].type.split('|').
            forEach(type => {
              switch (type) {
                case 'string':
                  parts = typeof values[operandKey] === 'string';
                  break;
                case 'number':
                  parts = typeof values[operandKey] === 'number';
                  break;
                case 'array':
                  parts = Array.isArray(values[operandKey]);
                  break;
              }
              res = parts || res;
            });
        }
      });

    return res;
  }

  /**
   * @private
   * @param {JSON}param
   * @param {JSON}rule
   * @param {function}exec
   * @return {boolean}
   */
  ruleValidator(param, rule, exec) {
    const rulesKey = Object.keys(rule);
    let res = true;

    for (let i = 0, ruleKey = rulesKey[i]; i < rulesKey.length && res; i++) {
      res = res && exec(param[ruleKey], rule[ruleKey]);
    }

    return res;
  }

  /**
   *
   * @param {JSON} params
   * @param {JSON} rules
   * @return {boolean}
   */
  ruleGeneralValidator(params, rules) {
    return Handler.ruleValidator(params, rules, (param, rule) => {
      let res = null;

      if (Array.isArray(rule)) {
        // should check in list
        res = rule.indexOf(param) !== -1;
      }
      else if (typeof rule === 'string' || typeof rule === 'number') {
        res = param === rule;
      }
      else {
        let andRes = true;

        Object.keys(rule).
          forEach(operands => {
            switch (operands) {
              case '<':
                andRes = andRes && ( param < rule['<']);
                break;
              case '>':
                andRes = andRes && ( param > rule['>']);
                break;
              case '!': // not in list
                if (Array.isArray(rule['!'])) {
                  // not in list
                  andRes = andRes &&
                    !rule['!'].filter(val => val === param).length;
                }
                else {
                  // not eql
                  andRes = andRes && param !== rule['!'];
                }
                break;
              case 'like':
                try {
                  andRes = andRes && new RegExp('^'+rule['like'].replace(/%/g,'(.*)').
                    replace(/_/g,'(.)').
                    replace(/\[/g,'').
                    replace(/]/g,'')+'$').test(param);
                }
                catch (err){
                  andRes=false;
                }

                break;
            }
          });
        res = res || andRes;
      }

      return res;
    });
  }

  /**
   *
   * @param {json} params
   * @param {json} rules
   * @return {boolean}
   */
  ruleDateValidator(params, rules) {
    const moment = require('moment');

    return Handler.ruleValidator(params, rules, (param, rule) => {
      const compareTools = function(andRes, operands) {
        const compareIt = function(a, b, operands) {
          let functionName = {
            '<=': 'isSameOrBefore',
            '>=': 'isSameOrAfter',
            '==': 'isSame',
          };

          if (rule.compareOptions.yy && rule.compareOptions.mm &&
            rule.compareOptions.dd && rule.compareOptions.h &&
            rule.compareOptions.m && rule.compareOptions.s) {
            return a[functionName[operands]](b);
          }

          const compare = function(a, b, op) {
            const fn = new Function('a', 'b', 'return a ' + op + 'b;');

            return fn.call({}, a, b);
          };
          let out = true;

          if (!rule.compareOptions.yy &&
            (rule.compareOptions.mm || rule.compareOptions.dd)) {
            if (rule.compareOptions.yy) {
              out = out && compare(a.year(), b.year(), operands);
            }
            if (out && rule.compareOptions.mm) {
              out = out && compare(a.month(), b.month(), operands);
            }
            if (out && rule.compareOptions.dd) {
              out = out && compare(a.date(), b.date(), operands);
            }
            if (out && rule.compareOptions.h) {
              out = out && compare(a.hour(), b.hour(), operands);
            }
            if (out && rule.compareOptions.m) {
              out = out && compare(a.minutes(), b.minutes(), operands);
            }
            if (out && rule.compareOptions.s) {
              out = out && compare(a.seconds(), b.seconds(), operands);
            }
          }
          else {
            functionName = functionName[operands];
            if (rule.compareOptions.yy) {
              out = out && a[functionName](b, 'years');
            }
            if (out && rule.compareOptions.mm) {
              out = out && a[functionName](b, 'months');
            }
            if (out && rule.compareOptions.dd) {
              out = out && a[functionName](b, 'days');
            }
            if (out && rule.compareOptions.h) {
              out = out && a[functionName](b, 'hours');
            }
            if (out && rule.compareOptions.m) {
              out = out && a[functionName](b, 'minutes');
            }
            if (out && rule.compareOptions.s) {
              out = out && a[functionName](b, 'seconds');
            }
          }

          return out;
        };

        if (param === null || param === undefined) {
          return false;
        }

        return andRes &&
          compareIt(moment(param).
            utc(), rule[operands].utc(), operands);
      };

      return Object.keys(rule).
        filter(key => key !== 'compareOptions').
        reduce(compareTools, true);
    });
  }

  /**
   *
   * @param {json} params
   * @param {json} rules
   * @return {boolean}
   */
  ruleInDeepValidator(params, rules) {
    return true;
  }

  /**
   * @desc check the passed String param contain a date value.
   * @param {String}target
   * @return {boolean}
   */
  isValidDate(target) {
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
  }

  /**
   *
   * @param {{fieldName:string,config:{fieldName:string}}} rules
   * @return {boolean}
   */
  filedNameMachs(rules) {
    return rules.fieldName === rules.config.fieldName;
  }

  /**
   * @desc Returns an array with arrays of the given size.
   * @param {Array} myArray  Array to split
   * @param {Number} chunkSize  Size of every group
   * @return {Array}
   */
   chunkArray(myArray, chunkSize) {
    const results = [];

    while (myArray.length) {
      results.push(myArray.splice(0, chunkSize));
    }

    return results;
  }

  /**
   * @desc Rune the logical operand on the val1 and val2 for deep linking
   * @param {T|Array} val1 The first value.
   * @param {T|Array} val2 The second value.
   * @param {String} op The operand for compare.
   * @param {Object} mapper the map guide for map first val to second  val;
   * @return {Boolean}
   */
   logicalConfirmDeepMap(val1, val2, op, mapper) {
    if (!val1 || !val2 ) {
      // If any of val is null return false.

      return false;
    }

    let res=false;
    const mappedVal2=mapper?Array.isArray(val2)? val2.map(key=>mapper[key]): mapper[val2]:null;

    switch (op) {
      case 'eql':
        if (mapper && Array.isArray(val1) && Array.isArray(mappedVal2)) {
          res = val1.some(key=>mappedVal2.indexOf(key)!==-1);
        }
        else if (mapper && Array.isArray(val1) && !Array.isArray(mappedVal2)) {
          res = val1.some(key=>key===mappedVal2);
        }
        else if (mapper && !Array.isArray(val1) && Array.isArray(mappedVal2)) {
          res = mappedVal2.some(key=> key===val1);
        }
        else if (!mapper) {
          res= val1===val2;
        }
        else {
          res = mappedVal2 === val1;
        }
        break;
    }

    return res;
  }
}

module.exports = (function() {
  let instance = null;

  /**
   * @desc make Commons lib singleton.
   * @return {Commons}
   */
  function createInstance() {
    return new Commons();
  }

  return {
    getInstance: function() {
      if (!instance) {
        const tmp = createInstance();

        instance = {
          commons: {
            replaceAll: tmp.replaceAll,
            getVerbConfig: tmp.getVerbConfig,
            chunkArray: tmp.chunkArray,
          },
          validator: {
            isEmpty: tmp.isEmpty,
            isLanguageISO: tmp.isLanguageISO,
            isValidVerb: tmp.isValidVerb,
            topKeyValidator: tmp.topKeyValidator,
            validRules: tmp.validRules,
            paramValidator: tmp.paramValidator,
            ruleGeneralValidator: tmp.ruleGeneralValidator,
            ruleDateValidator: tmp.ruleDateValidator,
            ruleInDeepValidator: tmp.ruleInDeepValidator,
            filedNameMachs: tmp.filedNameMachs,
            isValidDate: tmp.isValidDate,
            logicalConfirmDeepMap: tmp.logicalConfirmDeepMap,
          },
          parser: {
            getVerbsInString: tmp.getVerbsInString,
          },

        };
      }

      return instance;
    },
  };
})();
