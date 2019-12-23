const fetch = require('node-fetch');
const qs = require('query-string');

const urlUser = "http://user_adapter/";
const urlFlight = "http://flight_adapter/";

async function getUser(userId) {
    let url = urlUser + 'users/' + userId;

    let res = await fetch(url);

    user = await res.json();
    return user;
}

async function getFlight(flightNumber) {
    let url = urlFlight + `flights/` + flightNumber;

    let res = await fetch(url);

    return await res.json();
}

module.exports = {
    getUser,
    getFlight
}