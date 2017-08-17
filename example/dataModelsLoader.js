const Waterline = require('waterline');
const orm = new Waterline();
const MemoryAdaptor = require('sails-memory');
const MySQLAdaptor = require('sails-mysql')

const config = {
    adapters: {
        'default': MemoryAdaptor,
        mysql: MySQLAdaptor
    },
    connections: {
        myLocalDisk: {
            adapter: 'default'
        },
        myLocalMySql: {
            adapter: 'mysql',
            host: 'localhost',
            database: 'JCompiler',
            user: 'root',
            password: ''
        }
    },

    defaults: {
        migrate: 'alter'
    }

};
module.exports = function (cb) {
    "use strict";
    const defaultConnection = 'myLocalMySql';

    const devices = require('./models/Devices');
    devices.identity = 'devices';
    devices.connection = defaultConnection
    let Devices = Waterline.Collection.extend(devices);

    const bookings = require('./models/Bookings');
    bookings.identity = 'bookings';
    bookings.connection = defaultConnection
    var Bookings = Waterline.Collection.extend(bookings);

    orm.loadCollection(Devices);
    orm.loadCollection(Bookings);


// Start Waterline passing adapters in
    orm.initialize(config, function (err, models) {
        if (err) cb(err);
        else{
            bootstrap(models.collections, (err, res) => {
                cb(err);

            })
        }



    });
}


const bootstrap = function (collections, cb) {
    "use strict";
    collections.devices.findOrCreate(require('./sampleData/Devices')).exec(cb);
}
