const express = require('express');

const api = require('./api');

const app = express();
app.use(express.json())

const PORT = 80;

let UF_RELATIONS = [];


app.get('/flight-users', async (req, res) => {
    res.status(200).json(UF_RELATIONS);
});
app.post('/flight-users', async (req, res) => {
    let userId = req.body.userId;
    let flightNumber = req.body.flightNumber;

    let relation = {
        'userId': userId,
        'flightNumber': flightNumber
    };

    if (!UF_RELATIONS.includes(relation)) {
        UF_RELATIONS.push(relation);
        res.status(201).json(relation);
    }
    else {
        res.sendStatus(400);
    }
});


app.get('/flight-users/:userid/:flightnumber', async (req, res) => {
    let userId = req.params.userid;
    let flightNumber = req.params.flightnumber;

    let relation = {
        'userId': userId,
        'flightNumber': flightNumber
    };

    if (!UF_RELATIONS.includes(relation))
        res.sendStatus(404)
    else {
        //get user and flight info
        let user = await api.getUser(userId);
        let flight = await api.getFlight(flightNumber);
    
        let result = {
            'user': user,
            'flight': flight
        };
        res.status(200).json(result);
    }
});
app.delete('/flight-users/:userid/:flightnumber', async (req, res) => {
    let userId = req.params.userid;
    let flightNumber = req.params.flightnumber;

    let relation = {
        'userId': userId,
        'flightNumber': flightNumber
    };

    if (!UF_RELATIONS.includes(relation))
        res.sendStatus(400)
    else {
        UF_RELATIONS.splice(UF_RELATIONS.indexOf(relation), 1);
        res.status(200).json(relation);
    }
});

app.listen(PORT, () => {
    console.log(`Server running at: http://localhost:${PORT}/`);
});