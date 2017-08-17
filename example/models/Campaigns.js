/**
 * Created by roten on 7/17/17.
 */
module.exports = {
  attributes: {
    // a campaigns should belong to one client
    client_id: {
      model: 'Clients',
      required: true
    },
    status: {
      type: 'integer',
      required: true
      /*
       1 -> draft
       2 -> ready
       3 -> live
       4 -> complete
       */
    },
    date_from: {
      type: 'datetime'
    },
    date_to: {
      type: 'datetime'
    },
    position: {
      type: 'integer'
    },
    details: {
      collection: 'Campaigns_Details',
      via: 'campaign'
    },
    category: {
      type: 'string'
    }
  },
  beforeDestroy: function (criteria, cb) {
    Campaigns.find(criteria).populate('details').exec((err, promotionsToDestroy) => {
      "use strict";
      if (err) {
        return cb(err)
      }
      Campaigns_Details.destroy({
        id: promotionsToDestroy.reduce((ids, promotion) => {
          promotion.details.forEach(detail => {
            ids.push(detail.id);
          })
          return ids;
        }, [])
      }).exec((err, res) => {
        cb(err)
      });

    })
  }
}
