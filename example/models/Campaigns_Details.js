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
    channel: {
      model: 'Channels'
    },
    title: {
      type:'string'
    },
    subtitle: {
      type:'string'
    },
    description: {
      type:'text'
    },
    banner_main: {
      type:'string'
    },
    banner_details: {
      type:'string'
    },
    // a campaigns details belong to one campaign
    campaign: {
      model: 'Campaigns'
    },
    CTA: {
      collection: 'Campaigns_CTA',
      via: 'campaign',
      dominant: true
    }
  }
}
