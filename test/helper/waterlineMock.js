'use strict';

const Promise = require('bluebird');

module.exports = {
  devices: {
    find: () => ({
        populate: () => new Promise(resolve => {
            let devices = require('../../example/sampleData/Devices');

            devices.anyBooking = [devices.anyBooking];
            devices.anyFlights = [devices.anyFlights];
            devices = [devices];
            resolve(devices);
          }),
      }),
  },
};
