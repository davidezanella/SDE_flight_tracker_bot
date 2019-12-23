const express = require('express');
const fetch = require('node-fetch');
const qs = require('query-string');

const app = express();

const PORT = 80;
const TOKEN = process.env.TOKEN;

const url = "https://api.openrouteservice.org/v2/directions/";

app.get('/', async (req, res) => {
  let startLat = req.query.startLat;
  let startLon = req.query.startLon;
  let endLat = req.query.endLat;
  let endLon = req.query.endLon;

  let meanOfTransport = req.query.mean;
  if(meanOfTransport === 'car')
    meanOfTransport = 'driving-car';
  else if(meanOfTransport === 'foot')
    meanOfTransport = 'foot-walking';
  else if(meanOfTransport === 'cycle')
    meanOfTransport = 'cycling-regular';
  else{
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
  if (response.status == 200){
    let data = await response.json();
    if (data.features.length == 0)
      res.status(400).send('No routes available!');
    else {
      let result = data.features[0].properties.summary;
      res.status(200).json(result);
    }
  }
  else {
    res.sendStatus(response.status);
  }
});

app.listen(PORT, () => {
  console.log(`Server running at: http://localhost:${PORT}/`);
});
