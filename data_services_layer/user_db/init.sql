CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    username VARCHAR(30) NOT NULL,
    firstName VARCHAR(30) NOT NULL,
    lastName VARCHAR(30),
    chatId INTEGER NOT NULL
);