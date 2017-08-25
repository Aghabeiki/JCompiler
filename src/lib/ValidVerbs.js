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
    {
        "email_address": {
            maps: ['devices', 'email_address'],
            acceptableOperand: ['eql'],
            fieldName: 'email_address'
        }
    },
    {
        "mobile_number": {
            maps: ['devices', 'mobile_number'],
            acceptableOperand: ['eql'],
            fieldName: 'mobile_number'
        }
    },
    {
        "firstname": {
            maps: ['devices', 'firstname'],
            acceptableOperand: ['eql'],
            fieldName: 'firstname'
        }
    },
    {
        "lastname": {
            maps: ['devices', 'lastname'],
            acceptableOperand: ['eql'],
            fieldName: 'lastname'
        }
    },
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
            maps: ['devices', 'date_of_birth'],
            acceptableOperand: ['today'],
            fieldName: 'date_of_birth'
        }
    },
    {
        "passport_expiry": {
            maps: ['devices', 'passport_expiry'],
            acceptableOperand: ['next', 'last', 'today'],
            fieldName: 'passport_expiry'
        }
    },
    {
        "language": {
            maps: ['devices', 'language'],
            acceptableOperand: ['eql', 'inList', 'exList'],
            fieldName: 'language',
            valuePreProcessor: function (v) {
                "use strict";
                return v.toLowerCase();
            }
        }
    },
    {
        "currency": {
            maps: ['devices', 'currency'],
            acceptableOperand: ['eql', 'inList', 'exList'],
            fieldName: 'currency',
            valuePreProcessor: function (v) {
                "use strict";
                return v.toLowerCase();
            }
        }
    },
    {
        "city": {
            maps: ['devices', 'city'],
            acceptableOperand: ['eql', 'inList', 'exList'],
            fieldName: 'city'
        }
    },
    {
        "country": {
            maps: ['devices', 'country'],
            acceptableOperand: ['eql', 'inList', 'exList'],
            fieldName: 'country'
        }
    },
    {
        "is_member": {
            maps: ['devices', 'gender'],
            acceptableOperand: ['eql'],
            fieldName: 'gender',
            valuePreProcessor: function (v) {
                let newVal = {};
                const manWords = ['true', 'active']
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
        "flight_stats_notification": {
            maps: ['devices', 'country'],
            acceptableOperand: ['eql', 'inList', 'exList'],
            fieldName: 'country'
        }
    },
    {
        "campaign_notification": {
            maps: ['devices', 'gender'],
            acceptableOperand: ['eql'],
            fieldName: 'gender',
            valuePreProcessor: function (v) {
                let newVal = {};
                const manWords = ['true', 'active']
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
        "app_version": {
            maps: ['devices', 'app_version'],
            acceptableOperand: ['eql', 'inList', 'exList'],
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
    {
        "device_locale": {
            maps: ['devices', 'device_locale'],
            acceptableOperand: ['eql', 'inList', 'exList'],
            fieldName: 'device_locale',
            valuePreProcessor: function (v) {
                return v.toLowerCase();
            }
        }
    },
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
    {
        "origin_airport": {

            maps: ['flights', 'origin'],
            acceptableOperand: ['eql', 'inList', 'exList'],
            fieldName: 'destination_airport'
        }
    },
    {
        "destination_airport": {

            maps: ['flights', 'destination'],
            acceptableOperand: ['eql', 'inList', 'exList'],
            fieldName: 'destination_airport'
        }
    },
    {
        "std": {
            maps: ['flights', 'std'],
            acceptableOperand: ['next', 'last', 'today'],
            fieldName: 'std'
        }
    },
    {
        "sta": {
            maps: ['flights', 'sta'],
            acceptableOperand: ['next', 'last', 'today'],
            fieldName: 'sta'
        }
    },
    {
        "passenger_count": {
            maps: ['bookings', 'passenger_count'],
            acceptableOperand: ['eql', 'lessThan', 'greaterThan', 'exList', 'between'],
            fieldName: 'passenger_count'
        }
    },
    {
        "child_count": {
            maps: ['bookings', 'child_count'],
            acceptableOperand: ['eql', 'lessThan', 'greaterThan', 'exList', 'between'],
            fieldName: 'child_count'
        }
    },
    {
        "infant_count": {
            maps: ['bookings', 'infant_count'],
            acceptableOperand: ['eql', 'lessThan', 'greaterThan', 'exList', 'between'],
            fieldName: 'infant_count'
        }
    },
    {"payment_status":  {
        maps: ['bookings', 'status'],
        acceptableOperand: ['eql', 'inList', 'exList'],
        fieldName: 'payment_status'
    }},
    {"payment_hold_datetime": {
        maps: ['bookings', 'hold_datetime'],
        acceptableOperand: ['next', 'last', 'today'],
        fieldName: 'std'
    }}/*,
    {"checkin_status": ""}, todo -> ask nazar
    {"geofence": ""}, //
    {"latitude": ""},
    {"longitude": ""},
    {"radius": ""}*/
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
