/**
 * Airlines.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  tableName: 'clients',
  autoPK:false,
  attributes: {
    id: {
      type: 'integer',
      //required: true,
      autoIncrement: true,
      primaryKey: true,
      size: 11
    },
    airline_iata_code: {
      type: 'string',
      required: true
    },
    airline_name: {
      type: 'string',
      required: true,
      size: 255
    },
    api_key: {
      type: 'string',
      required: true,
      size: 255
    },
    carrier_codes: {
      type: 'string',
      required: true,
      size: 255
    },
    contact_name: {
      type: 'string',
      required: false
    },
    contact_email: {
      type: 'string',
      required: false
    }
  }
};