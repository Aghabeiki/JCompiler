"use strict";

const _target = new WeakMap()
const _content = new WeakMap();
const momentJS = require('moment');
const _ = require('lodash');
const parser = require('./lib/Parser').getInstance();
const commons = require('./lib/Commons').getInstance();
const isValidDate = function (target) {
    let d = new Date(target);
    if (Object.prototype.toString.call(d) === "[object Date]") {
        // it is a date
        if (isNaN(d.getTime())) {  // d.valueOf() could also work
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
const generalCompare = (obj, rules) => {
    return (commons.validator.ruleGeneralValidator(obj, rules.general) &&
        commons.validator.ruleDateValidator(obj, rules.dateTime));
};
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
    constructor(target, content) {
        Handler = this;
        this.target = parser.RawTargetParser(target);
        this.content = parser.RawContentParser(content);
    }

    get target() {
        return _target.get(Handler);
    }

    set target(value) {
        _target.set(Handler, value);
    }

    get content() {
        return _content.get(Handler);
    }

    set content(value) {
        _content.set(Handler, value);
    }

    /**
     * @typedef waterlineQueryFunction
     * @type {Function}
     * @param {Function} CB - {@link waterlineQueryCallBack}
     */

    /**
     * @typedef waterlineQueryCallBack
     * @type {Function}
     * @param {Error} error
     * @param {JSONObject} List
     */

    loadPNS(sails, prefix) {
        if (!prefix)
            prefix = '';
        let functionBody = 'return sails' + prefix + '.devices';

        let rules = {
            general: {}
        };
        let flightFilter, bookingFilter, deviceFilter, emptyRule;
        emptyRule = flightFilter = bookingFilter = deviceFilter = function (obj) {
            return true;
        }

        const target = this.target;
        const topKey = Object.keys(target);
        let extraTables=[];
        if (topKey.indexOf('device') !== -1) {
            // add the device data models to function body
            rules = parser.loadConditions(target['device'], new Function('rules', 'return rules.config.isDevice'));
            if (rules.general.inDeep) {
                rules.inDeep = _.cloneDeep(rules.general.inDeep);
                rules.inDeep.forEach(deep=>{
                        extraTables.push(deep.maps[0]);
                });
                delete rules.general.inDeep;
            }
            deviceFilter = function (obj) {
                return (commons.validator.ruleDateValidator(obj, rules.dateTime)) &&
                    ( commons.validator.ruleInDeepValidator(obj,rules.inDeep));
            }
        }
        if (topKey.indexOf('flight') !== -1) {
            flightFilter = function (obj) {
                rules = parser.loadConditions(target['flight'], new Function('rules', 'return rules.config.isFlight'));
                return generalCompare(obj, rules);
            }
        }
        if (topKey.indexOf('booking') !== -1) {
            bookingFilter = function (obj) {
                let rules = parser.loadConditions(target['booking'], new Function('rules', 'return rules.config.isBooking'));
                return generalCompare(obj, rules);
            }
        }
       /* extraTables=['Coaches'];
        const that=this;
        const extraInfo=Promise.all(extraTables.map(tableName=>{
            return new Function('sails',`return sails${prefix}.${tableName.toLowerCase()}.find()`);
        }).map(func=>{
            return func.call(that,sails)
        }));*/
        ( new Function('sails',extraTables))
        return new Promise((resolve, reject) => {
            (new Function('sails', functionBody))
                .call(this, sails)
                .find({where: rules.general})
                .populate(['anyFlights', 'anyBooking'])
              /*  .then(extraInfo)*/
                .then((devices) => {
                    // load extra tables
                    // should load all other required tables.
                    const pns = devices.filter(device => {
                        let out;
                        if (!deviceFilter(device)) {
                            out = false;
                        }
                        else {
                            out = true;
                            if (flightFilter !== emptyRule)
                                out = out && device.anyFlights.filter(flightFilter).length !== 0;
                            if (bookingFilter !== emptyRule)
                                out = out && device.anyBooking.filter(bookingFilter).length !== 0;
                        }
                        return out;
                    });
                    return [pns];
                })
                .spread(results => {
                    "use strict";

                    resolve(results.map(pns => {
                        let tmp = {};
                        tmp.pnsID = pns.push_token;
                        tmp.lang = pns.device_locale || 'en-us';
                        let params;
                        if (pns.device_locale !== undefined && pns.device_locale !== null && Handler.content[pns.device_locale.toLowerCase()] !== undefined) {
                            params = Handler.content[pns.device_locale.toLowerCase()];
                        }
                        else if (Handler.content['en-us'] !== undefined) {
                            params = Handler.content['en-us'];
                        }
                        else {
                            params = Handler.content[Object.keys(Handler.content)[0]];
                        }
                        tmp.params = {};
                        Object.keys(params).map(key => {
                            "use strict";
                            return params[key];
                        }).reduce((p, v) => {
                            "use strict";
                            v.forEach(param => {
                                if (p.filter(key => {
                                        return key.name === param.name
                                    }).length !== 1)
                                    p.push(param);
                            })
                            return p;
                        }, []).forEach(param => {

                            let val = '';
                            switch (param.target.maps[0]) {
                                case 'devices':
                                    val = pns[param.target.maps[1]];
                                    try {
                                        if (val !== undefined && val !== null && isValidDate(val)) {
                                            let tz = require('countryjs').timezones(pns.country);
                                            if (pns.latitude !== null && pns.latitude !== undefined) {
                                                let tzwhere = require('tzwhere')
                                                tzwhere.init();
                                                let min = tzwhere.tzOffsetAt(pns.latitude, pns.longitude) / 60000;
                                                val = momentJS(val).utcOffset(min).format('DD-MMM-YYYY hh:mm A');
                                            }
                                            else if (tz !== undefined && tz !== null && tz.length >= 0) {
                                                val = momentJS(val).utcOffset(tz[0].replace('UTC', '')).format('DD-MMM-YYYY hh:mm A');
                                            }
                                            else {
                                                val = momentJS(val).format('DD-MMM-YYYY hh:mm A') + " (in UTC timezone) ";
                                            }

                                        }
                                    }
                                    catch (err) {
                                    }
                                    break;
                                case 'flights':
                                    val = pns.anyFlights.reduce((p, v, i, arr) => {
                                        "use strict";
                                        return p + (i != 0 ? ',' : '') + v[param.target.maps[1]];
                                    }, '');
                                    break;
                                case 'bookings':
                                    val = pns.anyBooking.reduce((p, v, i, arr) => {
                                        "use strict";
                                        return p + (i != 0 ? ',' : '') + v[param.target.maps[1]];
                                    }, '');
                                    break;
                                default:
                                    val = 'NotFound';
                                    break;
                            }
                            tmp.params[param.name] = val;
                        })
                        return tmp;
                    }));
                })
                .catch(reject);
        });
    }
}

module.exports = JCompiler;
