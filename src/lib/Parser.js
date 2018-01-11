'use strict';

const commons = require('./Commons').
  getInstance();
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
            throw new Error(`target ${key} is not valid`);
          }
          else if (tmpVerbKeys.filter(verb=>commons.commons.getVerbConfig(verb).isValidScope(key)).length !==
          tmpVerbKeys.length) {
            throw new Error(`some used verbs are not belong to ${key} group.`);
          }
          else {
            targets[key] = tmpVerbKeys.map(verbKey => ({
              keyName: verbKey,
              keyTarget: commons.commons.getVerbConfig(verbKey),
              value: rawTarget[key][verbKey],
            })).
              reduce((p, v) => {
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
   * @param {json} rules
   * @param {function} filter
   * @return {{
      general: Object,
      dateTime: Object,
      inDeep: Object,
      deepLink: Array,
      extraTables: Array,

    }}
   */
  loadConditions(rules, filter) {
    const generalAndDeep = Handler.loadConditionsImplement(rules, filter, false);
    const dateTimeAndDeep = Handler.loadConditionsImplement(rules, filter, true);
    // First load all in Deep  in inDeep param
    const inDeepParts = [];
    const requiredFields = [];
    const deepLinkParts=[]; // All the deep link verb will go to the inDeepParts.
    /*
     Check type of map and then add them to required filed.
      */
    const cleanMaps=map=>requiredFields.push(...(map.length>2 ?
        map.filter(item=>item.startsWith('T_')).map(item=>item.replace('T_', '')): // It's a deep map.
        [map[0]])); // It's a normal map.

    [...(generalAndDeep.inDeep || []), ...(dateTimeAndDeep.inDeep || [])].forEach(config => {
      inDeepParts.push(config);
      cleanMaps(config.maps);
      cleanMaps(Object.values(config.rules)[0]);
    });

    [...(generalAndDeep.deepLink||[]), ...(dateTimeAndDeep.deepLink||[])].forEach(rule=>{
      if (deepLinkParts.indexOf(rule)===-1) {
        deepLinkParts.push(rule);
      }
      if (rule.config.shouldPreProcessed) {
        cleanMaps(rule.config.maps);
      }
      else {
        const [op]=Object.keys(rule.value);

        if (rule.value[op].target.shouldPreProcessed) {
          cleanMaps(rule.value[op].target.maps);
        }
      }
    });

    delete generalAndDeep.inDeep;
    delete dateTimeAndDeep.inDeep;
    delete generalAndDeep.deepLink;
    delete dateTimeAndDeep.deepLink;

    return {
      general: generalAndDeep,
      dateTime: dateTimeAndDeep,
      inDeep: inDeepParts || {},
      deepLink: deepLinkParts || [],
      extraTables: requiredFields || [],

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
    let outJSON = {}; // Normal things.
    const inDeep = []; // Collect all rules that link two verbs
    const deepLink=[]; // Collect all verbs that need to join some tables.

    Object.keys(devicesRule).
      map(key => ({
        value: devicesRule[key].keyTarget.valuePreProcessor(
          devicesRule[key].value),
        config: devicesRule[key].keyTarget,
        fieldName: key,
      })).
      filter(rules => filter.call(this, rules)).
      filter(rules => {
        let res = false;

        Object.keys(rules.value).
          forEach(operand => {
            res = res || (operands[operand].isDateTime || false);
          });

        return (!loadDateTime && !res) || (loadDateTime && res);
      }).
      map(rules=>{
        // validate rules
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

        return rules;
      }).
      map(rule=>{
        let shouldSkip=false;
        // extract deepLink verbs
        // check op1
        // first level link

        if (rule.config.shouldPreProcessed) {
          deepLink.push(rule);
          shouldSkip=true;
        }

        // check if the rule is inDeep checking mode
        // should OP2 check for deepLink
        const isInDeepRule=Object.keys(rule.value).reduce((p, v)=>{
          if (_.isObject(rule.value[v]) && typeof rule.value[v].target==='string') {
            const targetConfig=commons.commons.getVerbConfig(rule.value[v].target);

            if (targetConfig && targetConfig.shouldPreProcessed) {
              const clonedRule=_.cloneDeep(rule);

              clonedRule.value[v].target=targetConfig;
              p=clonedRule;
            }
          }

          return p;
        }, null);

        if (isInDeepRule) {
          deepLink.push(isInDeepRule);
          shouldSkip=true;
        }

        return shouldSkip? undefined:rule;
      }).
      filter(rule=>rule).
      forEach(rules => {
        // todo  implement, multi operands as or condition in select
        //       for example we have 2 operands in our value field,like 2 `eql` then it should
        //          implement as or statement in waterline
        outJSON = Object.keys(rules.value).
          reduce((list, rule) => {
            if (_.isObject(rules.value[rule]) &&
              typeof rules.value[rule].target === 'string'&&
              commons.validator.isValidVerb(rules.value[rule].target)) {
              const deepRule = {maps: rules.config.maps};

              deepRule.rules = {};
              deepRule.rules[rule] = commons.commons.getVerbConfig(rules.value[rule].target).maps;
              inDeep.push(deepRule);
            }
            else {
              list.push(rule);
            }

            return list;
          }, []).
          map(key => operands[key].style(rules.config.maps[1], rules.value[key])).
          reduce((p, v) => {
            Object.keys(v).
              forEach(key => {
                p[key] = v[key];
              });

            return p;
          }, outJSON);
      });

    if (inDeep.length) {
      outJSON.inDeep = inDeep;
    }
    if (deepLink.length) {
      outJSON.deepLink=deepLink;
    }

    return outJSON;
  }

  /**
   *
   * @param {String} rules
   * @param {Function} filter
   */
  loadPreProcessVerbs(rules, filter) {
    Object.keys(rules).
      filter(key => rules[key].keyTarget.shouldPreProcessed()).
      filter(rules => filter.call(this, rules)).
      forEach(key => {
        console.log(key);// eslint-disable-line no-console
      });
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
