/**
 * Created by roten on 5/4/17.
 */

module.exports = {
    tableName: 'message_activity',
    attributes: {
        message_id: {
            type: 'integer',
            required: true

        },
        details: {
            type: 'string',
            size: 255,
            required: true

        },
        push_token: {
            type: 'string',
            size: 255,
            required: true
        },
        status: {
            /*
                0 -> Message Body not available;
                1 -> waiting for sending
                2 -> send failed , err is in status_details
                3 -> send success
             */
            type: 'integer',
            required: true
        },
        status_details: {
            type: 'string',
            size: 255,
            required: false
        }

    }
}