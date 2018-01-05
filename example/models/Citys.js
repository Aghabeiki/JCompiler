
module.exports = {
  tableName: 'citys',
  attributes: {
    cityName:{
      type:'string'
    },
    airports:{
      collection: 'airports',
      via: 'city'
    },
  }
}
