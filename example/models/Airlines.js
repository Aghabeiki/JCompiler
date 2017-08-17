/**
 * Airlines.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */


module.exports = {
  tableName: 'airlines',
  autoCreatedAt: false,
  autoUpdatedAt: false,
  autoPK:false,
  attributes: {
    id: {
      type: 'integer',
      //required: true,
      autoIncrement: true,
      primaryKey: true,
      size: 11
    },
    name: {
      type: 'string',
      required: true,
      size: 255
    },
    iata_code: {
      type: 'string',
      required: true,
      size: 2
    },
    icao_code: {
      type: 'string',
      required: false,
      size: 3
    },
    active: {
      type: 'integer',
      required: true,
      size: 1
    },
    website: {
      type: 'string',
      required: false,
      size: 255
    },
    sns_facebook: {
      type: 'string',
      required: false,
      size: 255
    },
    sns_twitter: {
      type: 'string',
      required: false,
      size: 255
    },
    sns_instagram: {
      type: 'string',
      required: false,
      size: 255
    },
    sns_youtube: {
      type: 'string',
      required: false,
      size: 255
    },
    sns_google: {
      type: 'string',
      required: false,
      size: 255
    }
  }
};
