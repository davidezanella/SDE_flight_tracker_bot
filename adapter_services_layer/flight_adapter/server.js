const express = require('express');
const fetch = require('node-fetch');
const qs = require('query-string');

const app = express();

const PORT = 80;
const KEY = process.env.KEY;
const SECRET = process.env.SECRET;

const url = "";

app.get('/flights', async (req, res) => {
  
});

app.get('/flights/:id', async (req, res) => {
  
});

app.listen(PORT, () => {
  console.log(`Server running at: http://localhost:${PORT}/`);
});
