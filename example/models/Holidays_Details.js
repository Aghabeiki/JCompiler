/**
 * Created by roten on 7/5/17.
 */



module.exports = {
  attributes: {
    title: {
      type: 'string'
    },
    details: {
      type: 'string'
    },
    lang:{
      type:'string'
    },
    holiday: {
      model: 'Holiday'
    }

  }
}
