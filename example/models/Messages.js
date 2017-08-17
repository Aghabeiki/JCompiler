/**
 * Message.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
        airline_iata_code: {
            type: 'string',
            size: 4,
            required: true
        },

        message_code: {
            type: "string",
            size: 255,
            required: true
        },
        language_code: {
            type: "string",
            size: 4,
            required: true
        },
        message: {
            type: 'string',
            size: 1024,
            required: true
        },

        deep_link:{
            type: 'string',
            size:255,
            required:false
        },
        enable:{
            type: 'boolean',
            required:true,
            defaultsTo:false
        }
    }
};

