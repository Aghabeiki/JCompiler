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
    waterlineQueryFunctionBuilder() {

        let target=this.target;
        target

        let functionBody = '';


        functionBody += ' cb(null);';


        return new Function('cb', functionBody);
    }

}

module.exports = JCompiler;