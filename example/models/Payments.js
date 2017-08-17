/**
 * Airlines.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  tableName: 'payments',
  autoPK: false,
  attributes: {
    id: {
      type: 'integer',
      //required: true,
      autoIncrement: true,
      primaryKey: true,
      size: 11
    },
    payment_method_id: {
        type: 'integer',
        required: true,
        size: 11
    },
    payment_code: {
      type: 'string',
      required: true,
      size: 255
    },
    currency: {
      type: 'string',
      required: true,
      size: 3
    },
    amount: {
      type: 'string',
      required: true,
      size: 255
    },
    trans_no:{
      type: 'string',
      required: false,
      size: 255
    },
    payment_id:{
      type: 'string',
      required: false,
      size: 255
    },
    payment_reference: {
      type: 'string',
      required: false,
      size: 255
    },
    payment_created: {
      type: 'datetime',
      required: false
    },
    payment_status: {
      type: 'string',
      required: false
    }
  }
};