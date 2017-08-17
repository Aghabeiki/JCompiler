/**
 * Devices_flights.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  tableName: 'devices_ferris',
  autoPK:false,
  attributes: {
    id: {
      type: 'integer',
     // required: true,
      autoIncrement: true,
      primaryKey: true,
      size: 11
    },
    device_id: {
      type: 'integer',
      required: true,
      size: 11
    },
    ferry_id: {
      type: 'integer',
      required: true,
      size: 11
    }
  }
};