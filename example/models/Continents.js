/**
 * Continents.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  tableName: 'continents',
  autoCreatedAt: false,
  autoUpdatedAt: false,
  autoPK:false,
  attributes: {
    id: {
      type: 'string',
      required: true,
      primaryKey: true,
      size: 2
    },
    name: {
      type: 'string',
      required: false,
      size: 255
    }
  }
};