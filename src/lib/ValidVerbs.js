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

const verbList = {
    "push_token": "",
    "email_address": "",
    "mobile_number": "",
    "firstname": "",
    "lastname": "",
    "gender": "",
    "date_of_birth": "",
    "passport_expiry": "",
    "language": "",
    "currency": "",
    "city": "",
    "country": "",
    "is_member": "",
    "flight_stats_notification": "",
    "campaign_notification": "",
    "app_version": "",
    "device_type": {
        inDevices: true,
        maps: ['devices.device_type'],
        acceptableOperand: ['eql', 'inList', 'exList']
    },
    "device_os_version": "",
    "device_locale": "",
    "pnr": "",
    "flight_number": "",
    "origin_airport": "",
    "destination_airport": {
        inDevices: false,
        maps: ['flights.destination'],
        acceptableOperand: ['eql', 'inList', 'exList']
    },
    "std": "",
    "sta": "",
    "passenger_count": "",
    "has_children": "",
    "has_infant": "",
    "payment_status": "",
    "payment_hold_datetime": "",
    "checkin_status": "",
    "geofence": "",
    "latitude": "",
    "longitude": "",
    "radius": ""
}

module.exports = verbList;
