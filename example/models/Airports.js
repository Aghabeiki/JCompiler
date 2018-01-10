/**
 * Airlines.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  tableName: 'airports',
  attributes: {
    id: {
      type: 'integer',
      autoIncrement: true,
      primaryKey: true,
      size: 11
    },
    IATA_CODE:{
      type:'string',
      required:true
    },
    name: {
      type: 'string',
      required: true,
      size: 255
    },
    city: {
      model: 'citys'
    }
  }
};
