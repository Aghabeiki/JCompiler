/**
 * Countries_Translation.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  tableName: 'countries_translation',
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
    country_code: {
      model: 'countries'
    },
    de: {
      type: 'string',
      required: false,
      size: 255
    },
    es: {
      type: 'string',
      required: false,
      size: 255
    },
    fr: {
      type: 'string',
      required: false,
      size: 255
    },
    ja: {
      type: 'string',
      required: false,
      size: 255
    },
    it: {
      type: 'string',
      required: false,
      size: 255
    },
    br: {
      type: 'string',
      required: false,
      size: 255
    },
    pt: {
      type: 'string',
      required: false,
      size: 255
    },
    th: {
      type: 'string',
      required: false,
      size: 255
    }
  }
};