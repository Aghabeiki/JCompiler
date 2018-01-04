'use strict';

const moment = require('moment');

const operands = {
// general
  eql: {
    type: 'string|number',
    style: function(filedName, value) {
      const tmp = {};

      tmp[filedName] = value;

return tmp;
    },

  },
  inList: {
    type: 'array',
    style: function(filedName, value) {
      const tmp = {};

      tmp[filedName] = value;

return tmp;
    },
  },
  exList: {
    type: 'array',
    style: function(filedName, value) {
      const tmp = {};

      tmp[filedName] = {'!': value};

return tmp;
    },
  },
  // number
  lessThan: {
    type: 'string|number',
    style: function(filedName, value) {
      const tmp = {};

      tmp[filedName] = {'<': value};

return tmp;
    },
  },
  greaterThan: {
    type: 'string|number',
    style: function(filedName, value) {
      const tmp = {};

      tmp[filedName] = {'>': value};

return tmp;
    },
  },
  between: {
    type: 'array',
    style: function(filedName, value) {
      const tmp = {};

      tmp[filedName] = {'>': value[0], '<': value[1]};

return tmp;
    },
  },
  // date
  today: {
    type: {
      val: 'string verbs',
    },
    get compareOptions() {
      return {
        yy: true,
        mm: true,
        dd: true,
        h: false,
        m: false,
        s: false,
      };
    },
    isDateTime: true,
    style: function(filedName, value) {
      let compareOptions;
      const that = this;

      if (value.compareOptions) {
        compareOptions = {
          yy: value.compareOptions.yy === undefined ?
              that.compareOptions.yy :
              value.compareOptions.yy,
          mm: value.compareOptions.mm === undefined ?
              that.compareOptions.mm :
              value.compareOptions.mm,
          dd: value.compareOptions.dd === undefined ?
              that.compareOptions.dd :
              value.compareOptions.dd,
          h: value.compareOptions.h === undefined ?
              that.compareOptions.h :
              value.compareOptions.h,
          m: value.compareOptions.m === undefined ?
              that.compareOptions.m :
              value.compareOptions.m,
          s: value.compareOptions.s === undefined ?
              that.compareOptions.s :
              value.compareOptions.s,
        };
      }
 else {
        compareOptions = that.compareOptions;
      }
      const tmp = {};

      tmp[filedName] = {
        '==': moment().utc(),
        'compareOptions': compareOptions,
      };

return tmp;
    },
  },
  equalExactDate: {
    type: {
      specificDate: 'Your target date.acceptable format : "YYYY-MM-DD ZZ" ',
    },
    get compareOptions() {
      return {
        yy: true,
        mm: true,
        dd: true,
        h: false,
        m: false,
        s: false,
      };
    },
    isDateTime: true,
    style: function(filedName, value) {
      let compareOptions;
      const that = this;

      if (value.compareOptions) {
        compareOptions = {
          yy: value.compareOptions.yy === undefined ?
              that.compareOptions.yy :
              value.compareOptions.yy,
          mm: value.compareOptions.mm === undefined ?
              that.compareOptions.mm :
              value.compareOptions.mm,
          dd: value.compareOptions.dd === undefined ?
              that.compareOptions.dd :
              value.compareOptions.dd,
          h: value.compareOptions.h === undefined ?
              that.compareOptions.h :
              value.compareOptions.h,
          m: value.compareOptions.m === undefined ?
              that.compareOptions.m :
              value.compareOptions.m,
          s: value.compareOptions.s === undefined ?
              that.compareOptions.s :
              value.compareOptions.s,
        };
      }
 else {
        compareOptions = that.compareOptions;
      }
      const tmp = {};

      tmp[filedName] = {
        '==': moment(value.specificDate.split(' ').reduce((p, v, index) => {
              p.push(v);
              if (!index) {
                p.push(moment().format('HH:mm:SS'));
              }

return p;
            }, []).join(' ')
            , 'YYYY-MM-DD HH:mm:SS ZZ').utc(),
        'compareOptions': compareOptions,
      };

return tmp;
    },
  },
  next: {
    type: {
      val: 'string verbs',
    },
    get compareOptions() {
      return {
        yy: true,
        mm: true,
        dd: true,
        h: true,
        m: true,
        s: false,
      };
    },
    isDateTime: true,
    style: function(filedName, value) {
      const val = value.val.split(' ');
      const verb = val[1];
      const amount = val[0];
      let compareOptions;
      const that = this;

      if (value.compareOptions !== undefined) {
        compareOptions = {
          yy: value.compareOptions.yy === undefined ?
              that.compareOptions.yy :
              value.compareOptions.yy,
          mm: value.compareOptions.mm === undefined ?
              that.compareOptions.mm :
              value.compareOptions.mm,
          dd: value.compareOptions.dd === undefined ?
              that.compareOptions.dd :
              value.compareOptions.dd,
          h: value.compareOptions.h === undefined ?
              that.compareOptions.h :
              value.compareOptions.h,
          m: value.compareOptions.m === undefined ?
              that.compareOptions.m :
              value.compareOptions.m,
          s: value.compareOptions.s === undefined ?
              that.compareOptions.s :
              value.compareOptions.s,
        };
      }
 else {
        compareOptions = that.compareOptions;
      }
      const tmp = {};

      tmp[filedName] = {
        '>=': moment().utc(),
        '<=': moment().add(amount, verb).utc(),
        'compareOptions': compareOptions,
      };

return tmp;
    },
  },
  last: {
    type: {
      val: 'string verbs',
    },
    get compareOptions() {
      return {
        yy: true,
        mm: true,
        dd: true,
        h: true,
        m: true,
        s: false,
      };
    },
    isDateTime: true,
    style: function(filedName, value) {
      const val = value.val.split(' ');
      const verb = val[1];
      const amount = val[0];
      let compareOptions;
      const that = this;

      if (value.compareOptions) {
        compareOptions = {
          yy: value.compareOptions.yy === undefined ?
              that.compareOptions.yy :
              value.compareOptions.yy,
          mm: value.compareOptions.mm === undefined ?
              that.compareOptions.mm :
              value.compareOptions.mm,
          dd: value.compareOptions.dd === undefined ?
              that.compareOptions.dd :
              value.compareOptions.dd,
          h: value.compareOptions.h === undefined ?
              that.compareOptions.h :
              value.compareOptions.h,
          m: value.compareOptions.m === undefined ?
              that.compareOptions.m :
              value.compareOptions.m,
          s: value.compareOptions.s === undefined ?
              that.compareOptions.s :
              value.compareOptions.s,
        };
      }
 else {
        compareOptions = that.compareOptions;
      }

      const tmp = {};

      tmp[filedName] = {
        '>=': moment().subtract(amount, verb).utc(),
        '<=': moment().utc(),
        'compareOptions': compareOptions,
      };

return tmp;
    },
  },

};

module.exports = operands;
