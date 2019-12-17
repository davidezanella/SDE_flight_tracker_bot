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
    let columns = ['id', 'username', 'firstName', 'chatId'];
    let values = [`${id}`, `'${username}'`, `'${firstName}'`, `${chatId}`];
    if(lastName !== undefined){
        columns.push('lastName');
        values.push(`'${lastName}'`);
    }

    columns = columns.join();
    values = values.join();

    let qry = `INSERT INTO users(${columns}) VALUES 
        (${values}) RETURNING *`;
    return (await makeQuery(qry))[0];
}


async function getUser(id) {
    let qry = 'SELECT * FROM users WHERE id = ' + id;
    return (await makeQuery(qry))[0];
}
async function updateUser(id, username, firstName, lastName, chatId) {
    let lastName_set = "";
    if(lastName !== undefined)
        lastName_set = `, lastName = '${lastName}'`;
    let qry = `UPDATE users SET username = '${username}', firstName = '${firstName}', 
        chatId = ${chatId}${lastName_set} WHERE id = ${id} RETURNING *`;
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