/**
 * cities.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */


module.exports = {
  tableName: 'cities',
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
    latitude: {
      type: 'string',
      size: 255
    },
    longitude: {
      type: 'string',
      size: 255
    },
   /* country_code: {
      collection: 'countries',
      via: 'city_id'
    },*/
    airports: {
      collection: 'airports',
      via: 'city'
    },
    devices: {
      collection: 'devices',
      via: 'appengine_city_id'
    }
  }
};
