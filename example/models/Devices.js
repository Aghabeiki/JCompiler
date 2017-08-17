/**
 * Devices.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    tableName: 'devices',
    autoPK: false,
    attributes: {
        id: {
            type: 'integer',
            autoIncrement: true,
            primaryKey: true,
            size: 11
        },
        push_token: {
            type: 'string',
            required: false,
            size: 255,
            unique: true,
            index: true
        },
        email_address: {
            type: 'string',
            required: false,
            size: 255,
            index: true
        },
        mobile_number: {
            type: 'string',
            required: false,
            size: 100
        },
        firstname: {
            type: 'string',
            required: false,
            size: 100
        },
        lastname: {
            type: 'string',
            required: false,
            size: 100
        },
        gender: {
            type: 'integer',
            required: false,
            size: 1
        },
        date_of_birth: {
            type: 'datetime',
            required: false
        },
        passport_expiry: {
            type: 'datetime',
            required: false,
            index: true
        },
        language: {
            type: 'string',
            required: true,
            defaultsTo:'en',
            size: 2,
            index: true
        },
        currency: {
            type: 'string',
            required: false,
            size: 3,
            index: true
        },
        city: {
            type: 'string',
            required: false,
            size: 100,
            index: true
        },
        country: {
            type: 'string',
            required: false,
            size: 2,
            index: true
        },
        is_member: {
            type: 'boolean',
            defaultsTo: false,
            boolean: true,
            index: true
        },
        flight_stats_notification: {
            type: 'boolean',
            defaultsTo: false,
            boolean: true,
            index: true
        },
        app_version: {
            type: 'string',
            required: false,
            size: 50,
            index: true
        },
        device_type: {
            type: 'string',
            required: false,
            size: 50,
            index: true
        },
        device_os_version: {
            type: 'string',
            required: false,
            size: 50,
            index: true
        },
        device_locale: {
            type: 'string',
            required: false,
            size: 50,
            index: true
        },
        latitude: {
            type: 'string',
            required: false,
            size: 20,
            index: true
        },
        longitude: {
            type: 'string',
            required: false,
            size: 20,
            index: true
        },
        campaign_notification: {
            type: 'boolean',
            defaultsTo: false,
            boolean: true,
            index: true
        },
        appengine_citylatlong: {
            type: 'string',
            required: false,
            size: 255,
            index: true
        },
        appengine_city: {
            type: 'string',
            required: false,
            size: 255,
            index: true
        },
        appengine_region: {
            type: 'string',
            required: false,
            size: 255,
            index: true
        },
        appengine_country: {
            type: 'string',
            required: false,
            size: 255,
            index: true
        }
    }
};