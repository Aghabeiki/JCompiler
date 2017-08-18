"use strict";

const _target = new WeakMap()
const _content = new WeakMap();
const parser = require('./lib/Parser').getInstance();

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

    /**
     * @desc <p>this function , generate the waterline search query function base to load <br>
     *       data for next steps</p>
     * @returns {waterlineQueryFunction}
     */
    waterlineQueryFunctionBuilder(prefix) {

        if (prefix == undefined)
            prefix = '';
        let target = this.target;
        let defineDevices = ' let devices=sails' + prefix + '.devices;\n\r';
        let defineBookings = ' let bookings=sails' + prefix + '.bookings\n\r';
        let defineFlights = ' let flights=sails' + prefix + '.flights\n\r';
        let defineFerris = ' let ferris=sails' + prefix + '.ferris\n\r';
        let defineCoaches = ' let coaches=sails' + prefix + '.coaches\n\r';
        // todo remember if it's on sails not need to populate like this
        let deviceConditions = 'devices.find({where:conditions}).populate([\'anyFlights\']).exec(cb)\n\r';
        let functionBody = '';

        // check the target for device conditions
        if (Object.keys(target).indexOf('device') != -1) {
            // add the device data models to function body
            functionBody += defineDevices;
            let rules = parser.loadDeviceConditons(target['device']);
            functionBody += deviceConditions.replace('conditions', JSON.stringify(rules));
        }
        else {
            // so fetch every things from devices
            functionBody = 'cb(null)';
        }


        return new Function('sails', 'cb', functionBody);
    }

}

module.exports = JCompiler;