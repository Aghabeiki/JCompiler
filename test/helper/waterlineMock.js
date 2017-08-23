var Promise = require("bluebird");
module.exports = {
    devices: {
        find: function (...args) {
            return {
                populate: function (...args) {
                    return new Promise((resolve, reject) => {
                        "use strict";
                        let devices = require('../../example/sampleData/Devices');
                        devices.anyBooking = [devices.anyBooking];
                        devices.anyFlights = [devices.anyFlights];
                        devices = [devices];
                        resolve(devices);
                    })
                }
            }
        }
    }
}