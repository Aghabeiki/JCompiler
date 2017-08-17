/**
 * Currencies.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  tableName: 'currencies',
  autoCreatedAt: false,
  autoUpdatedAt: false,
  autoPK:false,
  attributes: {
    id: {
      type: 'string',
      required: true,
      primaryKey: true,
      size: 3
    },
    numeric_id: {
      type: 'string',
      required: false,
      size: 11
    },
    decimal_points: {
      type: 'integer',
      required: false,
      size: 1
    },
    name: {
      type: 'string',
      required: false,
      size: 255
    },
    symbol: {
      type: 'string',
      required: false,
      size: 10
    },
    country_code: {
      collection: 'countries',
      via: 'currency'
    }
  }
};