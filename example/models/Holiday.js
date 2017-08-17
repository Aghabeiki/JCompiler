/**
 * Created by roten on 6/29/17.
 */




module.exports = {
    attributes: {
        year: {
            type: 'integer'
        },
        month: {
            type: 'integer'
        },
        day: {
            type: 'integer'
        },
        country: {
            model: 'countries'
        },
        details: {
            collection: 'Holidays_Details',
            via: 'holiday'
        },
        provider: {
            type: 'string',
            defaultsTo: "GoQuo",
            required: true
        }

    }
};
