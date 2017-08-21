const commons = require('./Commons').getInstance()
const operands = require('./operands')
/**
 * @private
 */
let Handler = null;


/**
 * @classdesc Parser - singleton
 * @class
 * @hideconstructor
 */
class Parser {
    constructor() {
        Handler = this;
    }

    /**
     *
     * @param rawContent
     * @returns {*}
     */
    RawContentParser(rawContent) {
        "use strict";
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
                let tmp = rawContent[key];
                let parsedContent = {};
                if (!commons.validator.isEmpty(tmp.title)) {
                    // load var and validates from the string s
                    parsedContent.title = commons.parser.getVerbsInString(tmp.title);
                }
                if (!commons.validator.isEmpty(tmp.subtitle)) {
                    // load var and validates from the string s
                    parsedContent.subtitle = commons.parser.getVerbsInString(tmp.subtitle);
                }
                if (!commons.validator.isEmpty(tmp.message)) {
                    // load var and validates from the string s
                    parsedContent.message = commons.parser.getVerbsInString(tmp.message);
                }

                p[key] = parsedContent;
                return p;
            }, {})
        }
    }

    /**
     *
     * @param rawTarget
     * @returns {{}}
     */
    RawTargetParser(rawTarget) {
        "use strict";
        if (commons.validator.isEmpty(rawTarget, false)) {
            throw new Error('target(s) is(are) missed or not valid');
        }
        else {
            const topKey = Object.keys(rawTarget);

            if (topKey.filter(commons.validator.topKeyValidator).length !== topKey.length) {
                throw new Error('target(s) is(are) missed or not valid ' + JSON.stringify(topKey))
            }
            else {
                let targets = {};
                topKey.forEach(key => {
                    let tmpVerbKeys = Object.keys(rawTarget[key]);
                    if (tmpVerbKeys.filter(commons.validator.isValidVerb).length != tmpVerbKeys.length) {
                        throw new Error('target' + key + '  is not valid');
                    }
                    else {
                        targets[key] = tmpVerbKeys.map(verbKey => {
                            return {
                                keyName: verbKey,
                                keyTarget: commons.commons.getVerbConfig(verbKey),
                                value: rawTarget[key][verbKey]
                            };
                        }).reduce((p, v) => {
                            p[v.keyName] = v;
                            return p;
                        }, {});
                    }


                })
                return targets;
            }
        }
    }

    /**
     *
     * @param {JSONObject}obj - a parsed operand style json file
     * @param {JSONObject|string|number|array}value
     * @returns {*}
     * @private
     */
    putValueInThePlace(obj, value) {
        Object.keys(obj).forEach(key => {
            if (Array.isArray(obj[key])) {
                obj[key] = [];
                value.forEach(val => {
                    obj[key].push(val);
                })
            }
            else if (typeof value == 'string' || typeof  value == 'number' || typeof value == 'boolean') {
                obj[key] = value;
            }
            else {
                throw new Error(' an in valid operand style find in jCompiler configs');
            }
        })

        return obj;
    }

    /**
     *
     * @param {string}filedName
     * @param {JSONObject}ruleStyle
     * @param {JSONObject|string|number|array}value
     * @return {JSONObject}
     * @private
     */
    ruleGenerator(filedName, ruleStyle, value) {
        let tmp = JSON.parse(JSON.stringify(ruleStyle).replaceAll('filed_name', filedName));
        tmp = Handler.putValueInThePlace(tmp, value);
        return tmp;
    }

    /**
     * format the rawTarget condition to waterline where statement
     *
     * @param {JSONObject}devicesRule
     * @returns {JSONObject}
     */
    loadDeviceConditions(devicesRule) {

        let outJSON = {};
        Object.keys(devicesRule).map(key => {
            return {
                value: devicesRule[key].value,
                config: devicesRule[key].keyTarget,
                fieldName: key
            }
        }).filter(rules => {
            return rules.config.inDevices
        }).forEach(rules => {
            if (!commons.validator.validRules(rules.value, rules.config.acceptableOperand)) {
                throw new Error("operand is not valid  fieldName "
                    + rules.fieldName + ' acceptable operands : '
                    + JSON.stringify(rules.config.acceptableOperand))
            }
            if (!commons.validator.paramValidator(rules.value)) {
                throw new Error("the requested compare value(s) type is not correct. fieldName "
                    + rules.fieldName + ' acceptable operands : '
                    + JSON.stringify(rules.config.acceptableOperand))
            }
            //todo  implement, multi operands as or condition in select
            //       for example we have 2 operands in our value field,like 2 `eql` then it should
            //          implement as or statement in waterline
            outJSON = Object.keys(rules.value).map(key => {
                return Handler.ruleGenerator(rules.fieldName, operands[key].style, rules.value[key]);
            }).reduce((p, v) => {
                Object.keys(v).forEach(key => {
                    p[key] = v[key];
                })
                return p;
            }, outJSON);


        })
        return outJSON;
    }
}

module.exports = (function () {
    let instance;

    function createInstance() {
        return new Parser();
    }

    return {
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    }
})()
