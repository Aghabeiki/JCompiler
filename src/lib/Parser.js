'use strict';

const commons = require('./Commons').getInstance();
const operands = require('./operands');
const _ = require('lodash');
/**
 * @private
 */
let Handler = null;

/**
 * @desc parser class implementation.
 *
 */
class Parser {
  /**
   *
   */
  constructor() {
    Handler = this;
  }

  /**
   *
   * @param {json} rawContent
   * @return {*}
   */
  rawContentParser(rawContent) {
    // check if the input is an Object and has required fields
    if (commons.validator.isEmpty(rawContent)) {
      throw new Error('content is missed or not valid');
    }
 else {
      let isItClean = true;
      const keysArray = Object.keys(rawContent);

      for (let index = 0; index < keysArray.length && isItClean; index++) {
        if (!commons.validator.isLanguageISO(keysArray[index])) {
          isItClean = false;
        }
      }
      if (!isItClean) {
        throw new Error('Content is not valid');
      }

      // load verbs and create the parsed tables

      return keysArray.reduce((p, key) => {
        const tmp = rawContent[key];
        const parsedContent = {};

        if (!commons.validator.isEmpty(tmp.title)) {
          // load var and validates from the string s
          parsedContent.title = commons.parser.getVerbsInString(tmp.title);
        }
        if (!commons.validator.isEmpty(tmp.subtitle)) {
          // load var and validates from the string s
          parsedContent.subtitle = commons.parser.getVerbsInString(
              tmp.subtitle);
        }
        if (!commons.validator.isEmpty(tmp.message)) {
          // load var and validates from the string s
          parsedContent.message = commons.parser.getVerbsInString(tmp.message);
        }

        p[key] = parsedContent;

return p;
      }, {});
    }
  }

  /**
   *
   * @param {json} rawTarget
   * @return {{}}
   */
  rawTargetParser(rawTarget) {
    if (commons.validator.isEmpty(rawTarget, false)) {
      throw new Error('target(s) is(are) missed or not valid');
    }
 else {
      const topKey = Object.keys(rawTarget);

      if (topKey.filter(commons.validator.topKeyValidator).length !==
          topKey.length) {
        throw new Error('target(s) is(are) missed or not valid ' +
            JSON.stringify(topKey));
      }
 else {
        const targets = {};

        topKey.forEach(key => {
          const tmpVerbKeys = Object.keys(rawTarget[key]);

          if (tmpVerbKeys.filter(commons.validator.isValidVerb).length !==
              tmpVerbKeys.length) {
            throw new Error('target ' + key + '  is not valid');
          }
 else {
            targets[key] = tmpVerbKeys.map(verbKey => ({
                keyName: verbKey,
                keyTarget: commons.commons.getVerbConfig(verbKey),
                value: rawTarget[key][verbKey],
              })).reduce((p, v) => {
              p[v.keyName] = v;

return p;
            }, {});
          }
        });

return targets;
      }
    }
  }

  /**
   *
   * @param {json}devicesRule
   * @param {function}filter
   * @return {{general: {json}, dateTime: {json}}}
   */
  loadConditions(devicesRule, filter) {
    return {
      general: Handler.loadConditionsImplement(devicesRule, filter, false),
      dateTime: Handler.loadConditionsImplement(devicesRule, filter, true),
    };
  }

  /**
   *
   * @param {json} devicesRule
   * @param {function} filter
   * @param {boolean} loadDateTime
   * @return {{}}
   */
  loadConditionsImplement(devicesRule, filter, loadDateTime) {
    loadDateTime = loadDateTime || false;
    let outJSON = {};
    const inDeep = [];

    Object.keys(devicesRule).map(key => ({
        value: devicesRule[key].keyTarget.valuePreProcessor(
            devicesRule[key].value),
        config: devicesRule[key].keyTarget,
        fieldName: key,
      })).filter(rules => filter.call(this, rules)).filter(rules => {
      let res = false;

      Object.keys(rules.value).forEach(operand => {
        res = res || (operands[operand].isDateTime || false);
      });

return (!loadDateTime && !res) || (loadDateTime && res);
    }).forEach(rules => {
      if (!commons.validator.validRules(rules.value,
              rules.config.acceptableOperand)) {
        throw new Error('operand is not valid  fieldName '
            + rules.fieldName + ' acceptable operands : '
            + JSON.stringify(rules.config.acceptableOperand));
      }
      if (!commons.validator.paramValidator(rules.value)) {
        throw new Error('the requested compare value(s) type is not correct. fieldName '
            + rules.config.maps[1] + ' acceptable operands : '
            + JSON.stringify(rules.config.acceptableOperand));
      }
      if (!commons.validator.filedNameMachs(rules)) {
        throw new Error('the requested compare filedName(s) is not machs. fieldName '
            + rules.config.maps[1] + ' acceptable operands : '
            + JSON.stringify(rules.config.acceptableOperand));
      }
      // todo  implement, multi operands as or condition in select
      //       for example we have 2 operands in our value field,like 2 `eql` then it should
      //          implement as or statement in waterline
      outJSON = Object.keys(rules.value).reduce((list, rule) => {
        if (_.isObject(rules.value[rule]) &&
            typeof rules.value[rule].target === 'string') {
          const deepRule = {maps: rules.config.maps};

          deepRule.rules = {};
          deepRule.rules[rule] = rules.value[rule].target;
          inDeep.push(deepRule);
        }
 else {
          list.push(rule);
        }

return list;
      }, []).map(key => operands[key].style(rules.config.maps[1], rules.value[key])).reduce((p, v) => {
        Object.keys(v).forEach(key => {
          p[key] = v[key];
        });

return p;
      }, outJSON);
    });
    if (inDeep.length) {
      outJSON.inDeep = inDeep;
    }

return outJSON;
  }
}

module.exports = (function() {
  let instance;

  /**
   * @desc make Parser singleton
   * @return {Parser}
   */
  function createInstance() {
    return new Parser();
  }

  return {
    getInstance: function() {
      if (!instance) {
        instance = createInstance();
      }

return instance;
    },
  };
})();
