const fetch = require('node-fetch');
const qs = require('query-string');

const url = "https://api.lufthansa.com/v1/";
const urlFlightStatus = url + "operations/flightstatus";
const urlAirports = url + "mds-references/airports";

async function getAccessToken(key, secret) {
    let authUrl = url + 'oauth/token';

    let params = {
        'client_id': key,
        'client_secret': secret,
        'grant_type': 'client_credentials'
    }

    let res = await fetch(authUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: qs.stringify(params)
    });

    access_token = await res.json();
    return access_token.access_token;
}

async function searchFlight(access_token, destAirportCode, fromDate) {
    let searchUrl = urlFlightStatus + `/arrivals/${destAirportCode}/${fromDate}`;

    let res = await fetch(searchUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + access_token
        }
    });

    return await res.json();
}

async function flightStatus(access_token, flightNumber, date) {
    let searchUrl = urlFlightStatus + `/${flightNumber}/${date}`;

    let res = await fetch(searchUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + access_token
        }
    });

    return await res.json();
}

async function getAirport(access_token, airportCode) {
    let searchUrl = urlAirports + `/${airportCode}`;

    let res = await fetch(searchUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + access_token
        }
    });

    return await res.json();
}

module.exports = {
    getAccessToken,
    searchFlight,
    flightStatus,
    getAirport
}