/**
 * Created by roten on 7/17/17.
 */

module.exports = {
  attributes: {
    channel: {
      type: 'string'
    },
    name: {
      type: 'string'
    },
    campaign: {
      collection: 'Campaigns_Details',
      via: 'channel'
    }
  }
}
