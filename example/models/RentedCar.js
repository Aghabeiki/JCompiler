/**
 * RentedCar.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    bookingID: {
      type: 'integer'
    },
    clientUserId: {
      type: 'string'
    },
    driverEmail: {
      type:'string'
    },
    pickUp: {
      type:'json'
    },
    dropOff: {
      type:'json'
    },
    vehicle: {
      type:'json'
    },
    driverInfo: {
      type:'json'
    },
    additionalInfo: {
      type:'json'
    },
    airlineInfo: {
      type:'json'
    },
    price: {
      type:'json'
    },
    status: {
      type:'string'
    }
  }
};

