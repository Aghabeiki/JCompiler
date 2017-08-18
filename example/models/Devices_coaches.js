/**
 * Devices_flights.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    tableName: 'devices_coaches',
    tables: ['devices', 'coaches'],
    junctionTable: true,
    attributes: {
        id: {
            type: 'integer',
            // required: true,
            autoIncrement: true,
            primaryKey: true,
            size: 11
        },
        device_id: {
            columnName: 'device_id',
            model: 'devices'
        },
        ferry_id: {
            columnName: 'ferry_id',
            model: 'coaches'
        }
    }
};
