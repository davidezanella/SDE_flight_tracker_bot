const {
    Client
} = require('pg');

async function makeQuery(qry) {
    const client = new Client();
    await client.connect();
    const res = await client.query(qry);
    await client.end();
    return res.rows;
}

async function getUsers() {
    let qry = 'SELECT * FROM users';
    return await makeQuery(qry);
}
async function addUser(id, username, firstName, lastName, chatId) {
    //TODO: check if all params are presnt
    let qry = `INSERT INTO users(id, username, firstName, lastName, chatId) VALUES 
        (${id}, '${username}', '${firstName}', '${lastName}', ${chatId}) RETURNING *`;
    return (await makeQuery(qry))[0];
}


async function getUser(id) {
    let qry = 'SELECT * FROM users WHERE id = ' + id;
    return (await makeQuery(qry))[0];
}
async function updateUser(id, username, firstName, lastName, chatId) {
    //TODO: check if all params are presnt
    let qry = `UPDATE users SET username = '${username}', firstName = '${firstName}', 
        lastName = '${lastName}', chatId = ${chatId} WHERE id = ${id} RETURNING *`;
    return (await makeQuery(qry))[0];
}
async function deleteUser(id) {
    let qry = `DELETE FROM users WHERE id = ${id} RETURNING *`;
    return (await makeQuery(qry))[0];
}

module.exports = {
    getUsers,
    addUser,
    getUser,
    updateUser,
    deleteUser
}