const Waterline = require('waterline');
const orm = new Waterline();
const MemoryAdaptor = require('sails-memory');
const MySQLAdaptor = require('sails-mysql');
const path = require('path');
const loadDataModels = (defaultConnection) => {
    "use strict";

    return require('fs').readdirSync('./models').filter(filename => {
        return filename.endsWith('.js')
    }).map(filename => {
        let tmp = require(path.resolve('./models', filename));
        ;
        tmp.identity = tmp.tableName;
        tmp.connection = defaultConnection
        return tmp
    })
}

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

    loadDataModels(defaultConnection).map((data) => {
        return Waterline.Collection.extend(data);
    }).forEach((data) => {
        return orm.loadCollection(data);
    });


// Start Waterline passing adapters in
    orm.initialize(config, function (err, models) {
        if (err) cb(err);
        else {
            bootstrap(models.collections, (err, res) => {
                cb(err, models);
            })
        }
    });
}


const bootstrap = function (collections, cb) {
    "use strict";
    collections.devices.findOrCreate(require('./sampleData/Devices')).exec(cb);
}
