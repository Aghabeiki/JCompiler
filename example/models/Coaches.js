/**
 * Flights.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  tableName: 'coaches',
  autoPK: false,
  attributes: {
    id: {
      type: 'integer',
      // required: true,
      autoIncrement: true,
      primaryKey: true,
      size: 11,
    },
    pnr: {
      type: 'string',
      required: false,
      size: 10,
    },
    airline_iata_code: {
      type: 'string',
      required: false,
      size: 5,
    },
    carrier_code: {
      type: 'string',
      required: false,
      size: 2,
    },
    flight_number: {
      type: 'string',
      required: false,
      size: 4,
    },
    origin: {
      type: 'string',
      required: false,
      size: 3,
    },
    destination: {
      type: 'string',
      required: false,
      size: 3,
    },
    STD: {
      type: 'datetime',
      required: false,
    },
    STA: {
      type: 'datetime',
      required: false,
    },
    STDOrg: {
      type: 'string',
      required: true,
      size: 255,
    },
    STAOrg: {
      type: 'string',
      required: true,
      size: 255,
    },
    departure_gate: {
      type: 'string',
      required: false,
      size: 5,
    },
    arrival_gate: {
      type: 'string',
      required: false,
      size: 5,
    },
    baggage_belt: {
      type: 'string',
      required: false,
      size: 5,
    },
    class_of_service: {
      type: 'string',
      required: false,
      size: 25,
    },
    ETA: {
      type: 'string',
      required: false,
      size: 225,
    },
    ETD: {
      type: 'string',
      required: false,
      size: 255,
    },
    ATD: {
      type: 'string',
      required: false,
      size: 225,
    },
    ATA: {
      type: 'string',
      required: false,
      size: 225,
    },
    ownerDevice: {
      collection: 'devices',
      via: 'anyCoaches',
      through: 'devices_coaches',
    },
  },
};
