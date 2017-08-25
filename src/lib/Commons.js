const verbs = require('./ValidVerbs');
const operands = require('./operands');
const dateTypeverbs = ['minutes', 'hours', 'days', 'weeks', 'months', 'quarters', 'years'];

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
        String.prototype.replaceAll = function (search, replacement) {
            var target = this;
            return target.split(search).join(replacement);
        };
        Date.prototype.unix = function () {
            return Number.parseInt(this.getTime() / 1000);
        }
        Handler = this;
    }


    /**
     * @desc <p>namespace:<b>commons</b></p>
     * @example Commons.commons.replaceAll('test','t','') => `es`
     * @param {string} target
     * @param {string} search
     * @param {string} replacement
     * @returns {string}
     */
    replaceAll(target, search, replacement) {
        return target.split(search).join(replacement);
    }

    /**
     * @desc <p>namespace:<b>validator</b></p><br><p> check for null, empty string, undefined and Object properties </p>
     * @example Commons.validator.isEmpty({}) => true
     * @param {Object} obj
     * @param {boolean} checkEmptyObject if set true will check the object has any properties default is enable
     * @returns {boolean}
     */

    isEmpty(obj, checkEmptyObject) {
        "use strict";
        if (checkEmptyObject == undefined) checkEmptyObject = true;
        return (obj == null || obj == '' || obj == undefined
            || ( checkEmptyObject == true && Object.keys(obj).length == 0))
    }


    /**
     * @desc <p>namespace:<b>validator</b></p>
     * @example Commons.validator.isLanguageISO('en-us') => true
     * @param {string} lang - language code
     * @todo put the ISO code number for docs
     * @returns {boolean} will be true if the language code match with ISO XXX
     */
    isLanguageISO(lang) {

        let output = true;
        try {
            const lcid = require('lcid');
            const formattedLCID = Object.keys(lcid.all).reduce((p, v) => {
                "use strict";
                p[v.toUpperCase().replace('_', '-')] = lcid.all[v]
                return p;
            }, {});

            if (lang.split(';').reduce((p, v) => {
                    "use strict";
                    let tmp = v.split(',').filter(vv => {
                        return vv.length != 0
                    });
                    tmp.forEach((vvv) => {
                        p.push(vvv.toUpperCase());
                    })

                    return p;
                }, []).filter(lang => {
                    return formattedLCID[lang] !== undefined
                }).length === 0) {
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
     * @returns {boolean} will be true if the verb be in {@link verbList}
     */
    isValidVerb(verb) {
        return verbs[verb] !== undefined;
    }


    /**
     * @desc <p>namespace:<b>validator</b></p>
     * @param {string} key
     * @returns {boolean}  will be true if the input be one of [user,bookings,location]
     */
    topKeyValidator(key) {
        "use strict";
        let output = false;
        switch (key.toLowerCase()) {
            case 'device':
            case 'booking':
            case 'flight' :
            case 'location':
                output = true;
                break;
        }
        return output;
    }

    /**
     * @desc <p>namespace:<b>parser</b></p><br><p><b>note:</b> the verbs in string should be in `{*VerbName*}`</p>
     * @param {string} sentences -
     * @returns {*}
     */
    getVerbsInString(sentences) {
        // space splitter
        let vars = sentences.split(' ')
            .reduce((p, v) => {
                "use strict";
                // , splitter
                if (v.split(',').length !== 1) {
                    v.split(',').forEach(parts => {

                        p.push(parts);
                    })
                }
                // ; splitter
                else if (v.split(';').length !== 1) {
                    v.split(';').forEach(parts => {

                        p.push(parts);
                    })
                }
                // splitter
                else if (v.split('.').length !== 1) {
                    v.split('.').forEach(parts => {

                        p.push(parts);
                    })
                }
                // ! splitter
                else if (v.split('!').length !== 1) {
                    v.split('!').forEach(parts => {

                        p.push(parts);
                    })
                }
                // ? splitter
                else if (v.split('?').length !== 1) {
                    v.split('?').forEach(parts => {

                        p.push(parts);
                    })
                }
                //: splitter
                else if (v.split(':').length !== 1) {
                    v.split(':').forEach(parts => {

                        p.push(parts);
                    })
                }
                else {
                    p.push(v);
                }
                return p;
            }, []).filter(parts => {
                "use strict";
                return parts.match(/\{\*.*\*\}/g) !== null;
            });

        if (vars.length == 0) {
            return [];
        }
        else {
            let filteredVars = vars.filter(part => {
                "use strict";
                let tmp = part.replaceAll('*}', '').replaceAll('{*', '').toLowerCase();

                return Handler.isValidVerb(tmp);
            })
            if (filteredVars.length == 0) {
                throw new Error(' the var(s)' + JSON.stringify(vars) + ' is(are) not in the verb list')
            }
            else {
                return filteredVars.map(parts => {
                    "use strict";
                    let tmp = Handler.replaceAll(Handler.replaceAll(parts, '*}', ''), '{*', '').toLowerCase();
                    return {name: parts, target: verbs[tmp]};
                })
            }
        }
    }

    /**
     * @desc <p>namespace:<b>commons</b><p>
     * @param {string} verb name {@link verbList}
     * @return {JSONObject} verb config
     */

    getVerbConfig(verb) {
        return verbs[verb];
    }


    /**
     * @desc <p>namespace:<b>validator</b><p>
     * @param {JSONObject} value
     * @param {JSONObject} acceptableOperands
     * @returns {boolean} true if the requested operands match all with acceptable operands under the fields config
     */
    validRules(value, acceptableOperands) {
        const requestedOperands = Object.keys(value);

        return requestedOperands.filter(requestedOperand => {
            return acceptableOperands.indexOf(requestedOperand) != -1
        }).length === requestedOperands.length;
    }

    /**
     * @desc <p>namespace:<b>validator</b><p>
     * @param values
     * @returns {boolean}
     */
    paramValidator(values) {
        let res = false;
        Object.keys(values).forEach(operandKey => {
            let parts = false;
            if (operands[operandKey].isDateTime) {
                /// in date time comparing we have complex query
                if (operandKey.toLowerCase() !== 'today' && operands[operandKey].type.val == undefined
                    && values[operandKey].val == undefined) {
                    res = parts || true;
                }
                if (operandKey.toLowerCase() == 'today') {
                    res = true;
                }
                else {

                    let value = values[operandKey];
                    res = parts || (typeof value.val === 'string' &&
                        value.val.length !== 0 &&
                        value.val.split(' ').length === 2 &&
                        dateTypeverbs.indexOf(value.val.split(' ')[1].toLowerCase()) !== -1);
                }

            }
            else {
                operands[operandKey].type.split('|').forEach(type => {
                    switch (type) {
                        case 'string':
                            parts = typeof values[operandKey] == 'string';
                            break;
                        case 'number':
                            parts = typeof values[operandKey] == 'number';
                            break;
                        case 'array':
                            parts = Array.isArray(values[operandKey]);
                            break;
                    }
                    res = parts || res;
                })
            }

        })
        return res;
    }


    /**
     * @private
     * @param param
     * @param rule
     * @param exec
     * @returns {boolean}
     */
    ruleValidator(param, rule, exec) {
        let rulesKey = Object.keys(rule);
        let res = true;
        for (let i = 0, ruleKey = rulesKey[i]; i < rulesKey.length && res; i++) {
            res = res && exec(param[ruleKey], rule[ruleKey])
        }
        return res;
    }

    /**
     *
     * @param params
     * @param rules
     * @returns {boolean}
     */
    ruleGeneralValidator(params, rules) {
        return Handler.ruleValidator(params, rules, (param, rule) => {
            let res
            if (Array.isArray(rule)) {
                // should check in list
                res = rule.indexOf(param) !== -1;
            }
            else if (typeof rule == 'string' || typeof rule == 'number') {
                res = param == rule;
            }
            else {
                let andRes = true;
                Object.keys(rule).forEach(operands => {
                    switch (operands) {
                        case '<':
                            andRes = andRes && ( param < rule['<'])
                            break;
                        case '>':
                            andRes = andRes && ( param > rule['>'])
                            break;
                        case '!': // not in list
                            if (Array.isArray(rule['!'])) {
                                // not in list
                                andRes = andRes && (rule['!'].filter(val => {
                                    return val == param
                                }).length == 0)
                            }
                            else {
                                // not eql
                                andRes = andRes && ( param != rule['!'])
                            }
                            break;
                    }
                })
                res = res || andRes;
            }
            return res;
        });
    }

    /**
     *
     * @param params
     * @param rules
     * @returns {boolean}
     */
    ruleDateValidator(params, rules) {
        const moment = require('moment');
        return Handler.ruleValidator(params, rules, (param, rule) => {
            let compareTools = function (andRes, operands) {
                const compareIt = function (a, b, operands) {
                    let functionName = {
                        '<=': 'isSameOrBefore',
                        '>=': 'isSameOrAfter',
                        '==': 'isSame'
                    };
                    if (rule.compareOptions.yy && rule.compareOptions.mm &&
                        rule.compareOptions.dd && rule.compareOptions.h &&
                        rule.compareOptions.m && rule.compareOptions.s) {
                        return a[functionName[operands]](b);
                    }

                    let compare = function (a, b, op) {
                        let fn = new Function('a', 'b', 'return a ' + op + 'b;')
                        return fn.call({}, a, b);
                    }
                    let out = true;
                    if (rule.compareOptions.yy == false && (rule.compareOptions.mm || rule.compareOptions.dd)) {
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
                        functionName=functionName[operands]
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
                }

                if (param == null || param == undefined) {
                    return false;
                }
                return andRes && compareIt(moment(param).utc(), rule[operands].utc(), operands);
            }
            return Object
                .keys(rule)
                .filter(key => {
                    return key !== 'compareOptions'
                })
                .reduce(compareTools, true);
        });
    }

    filedNameMachs(rules) {
        return rules.fieldName == rules.config.fieldName;
    }
}

module.exports = (function () {
    let instance;

    function createInstance() {
        var object = new Commons();

        return object;
    }

    return {
        getInstance: function () {
            if (!instance) {
                let tmp = createInstance();

                instance = {

                    commons: {
                        replaceAll: tmp.replaceAll,
                        getVerbConfig: tmp.getVerbConfig
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
                        filedNameMachs: tmp.filedNameMachs
                    },
                    parser: {
                        getVerbsInString: tmp.getVerbsInString
                    }

                }
            }
            return instance;
        }
    };
})();