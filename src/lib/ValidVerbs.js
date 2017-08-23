/**
 * @namespace  verbList
 * @desc <p> the valid verbs</p<br>
 * @property {string} push_token - scope : user
 * @property email_address
 * @property mobile_number
 * @property firstname
 * @property lastname
 * @property gender
 * @property date_of_birth
 * @property passport_expiry
 * @property language
 * @property currency
 * @property city
 * @property country
 * @property is_member
 * @property flight_stats_notification
 * @property campaign_notification
 * @property app_version
 * @property device_type
 * @property device_os_version
 * @property device_locale
 * @property pnr
 * @property flight_number
 * @property origin_airport
 * @property destination_airport
 * @property std
 * @property sta
 * @property passenger_count
 * @property has_children
 * @property has_infant
 * @property payment_status
 * @property payment_hold_datetime
 * @property checkin_status
 * @property geofence
 * @property latitude
 * @property longitude
 * @property radius
 * @const
 */

const verbList = [
    {"push_token": ""},
    {"email_address": ""},
    {"mobile_number": ""},
    {"firstname": ""},
    {"lastname": ""},
    {
        "gender": {
            maps: ['devices', 'gender'],
            acceptableOperand: ['eql'],
            fieldName: 'gender',
            valuePreProcessor: function (v) {
                let newVal = {};
                const manWords = ['man', 'm', 'male', 'boy']
                Object.keys(v).forEach(key => {
                    "use strict";
                    newVal[key] = manWords.map(menWord => {
                        return menWord.toLowerCase()
                    }).indexOf(v[key]) != -1 ? 1 : 0
                })
                return newVal
            }
        }
    },
    {
        "date_of_birth": {
            maps:['devices','date_of_birth'],
            acceptableOperand: ['today'],
            fieldName:'date_of_birth'
        }
    },
    {"passport_expiry": ""},
    {"language": ""},
    {"currency": ""},
    {"city": ""},
    {
        "country": {
            maps: ['devices', 'country'],
            acceptableOperand: ['eql', 'inList', 'exList'],
            fieldName: 'country'
        }
    },
    {"is_member": ""},
    {"flight_stats_notification": ""},
    {"campaign_notification": ""},
    {
        "app_version": {
            maps: ['devices', 'app_version'],
            acceptableOperand: ['eql', 'lessThan', 'greaterThan', 'exList'],
            fieldName: 'app_version'
        }
    },
    {
        "device_type": {

            maps: ['devices', 'device_type'],
            acceptableOperand: ['eql', 'inList', 'exList'],
            fieldName: 'device_type'
        }
    },
    {
        "device_os_version": {
            maps: ['devices', 'device_os_version'],
            acceptableOperand: ['eql', 'inList', 'exList'],
            fieldName: 'device_os_version'
        }
    },
    {"device_locale": ""},
    {
        "pnr": {
            maps: ['bookings', 'pnr'],
            acceptableOperand: ['eql', 'inList', 'exList'],
            fieldName: 'pnr'
        }
    },
    {
        "flight_number": {
            maps: ['flights', 'flight_number'],
            acceptableOperand: ['eql', 'inList', 'exList'],
            fieldName: 'flight_number'
        }
    },
    {"origin_airport": ""},
    {
        "destination_airport": {

            maps: ['flights', 'destination'],
            acceptableOperand: ['eql', 'inList', 'exList'],
            fieldName: 'destination_airport'
        }
    },
    {"std": ""},
    {"sta": ""},
    {
        "passenger_count": {
            maps: ['bookings', 'passenger_count'],
            acceptableOperand: ['eql', 'lessThan', 'greaterThan', 'exList', 'between'],
            fieldName: 'passenger_count'
        }
    },
    //  {"has_children": ""},
    //  {"has_infant": ""},
    {"payment_status": ""},
    {"payment_hold_datetime": ""},
    {"checkin_status": ""}//,
    //  {"geofence": ""},
    //   {"latitude": ""},
    //   {"longitude": ""},
    //   {"radius": ""}
].reduce((p, v) => {
    "use strict";


    let key = Object.keys(v)[0];
    p[key] = {
        maps: v[key].maps || [],
        acceptableOperand: v[key].acceptableOperand || [],
        fieldName: key,
        get isDevice() {
            return this.maps[0] == 'devices'
        },
        get isFlight() {
            return this.maps[0] == 'flights'
        },
        get isBooking() {
            return this.maps[0] == 'bookings'
        },
        valuePreProcessor: v[key].valuePreProcessor || function (value) {
            return value
        }
    }
    return p;
}, {})

module.exports = verbList;
