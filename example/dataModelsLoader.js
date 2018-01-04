const Waterline = require('waterline');
const orm = new Waterline();
const MemoryAdaptor = require('sails-memory');
const MySQLAdaptor = require('sails-mysql');
const DiskAdapter = require('sails-disk');

const path = require('path');
const loadDataModels = (defaultConnection) => {
    "use strict";

    return require('fs').readdirSync('./models').filter((filename) => {
        return filename.endsWith('.js')
    }).map((filename) => {
        let tmp = require(path.resolve('./models', filename));

        tmp.identity = tmp.tableName;
        tmp.connection = defaultConnection
        return tmp
    })
}

const config = {
    adapters: {
        'default': MemoryAdaptor,
        mysql: MySQLAdaptor,
        disk: DiskAdapter
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
            password: '',
            timezone: 'utc'
        },
        gcloud: {
            adapter: 'mysql',
            host: '104.199.183.208',
            user: 'root', //optional
            //   password: '', //optional
            database: 'goquo_mobile' //optional
        },
        myDisk: {
            adapter: 'disk',
            fileName: 'users.db',
            filePath: './data/'
        }
    },

    defaults: {
        migrate: 'safe'
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
            console.log('waterline is connected');
           // cb(err, models);
            bootstrap(models.collections, (err, res) => {
                console.log('preset data loaded');
                cb(err, models);
            })
        }
    });
}


const bootstrap = function (collections, cb) {
    "use strict";
    let data = require('./sampleData/Devices');
    let coash=require('./sampleData/Coaches');
    async function  orchestra(){
        let res=[];
        try{
            res.push(await collections.devices.destroy());
            res.push(await collections.devices.create(data));
            res.push(await collections.coaches.destroy());
            res.push(await collections.coaches.create(coash));
        }
        catch (err){
            res=err;
        }
        return res;
    };
    orchestra()
        .then((res)=>{
            if(res instanceof  Error){
                cb(res);
            }
            else{
                cb(null);
            }
        }).catch(cb);
    // delete data.anyBooking;
    //  delete data.anyFlights;
    //   delete data.anyFerris;
    //  delete data.anyCoaches;

}
