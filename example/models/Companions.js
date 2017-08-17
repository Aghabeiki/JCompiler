/**
 * Companions.js
 *
 * @description :: Stores list of all registered companions
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  tableName: 'companions',
  autoCreatedAt: true,
  autoUpdatedAt: true,
  autoPK:false,
  attributes: {
    id: {
      type: 'integer',
      autoIncrement: true,
      primaryKey: true,
      size: 11,
      index: true
    },
    client_id: {
      type: 'integer',
      required: true,
      size: 11,
      index: true
    },
    client_user_id: {
      type: 'string',
      required: false,
      size: 255,
      index: true
    },
    push_token: {
      type: 'string',
      required: false,
      size: 255,
      index: true
    },
    title: {
      type: 'string',
      required: true,
      size: 5
    },
    firstname: {
      type: 'string',
      required: true,
      size: 255
    },
    lastname: {
      type: 'string',
      required: true,
      size: 255
    },
    dob: {
      type: 'datetime',
      required: false
    },
    gender: {
      type: 'string',
      required: true,
      size: 1
    },
    flyer_airline_code: {
      type: 'string',
      required: false,
      size: 2,
      index: true
    },
    flyer_id: {
      type: 'string',
      required: false,
      size: 255
    },
    seat_preference: {
      type: 'string',
      size: 255,
      index: true
    },
    meal_preference: {
      type: 'string',
      size: 255,
      index: true
    },
    phone_type: {
      type: 'integer',
      required: false,
      size: 1
    },
    country_code: {
      type: 'string',
      required: false,
      size: 10,
      index: true
    },
    phone_number: {
      type: 'string',
      required: false,
      size: 50
    },
    email_address: {
      type: 'string',
      size: 255,
      index: true
    },
    nationality: {
      type: 'string',
      size: 2,
      index: true
    }
  }
};