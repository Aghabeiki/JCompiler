'use strict';

/**
 * @namespace  verbList
 * @desc <p> the valid verbs</p<br>
 * @property {email_address}                                 - allowed operands   {@link Operands.eql eql},
 *      {@link Operands.like like}                           - top Key: device
 * @property {mobile_number}                                 - allowed operands   {@link Operands.eql eql},
 *      {@link Operands.like like}                           - top Key: device
 * @property {firstname}                                     - allowed operands   {@link Operands.eql eql},
 *      {@link Operands.like like}                           - top Key: device
 * @property {lastname}                                      - allowed operands   {@link Operands.eql eql},
 *      {@link Operands.like like}                           - top Key: device
 * @property {gender}                                        - allowed operands   {@link Operands.eql eql}
 *                                                           - top Key: device
 * @property {date_of_birth}                                 - allowed operands   {@link Operands.today today},
 *      {@link Operands.equalExactDate equalExactDate}       - top Key: device
 * @property {passport_expiry}                               - allowed operands   {@link Operands.next next},
 *      {@link Operands.next next},
 *      {@link Operands.today today},
 *      {@link Operands.equalExactDate equalExactDate}       - top Key:  device
 * @property {language}                                      - allowed operands   {@link Operands.eql eql},
 *      {@link Operands.inList inList},
 *      {@link Operands.exList exList}                       - top key: device
 * @property {currency}                                      - allowed operands   {@link Operands.eql eql},
 *      {@link Operands.inList inList},
 *      {@link Operands.exList exList}                       - top Key:  device
 * @property {hometown}                                      - allowed operands   {@link Operands.eql eql},
 *      {@link Operands.inList inList},
 *      {@link Operands.exList exList}                       - top Key:  device
 * @property {country}                                       - allowed operands   {@link Operands.eql eql},
 *      {@link Operands.inList inList},
 *      {@link Operands.exList exList}                       - top Key:  device
 * @property {is_member}                                     - allowed operands   {@link Operands.eql eql}
 *                                                           - top Key:  device
 * @property {flight_stats_notification}                     - allowed operands   {@link Operands.eql eql},
 *      {@link Operands.inList inList},
 *      {@link Operands.exList exList}                       - top Key: device
 * @property {campaign_notification}                         - allowed operands   {@link Operands.eql eql}
 *                                                           - top Key: device
 * @property {app_version}                                   - allowed operands   {@link Operands.eql eql},
 *      {@link Operands.inList inList},
 *      {@link Operands.exList exList},
 *      {@link Operands.like like}                           - top Key:  device
 * @property {device_type}                                   - allowed operands   {@link Operands.eql eql},
 *      {@link Operands.inList inList},
 *      {@link Operands.exList exList},
 *      {@link Operands.like like}                           - top Key:  device
 * @property {device_os_version}                             - allowed operands   {@link Operands.eql eql},
 *      {@link Operands.inList inList},
 *      {@link Operands.exList exList},
 *      {@link Operands.like like}                           -  top Key:  device
 * @property {device_locale}                                 - allowed operands   {@link Operands.eql eql},
 *      {@link Operands.inList inList},
 *      {@link Operands.exList exList}                       - top Key:  device
 * @property {pnr}                                           - allowed operands   {@link Operands.eql eql},
 *      {@link Operands.inList inList},
 *      {@link Operands.exList exList},
 *      {@link Operands.like like}                           - top Key:  booking
 * @property {flight_number}                                 - allowed operands   {@link Operands.eql eql},
 *      {@link Operands.inList inList},
 *      {@link Operands.exList exList},
 *      {@link Operands.like like}                           - top Key:  flight
 * @property {origin_airport}                                - allowed operands   {@link Operands.eql eql},
 *      {@link Operands.inList inList},
 *      {@link Operands.exList exList},
 *      {@link Operands.like like}                           - top Key:  flight
 * @property {destination_airport_IATA_CODE}                 - allowed operands   {@link Operands.eql eql},
 *      {@link Operands.inList inList},
 *      {@link Operands.exList exList}                       - top Key:  flight
 * @property {destination_airport_city_name}                 - allowed operands   {@link Operands.eql eql},
 *      {@link Operands.inList inList},
 *      {@link Operands.exList exList}                       - top Key:  flight
 * @property {std}                                           - allowed operands   {@link Operands.next next},
 *      {@link Operands.last last},
 *      {@link Operands.today today},
 *      {@link Operands.equalExactDate equalExactDate}       - top Key:  flight
 * @property {sta}                                           - allowed operands   {@link Operands.next next},
 *      {@link Operands.next next},
 *      {@link Operands.today today},
 *      {@link Operands.equalExactDate equalExactDate}       - top Key:  flight
 * @property {passenger_count}                               - allowed operands   {@link Operands.eql eql},
 *      {@link Operands.lessThan lessThan},
 *      {@link Operands.greaterThan greaterThan},
 *      {@link Operands.inList inList},
 *      {@link Operands.exList exList},
 *      {@link Operands.between between}                     - top Key:  booking
 * @property {child_count}                                   - allowed operands   {@link Operands.eql eql},
 *      {@link Operands.lessThan lessThan},
 *      {@link Operands.greaterThan greaterThan},
 *      {@link Operands.inList inList},
 *      {@link Operands.exList exList},
 *      {@link Operands.between between}                     - top Key:  booking
 * @property {infant_count}                                  - allowed operands   {@link Operands.eql eql},
 *      {@link Operands.lessThan lessThan},
 *      {@link Operands.greaterThan greaterThan},
 *      {@link Operands.inList inList},
 *      {@link Operands.exList exList},
 *      {@link Operands.between between}                     - top key:  booking
 * @property {payment_status}                                - allowed operands   {@link Operands.eql eql},
 *      {@link Operands.inList inList},
 *      {@link Operands.exList exList},                      - top Key: booking
 * @property {payment_hold_datetime}                         - allowed operands   {@link Operands.next next},
 *      {@link Operands.next next},
 *      {@link Operands.today today},
 *      {@link Operands.equalExactDate equalExactDate}       - top key:  booking
 * @property {current_location_city_name}                    - allowed operands   {@link Operands.eql eql}
 *                                                           - top key:  device
 * @property {average_flight_per_month_exclude_to_month_ago} - allowed operands   {@link Operands.eql eql},
 * {@link Operands.greaterThan greaterThan},
 * {@link Operands.lessThan lessThan}                        - top Key:  flight

 */

