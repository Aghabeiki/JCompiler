/**
 * Airlines.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  tableName: 'airports',
  autoCreatedAt: false,
  autoUpdatedAt: false,
  autoPK:false,
  attributes: {
    id: {
      type: 'integer',
      autoIncrement: true,
      primaryKey: true,
      size: 11
    },
    name: {
      type: 'string',
      required: true,
      size: 255
    },
    city: {
      model: 'cities'
    },
   /* country_code: {
      model: 'countries'
    },*/
    iata_code: {
      type: 'string',
      required: true,
      size: 3
    },
    icao_code: {
      type: 'string',
      required: false,
      size: 4
    },
    latitude: {
      type: 'string',
      required: false,
      size: 255
    },
    longitude: {
      type: 'string',
      required: false,
      size: 255
    },
    altitude: {
      type: 'string',
      required: false,
      size: 255
    },
    timezone_offset: {
      type: 'string',
      required: false,
      size: 100
    },
    timezone_format: {
      type: 'string',
      required: false,
      size: 100
    },
    daylight_saving_time: {
      type: 'string',
      required: false,
      size: 100
    }
  }
};
