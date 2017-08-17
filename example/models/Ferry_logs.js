/**
 * Created by roten on 5/1/17.
 */



module.exports = {
    tableName: 'ferry_logs',
    autoPK: false,
    attributes: {
        id: {
            type: 'integer',
            //required: true,
            autoIncrement: true,
            primaryKey: true,
            size: 11
        },
        original_id: {
            type: 'integer',
            required: true
        },
        airline_iata_code: {
            type: 'string',
            required: false,
            size: 5
        },
        flight_number: {
            type: 'string',
            required: false,
            size: 10
        },
        origin: {
            type: 'string',
            required: false,
            size: 3
        },
        destination: {
            type: 'string',
            required: false,
            size: 3
        },
        STD: {
            type: 'datetime',
            required: false
        },
        STA: {
            type: 'datetime',
            required: false
        },
        STDOrg: {
            type: 'string',
            required: true,
            size: 255
        },
        STAOrg: {
            type: 'string',
            required: true,
            size: 255
        },
        departure_gate: {
            type: 'string',
            required: false,
            size: 5
        },
        arrival_gate: {
            type: 'string',
            required: false,
            size: 5
        },
        baggage_belt: {
            type: 'string',
            required: false,
            size: 5
        },
        class_of_service: {
            type: 'string',
            required: false,
            size: 25
        },
        ETA: {
            type: 'string',
            required: false,
            size: 225
        },
        ETD: {
            type: 'string',
            required: false,
            size: 255
        },
        ATD: {
            type: 'string',
            required: false,
            size: 225
        },
        ATA: {
            type: 'string',
            required: false,
            size: 225
        }
    }

}