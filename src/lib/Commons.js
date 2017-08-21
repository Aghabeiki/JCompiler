let verbs = require('./ValidVerbs');
const operands = require('./operands');


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
        })
        return res;
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
                        paramValidator: tmp.paramValidator
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