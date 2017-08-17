/**
 * Created by roten on 7/24/17.
 */

const uuid = require('uuid');
module.exports = {
  autoPK: false,
  attributes: {
    id: {
      type: 'string',
      primaryKey: true,
      unique: true,
      defaultsTo: function () {
        return uuid.v4();
      }
    },
    ordinal_path: {
      type: 'string',
      required: true,
      unique: true
    },
    iata_code_owner: {
      type: 'string'
    }

  }
}
