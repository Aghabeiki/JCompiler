/**
 * Bookings.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  tableName: 'bookings',
  autoPK: false,
  attributes: {
    id: {
      type: 'integer',
      autoIncrement: true,
      primaryKey: true,
      size: 11,
      index: true,
    },
    pnr: {
      type: 'string',
      required: true,
      size: 10,
      index: true,
    },
    booking_no: {
      type: 'string',
      size: 10,
      index: true,
    },
    airline_iata_code: {
      type: 'string',
      size: 2,
      index: true,
    },
    campaign_id: {
      type: 'string',
      size: 255,
      index: true,
    },
    booking_datetime: {
      type: 'datetime',
    },
    passenger_count: {
      type: 'integer',
      size: 5,
    },
    adult_count: {
      type: 'integer',
      size: 5,
    },
    child_count: {
      type: 'integer',
      size: 5,
    },
    infant_count: {
      type: 'integer',
      size: 5,
    },
    gender_male: {
      type: 'integer',
      required: true,
      size: 5,
    },
    gender_female: {
      type: 'integer',
      required: true,
      size: 5,
    },
    gender_others: {
      type: 'integer',
      required: true,
      size: 5,
    },
    currency: {
      type: 'string',
      size: 3,
      index: true,
    },
    amount: {
      type: 'float',
    },
    status: {
      type: 'string',
      required: true,
      string: 255,
      index: true,
    },
    hold_datetime: {
      type: 'datetime',
      required: false,
    },
    appengine_citylatlong: {
      type: 'string',
      required: false,
      size: 255,
      index: true,
    },
    appengine_city: {
      type: 'string',
      required: false,
      size: 255,
      index: true,
    },
    appengine_region: {
      type: 'string',
      required: false,
      size: 255,
      index: true,
    },
    appengine_country: {
      type: 'string',
      required: false,
      size: 255,
      index: true,
    },
    ownerDevice: {
      collection: 'devices',
      via: 'anyBooking',
      through: 'devices_bookings',
    },
  },
};
