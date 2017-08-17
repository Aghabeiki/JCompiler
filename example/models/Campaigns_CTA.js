/**
 * Created by roten on 7/17/17.
 */
module.exports = {
  attributes: {
    language: {
      type: 'string',
      size: 5,
      required: true
    },
    // A CTA should have only  a single client_id
    client_id: {
      model: 'Clients'
    },
    // A CTA should have only a single Channel
    channel: {
      model: 'Channels',
      required: true
    },
    cta_title: {
      type: 'string'
    },
    cta_text: {
      type: 'string'
    },
    cta_url: {
      type: 'string'
    },
    campaign: {
      collection: 'Campaigns_Details',
      via: 'CTA'
    }
  }
}
