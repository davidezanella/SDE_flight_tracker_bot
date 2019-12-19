const express = require('express');
const moment = require('moment');

const lh_api = require('./lufthansa');

const app = express();

const PORT = 80;
const KEY = process.env.KEY;
const SECRET = process.env.SECRET;


app.get('/flights/:airport', async (req, res) => {
  let airport = req.params.airport;

  let datetime = moment().format('YYYY-MM-DDTHH:mm');

  let access_token = await lh_api.getAccessToken(KEY, SECRET);
  try {
    let results = await lh_api.searchFlight(access_token, airport, datetime);
    let flights = results.FlightStatusResource.Flights.Flight.map(f => formatLhFlight(f));
    
    res.status(200).json(flights);
  }
  catch {
    res.status(400).json({'err': 'Invalid airport number!'});
  }
});

app.get('/flights/:number', async (req, res) => {
  let number = req.params.number;

  let date = moment().format('YYYY-MM-DD');

  let access_token = await lh_api.getAccessToken(KEY, SECRET);
  try {
    let results = await lh_api.flightStatus(access_token, number, date);
    let flight = formatLhFlight(results.FlightStatusResource.Flights.Flight[0]);
    
    res.status(200).json(flight);
  }
  catch {
    res.status(400).json({'err': 'Invalid flight number!'});
  }
});

function formatLhFlight(flight) {
  let status = flight.Arrival.TimeStatus.Code;
  let flightId = flight.OperatingCarrier.AirlineID + flight.OperatingCarrier.FlightNumber;
  let depTime = moment.utc(flight.Departure.ScheduledTimeUTC.DateTime).add(1, 'hours').toDate();
  let arrTime = moment.utc(flight.Arrival.ScheduledTimeUTC.DateTime).add(1, 'hours').toDate();
  return {
    'depAirport': flight.Departure.AirportCode,
    'arrAirport': flight.Arrival.AirportCode,
    'depTime': depTime,
    'arrTime': arrTime,
    'status': status,
    'flightId': flightId,
  }
}

/*
Time status code, possible values:
FE = Flight Early
NI = Next Information
OT = Flight On Time
DL = Flight Delayed
NO = No status
*/

app.listen(PORT, () => {
  console.log(`Server running at: http://localhost:${PORT}/`);
});
