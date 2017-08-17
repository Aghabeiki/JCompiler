/**
 * Airlines.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  tableName: 'payment_methods',
  autoPK: false,
  attributes: {
    id: {
      type: 'integer',
      //required: true,
      autoIncrement: true,
      primaryKey: true,
      size: 11
    },
    booking_id: {
        type: 'integer',
        required: true,
        unique:true,
        size: 11
    },
    airline_iata_code: {
      type: 'string',
      required: true,
      size: 2
    },
    payment_count: {
      type: 'integer',
      required: false,
      size: 11,
      default: 0
    }
  }
};