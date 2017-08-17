/**
 * Countries.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  tableName: 'countries',
  autoCreatedAt: false,
  autoUpdatedAt: false,
  autoPK: false,
  attributes: {
    id: {
      type: 'string',
      required: true,
      primaryKey: true,
      size: 2
    },
    alpha_3_code: {
      type: 'string',
      required: true,
      size: 3
    },
    name: {
      type: 'string',
      required: true,
      size: 255
    },
    capital: {
      type: 'string',
      required: false,
      size: 255
    },
    continent_id: {
      type: 'string',
      required: false,
      size: 2
    },
    timezones: {
      type: 'string',
      required: false,
      size: 255
    },
    calling_codes: {
      type: 'string',
      required: false,
      size: 255
    },
    population: {
      type: 'integer',
      required: false,
      size: 11
    },
    latitude: {
      type: 'float',
      required: false
    },
    longitude: {
      type: 'float',
      required: false
    },
    nationality: {
      type: 'string',
      required: false,
      size: 255
    },
    native_name: {
      type: 'string',
      required: false,
      size: 255
    },
    country_numeric_code: {
      type: 'integer',
      required: false,
      size: 11
    },
    flag: {
      type: 'string',
      required: false,
      size: 255
    },
    holidays: {
      collection: 'Holiday',
      via: 'country'
    },
    currency: {
      collection: 'currencies',
      via: 'country_code',
      dominant: true
    },
    language: {
      collection: 'languages',
      via: 'country_code',
      dominant: true
    },
    name_translation: {
      collection: 'countries_translation',
      via: 'country_code'
    }
  }
};
