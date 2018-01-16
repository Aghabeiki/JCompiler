'use strict';
/**
 * @namespace Operands
 * @desc Acceptable Operands
 */


const moment = require('moment');

const operands = {
// general
  /**
   * @desc check two string is like together, this command flow the like syntax in SQL language.
   * @param {string} op2
   * @example flight_number:{like:'2_5%'}
   * @memberOf Operands
   * @name like
   */
  like:{
    type:'string',
    style: function(filedName,value) {
      const tmp={};
      tmp[filedName]={'like':value};

      return tmp;
    }
  },
  /**
   * @desc check two value are eql
   * @param {string|number} op2
   * @example destination_airport_city_name:{eql:'kuala lumpur'}
   * @memberOf Operands
   * @name eql
   */
  eql: {
    type: 'string|number',
    style: function(filedName, value) {
      const tmp = {};

      tmp[filedName] = value;

      return tmp;
    },

  },
  /**
   * @desc check op1 is in target list.
   * @param {Array} op2
   * @example flight:{sta:{inList:['IKA']}}
   * @memberOf Operands
   * @name inList
   */
  inList: {
    type: 'array',
    style: function(filedName, value) {
      const tmp = {};

      tmp[filedName] = value;

      return tmp;
    },
  },
  /**
   * @desc Check Op1 dose not exist in target list.
   * @param {Array} op2
   * @example flight:{sta:{exList:['IKA']}}
   * @memberOf Operands
   * @name exList
   */
  exList: {
    type: 'array',
    style: function(filedName, value) {
      const tmp = {};

      tmp[filedName] = {'!': value};

      return tmp;
    },
  },
  // number
  /**
   * @desc Check Op1 is less than op2
   * @param {string|number} op2
   * @example infant_count:{lessThan:5}
   * @memberOf Operands
   * @name lessThan
   */
  lessThan: {
    type: 'string|number',
    style: function(filedName, value) {
      const tmp = {};

      tmp[filedName] = {'<': value};

      return tmp;
    },
  },
  /**
   * @desc Check Op1 is greater than op2
   * @param {string|number} op2
   * @example infant_count:{greaterThan:5}
   * @memberOf Operands
   * @name greaterThan
   */
  greaterThan: {
    type: 'string|number',
    style: function(filedName, value) {
      const tmp = {};

      tmp[filedName] = {'>': value};

      return tmp;
    },
  },
  /**
   * @desc Check Op1 is between OP2
   * @param {Array} op2 - The first value in Array is lowest part of compareation and the second one is upper part of compareation.
   * @example infant_count:{between:[1,2]}
   * @memberOf Operands
   * @name between
   */
  between: {
    type: 'array',
    style: function(filedName, value) {
      const tmp = {};

      tmp[filedName] = {'>': value[0], '<': value[1]};

      return tmp;
    },
  },
  // date
  /**
   * @desc Check Op1 is eql to Today date
   * @param {String} op2
   * @example passport_expiry:{ today:'today'}
   * @memberOf Operands
   * @name today
   */
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
  /**
   * @desc Check op1 be eql to a special date string.
   * @param {String} - Your target date.acceptable format : "YYYY-MM-DD ZZ"
   * @example passport_expiry: {equalExactDate: {specificDate:'2017-08-25 +08:00'}}
   * @memberOf Operands
   * @name equalExactDate
   */
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
  /**
   * @desc Check OP1 is in next time/date after the calculated op2 from today.
   * @param {{val:string,compareOptions:{
   * yy:boolean=true,mm:boolean=true,dd:boolean=true,h:boolean=true,m:boolean=true,s:boolean=false}
   * } there is some string verbs for calculating OP2.
   * @example "sta":{
    	 		"next":"24 hours"
    	 	}
   * @memberOf Operands
   * @name next
   */
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
  /**
   * @desc Check OP1 is in last time/date before the calculated OP2 from today.
   * @param {{val:string}} there is some string verbs for calculating OP2.
   * @example "sta":{
    	 		"last":"24 hours"
    	 	}
   * @memberOf Operands
   * @name last
   */
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
