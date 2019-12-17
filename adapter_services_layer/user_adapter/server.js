const express = require('express');

const db = require('./query_db');

const app = express();

app.use(express.json())

const PORT = 80;


app.get('/users', async (req, res) => {
    res.status(200).json(await db.getUsers());
});
app.post('/users', async (req, res) => {
    let id = req.body.id;
    let username = req.body.username;
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let chatId = req.body.chatId;

    //TODO: check on params

    let response = await db.addUser(id, username, firstName, lastName, chatId);
    res.status(201).json(response);
});


app.get('/users/:id', async (req, res) => {
    let id = req.params.id;

    res.status(200).json(await db.getUser(id));
});
app.put('/users/:id', async (req, res) => {
    let id = req.params.id;
    let username = req.body.username;
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let chatId = req.body.chatId;

    //TODO: check on params

    res.status(200).json(await db.updateUser(id, username, firstName, lastName, chatId));
});
app.delete('/users/:id', async (req, res) => {
    let id = req.params.id;
    res.status(200).json(await db.deleteUser(id));
});

app.listen(PORT, () => {
    console.log(`Server running at: http://localhost:${PORT}/`);
});