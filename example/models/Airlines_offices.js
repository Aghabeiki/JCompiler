/**
 * Airlines_offices.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    tableName: 'airlines_offices',
    autoCreatedAt: false,
    autoUpdatedAt: false,
    autoPK: false,
    attributes: {
        id: {
            type: 'integer',
            // required: true,
            autoIncrement: true,
            primaryKey: true,
            size: 11
        },
        airline_id: {
            type: 'string',
            required: true,
            size: 2
        },
        country_id: {
            type: 'string',
            required: true,
            size: 2
        },
        city: {
            type: 'string',
            required: true,
            size: 255
        },
        name: {
            type: 'string',
            required: false,
            size: 255
        },
        telephone_no: {
            type: 'string',
            required: false,
            size: 255
        },
        fax_no: {
            type: 'string',
            required: false,
            size: 255
        },
        email_address: {
            type: 'string',
            required: false,
            size: 255
        },
        address: {
            type: 'string',
            required: false,
            size: 255
        },
        office_hours: {
            type: 'string',
            required: false,
            size: 255
        },
        ticketing_office_hours: {
            type: 'string',
            required: false,
            size: 255
        },
        image_url: {
            type: 'string',
            required: false,
            size: 255
        },
        office_type: {
            type: 'string',
            required: true,
            size: 50
        },
        latitude: {
            type: 'string',
            required: false,
            size: 255
        },
        longitude: {
            type: 'string',
            required: false,
            size: 255
        },
        locale: {
            type: 'string',
            required: false,
            size: 255
        }
    }
};