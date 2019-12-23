const express = require('express');
const fetch = require('node-fetch');
const qs = require('query-string');

const app = express();
app.use(express.json())

const PORT = 80;
const TOKEN = process.env.TOKEN;

const url = "https://api.openrouteservice.org/v2/directions/";

app.post('/', async (req, res) => {
  let startLat = req.body.startLat;
  let startLon = req.body.startLon;
  let endLat = req.body.endLat;
  let endLon = req.body.endLon;

  let meanOfTransport = req.body.mean;
  if (meanOfTransport === 'car')
    meanOfTransport = 'driving-car';
  else if (meanOfTransport === 'foot')
    meanOfTransport = 'foot-walking';
  else if (meanOfTransport === 'cycle')
    meanOfTransport = 'cycling-regular';
  else {
    res.status(400).send('Invalid mean of transport parameter!');
    return;
  }

  //TODO: checks on params

  let params = {
    'api_key': TOKEN,
    'start': startLon + ',' + startLat,
    'end': endLon + ',' + endLat
  };

  let response = await fetch(url + meanOfTransport + '?' + qs.stringify(params));
  if (response.status == 200) {
    let data = await response.json();
    if (data.features.length == 0)
      res.status(400).send('No routes available!');
    else {
      let result = data.features[0].properties.summary;
      res.status(200).json(result);
    }
  } else {
    console.log(await response.text(), params);
    res.sendStatus(response.status);
  }
});

app.listen(PORT, () => {
  console.log(`Server running at: http://localhost:${PORT}/`);
});