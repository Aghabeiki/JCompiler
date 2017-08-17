/**
 * Languages.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  tableName: 'languages',
  autoCreatedAt: false,
  autoUpdatedAt: false,
  autoPK:false,
  attributes: {
    id: {
      type: 'integer',
      autoIncrement: true,
      primaryKey: true,
      size: 11,
      index: true
    },
    iso639_1: {
      type: 'string',
      required: false,
      size: 2
    },
    iso639_2: {
      type: 'string',
      required: false,
      size: 3
    },
    name: {
      type: 'string',
      required: false,
      size: 255
    },
    native_name: {
      type: 'string',
      required: false,
      size: 255
    },
    country_code: {
      collection: 'countries',
      via: 'language'
    }
  }
};