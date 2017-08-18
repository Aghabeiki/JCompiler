const commons = require('./Commons').getInstance()

/**
 * @classdesc Parser - singleton
 * @class
 * @hideconstructor
 */
class Parser {
    constructor() {
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
        if (commons.validator.isEmpty(rawTarget)) {
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

    loadDeviceConditons(devicesRuls) {
        let outjson = {};
        let myDeviceRules = Object.keys(devicesRuls).map(key => {
            return {
                value: devicesRuls[key].value,
                config: devicesRuls[key].keyTarget
            }
        }).filter(rules => {
            return rules.config.inDevices
        }).forEach(rules => {
            // todo first check the rules is belong to the key
            // todo then check the rules type config ( in operands files under libs folder )
            // todo generate the where jeson file like my output '{push_token: "test"};'

        })
        return outjson;
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
