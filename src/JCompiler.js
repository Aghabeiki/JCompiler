"use strict";

const _target = new WeakMap()
const _content = new WeakMap();
const parser = require('./lib/Parser').getInstance();
const validVerb = require('./lib/ValidVerbs');

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
        if (prefix == undefined)
            prefix = '';
        let functionBody = 'return sails' + prefix + '.devices';

        let rules = {};
        let flightFilter, bookingFilter;
        flightFilter = bookingFilter = function (obj) {
            return true;
        }

        const target = this.target;
        const topKey = Object.keys(target);
        if (topKey.indexOf('device') != -1) {
            // add the device data models to function body
            rules = parser.loadDeviceConditions(target['device']);
        }
        if (topKey.indexOf('flight') != -1) {
            flightFilter = function (obj) {
                let tmp = {};
                tmp.commons = require('./lib/Commons').getInstance();
                tmp.rules = parser.loadConditions(target['flight'], new Function('rules', 'return rules.config.isFlight'));
                return new Function('obj', 'let that=this;\n\rreturn this.commons.validator.ruleValidator(obj, that.rules);').call(tmp, obj);
            }

        }
        if (topKey.indexOf('booking') != -1) {
            bookingFilter = function (obj) {
                let tmp = {};
                tmp.commons = require('./lib/Commons').getInstance();
                tmp.rules = parser.loadConditions(target['booking'], new Function('rules', 'return rules.config.isBooking'));
                return new Function('obj', 'let that=this;\n\rreturn this.commons.validator.ruleValidator(obj, that.rules);').call(tmp, obj);
            }
        }
        return new Promise((resolve, reject) => {
            (new Function('sails', functionBody))
                .call(this, sails)
                .find({where: rules})
                .populate(['anyFlights', 'anyBooking'])
                .then((devices) => {
                    "use strict";
                    const pns = devices.filter(device => {
                        let out = true;
                        out = out && device.anyFlights.filter(flightFilter).length !== 0
                        out = out && device.anyBooking.filter(bookingFilter).length !== 0
                        return out;
                    });
                    return [pns];
                })
                .spread(results => {
                    "use strict";
                    resolve(results);
                })
        });
    }
}

module.exports = JCompiler;