const verbList = [
  {
    'email_address': {
      maps: ['devices', 'email_address'],
      acceptableOperand: ['eql','like'],
      fieldName: 'email_address',
    },
  },
  {
    'mobile_number': {
      maps: ['devices', 'mobile_number'],
      acceptableOperand: ['eql','like'],
      fieldName: 'mobile_number',
    },
  },
  {
    'firstname': {
      maps: ['devices', 'firstname'],
      acceptableOperand: ['eql','like'],
      fieldName: 'firstname',
    },
  },
  {
    'lastname': {
      maps: ['devices', 'lastname'],
      acceptableOperand: ['eql','like'],
      fieldName: 'lastname',
    },
  },
  {
    'gender': {
      maps: ['devices', 'gender'],
      acceptableOperand: ['eql'],
      fieldName: 'gender',
      valuePreProcessor: v => {
        const newVal = {};
        const manWords = ['man', 'm', 'male', 'boy'];

        Object.keys(v).
          forEach(key => {
            newVal[key] = manWords.map(menWord => menWord.toLowerCase()).
              indexOf(v[key].val) != -1 ? 1 : 0;
          });

        return newVal;
      },
    },
  },
  {
    'date_of_birth': {
      maps: ['devices', 'date_of_birth'],
      acceptableOperand: ['today', 'equalExactDate'],
      fieldName: 'date_of_birth',
    },
  },
  {
    'passport_expiry': {
      maps: ['devices', 'passport_expiry'],
      acceptableOperand: ['next', 'last', 'today', 'equalExactDate'],
      fieldName: 'passport_expiry',
    },
  },
  {
    'language': {
      maps: ['devices', 'language'],
      acceptableOperand: ['eql', 'inList', 'exList'],
      fieldName: 'language',
      valuePreProcessor: v => v.toLowerCase(),
    },
  },
  {
    'currency': {
      maps: ['devices', 'currency'],
      acceptableOperand: ['eql', 'inList', 'exList'],
      fieldName: 'currency',
      valuePreProcessor: v => v.toLowerCase(),
    },
  },
  {
    'hometown': {
      maps: ['devices', 'city'],
      acceptableOperand: ['eql', 'inList', 'exList'],
      fieldName: 'city',
    },
  },
  {
    'country': {
      maps: ['devices', 'country'],
      acceptableOperand: ['eql', 'inList', 'exList'],
      fieldName: 'country',
    },
  },
  {
    'is_member': {
      maps: ['devices', 'is_member'],
      acceptableOperand: ['eql'],
      fieldName: 'gender',
      valuePreProcessor: v => {
        const newVal = {};
        const manWords = ['yes', 'true'];

        Object.keys(v).
          forEach(key => {
            newVal[key] = manWords.map(menWord => menWord.toLowerCase()).
              indexOf(v[key]) != -1 ? 1 : 0;
          });

        return newVal;
      },
    },
  },
  {
    'flight_stats_notification': {
      maps: ['devices', 'flight_stats_notification'],
      acceptableOperand: ['eql', 'inList', 'exList'],
      fieldName: 'flight_stats_notification',
      valuePreProcessor: v => {
        const newVal = {};
        const manWords = ['true', 'active'];

        Object.keys(v).
          forEach(key => {
            newVal[key] = manWords.map(menWord => menWord.toLowerCase()).
              indexOf(v[key]) !== -1 ? 1 : 0;
          });

        return newVal;
      },
    },
  },
  {
    'campaign_notification': {
      maps: ['devices', 'gender'],
      acceptableOperand: ['eql'],
      fieldName: 'gender',
      valuePreProcessor: v => {
        const newVal = {};
        const manWords = ['true', 'active'];

        Object.keys(v).
          forEach(key => {
            newVal[key] = manWords.map(menWord => menWord.toLowerCase()).
              indexOf(v[key]) !== -1 ? 1 : 0;
          });

        return newVal;
      },
    },
  },
  {
    'app_version': {
      maps: ['devices', 'app_version'],
      acceptableOperand: ['eql', 'inList', 'exList','like'],
      fieldName: 'app_version',
    },
  },
  {
    'device_type': {

      maps: ['devices', 'device_type'],
      acceptableOperand: ['eql', 'inList', 'exList','like'],
      fieldName: 'device_type',
    },
  },
  {
    'device_os_version': {
      maps: ['devices', 'device_os_version'],
      acceptableOperand: ['eql', 'inList', 'exList','like'],
      fieldName: 'device_os_version',
    },
  },
  {
    'device_locale': {
      maps: ['devices', 'device_locale'],
      acceptableOperand: ['eql', 'inList', 'exList'],
      fieldName: 'device_locale',
      valuePreProcessor: v => v.toLowerCase(),
    },
  },
  {
    'pnr': {
      maps: ['bookings', 'pnr'],
      acceptableOperand: ['eql', 'inList', 'exList','like'],
      fieldName: 'pnr',
    },
  },
  {
    'flight_number': {
      maps: ['flights', 'flight_number'],
      acceptableOperand: ['eql', 'inList', 'exList','like'],
      fieldName: 'flight_number',
    },
  },
  {
    'origin_airport': {

      maps: ['flights', 'origin'],
      acceptableOperand: ['eql', 'inList', 'exList','like'],
      fieldName: 'origin_airport',
    },
  },
  {
    'destination_airport_IATA_CODE': {

      maps: ['flights', 'destination'],
      acceptableOperand: ['eql', 'inList', 'exList'],
      fieldName: 'destination_airport',
    },
  },
  {
    'destination_airport_city_name': {
      maps: ['T_flights', 'F_destination',
        'F_iata_code', 'T_airports', 'F_city',
        'F_id', 'T_cities', 'F_name'],
      acceptableOperand: ['eql', 'inList', 'exList'],
      fieldName: 'destination_airport',
    },
  },
  {
    'std': {
      maps: ['flights', 'std'],
      acceptableOperand: ['next', 'last', 'today', 'equalExactDate'],
      fieldName: 'std',
    },
  },
  {
    'sta': {
      maps: ['flights', 'sta'],
      acceptableOperand: ['next', 'last', 'today', 'equalExactDate'],
      fieldName: 'sta',
    },
  },
  {
    'passenger_count': {
      maps: ['bookings', 'passenger_count'],
      acceptableOperand: [
        'eql',
        'lessThan',
        'greaterThan',
        'exList',
        'between'],
      fieldName: 'passenger_count',
    },
  },
  {
    'child_count': {
      maps: ['bookings', 'child_count'],
      acceptableOperand: [
        'eql',
        'lessThan',
        'greaterThan',
        'exList',
        'between'],
      fieldName: 'child_count',
    },
  },
  {
    'infant_count': {
      maps: ['bookings', 'infant_count'],
      acceptableOperand: [
        'eql',
        'lessThan',
        'greaterThan',
        'exList',
        'between'],
      fieldName: 'infant_count',
    },
  },
  {
    'payment_status': {
      maps: ['bookings', 'status'],
      acceptableOperand: ['eql', 'inList', 'exList'],
      fieldName: 'payment_status',
    },
  },
  {
    'payment_hold_datetime': {
      maps: ['bookings', 'hold_datetime'],
      acceptableOperand: ['next', 'last', 'today','equalExactDate'],
      fieldName: 'std',
    },
  },
  {
    'current_location_city_name': {
      maps: ['devices', 'appengine_city'],
      acceptableOperand: ['eql'],
      fieldName: 'appengine_city_under_device',
    },
  },
  {
    'average_flight_per_month_exclude_to_month_ago': {
      maps: ['T_flights', 'F_STD', 'C_count', 'C_last_2_M', 'POST_avrage_per_month'],
      acceptableOperand: ['eql', 'greaterThan', 'lessThan'],
      fieldName: 'average_flight_per_month',
    },
  },

  /* ,
  {"checkin_status": ""}, todo -> ask nazar
  {"geofence": ""}, //
  {"latitude": ""},
  {"longitude": ""},
  {"radius": ""}*/
].reduce((p, v) => {
  const key = Object.keys(v)[0];

  p[key] = {
    maps: v[key].maps || [],
    acceptableOperand: v[key].acceptableOperand || [],
    fieldName: key,
    get isDevice() {
      return this.maps[0] === 'devices' || this.maps[0].replace('T_', '')==='devices';
    },
    get isFlight() {
      return this.maps[0] === 'flights' || this.maps[0].replace('T_', '')==='flights';
    },
    get isBooking() {
      return this.maps[0] === 'bookings' || this.maps[0].replace('T_', '')==='bookings';
    },
    isValidScope(scope) {
      let res=false;

      switch (scope.toLowerCase()) {
        case 'device':
          res=this.isDevice;
          break;
        case 'flight':
          res=this.isFlight;
          break;
        case 'booking':
          res=this.isBooking;
          break;
      }

      return res;
    },
    get shouldPreProcessed() {
      return this.maps.length >2;
    },
    get calcRequired() {
      return this.maps.filter(item=>item.startsWith('C_')).length>0;
    },
    valuePreProcessor: v[key].valuePreProcessor || function(value) {
      return value;
    },
  };

  return p;
}, {});

module.exports = verbList;
