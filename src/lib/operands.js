const moment = require('moment');

const operands = {
    // general
    eql: {
        type: 'string|number',
        style: function (filedName, value) {
            let tmp = {};
            tmp[filedName] = value;
            return tmp;
        }

    },
    inList: {
        type: 'array',
        style: function (filedName, value) {
            let tmp = {};
            tmp[filedName] = value;
            return tmp;
        }
    },
    exList: {
        type: 'array',
        style: function (filedName, value) {
            let tmp = {};
            tmp[filedName] = {'!': value};
            return tmp;
        }
    },
    // number
    lessThan: {
        type: 'string|number',
        style: function (filedName, value) {
            let tmp = {};
            tmp[filedName] = {'<': value};
            return tmp;
        }
    },
    greaterThan: {
        type: 'string|number',
        style: function (filedName, value) {
            let tmp = {};
            tmp[filedName] = {'>': value};
            return tmp;
        }
    },
    between: {
        type: 'array',
        style: function (filedName, value) {
            let tmp = {};
            tmp[filedName] = {'>': value[0], '<': value[1]};
            return tmp;
        }
    },
    // date
    today: {
        type: 'string',
        style: function (filedName, value) {
            let tmp = {};
            tmp[filedName] = new Date().toUTCString()
            return tmp;
        }
    }

}
module.exports = operands;