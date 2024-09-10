// https://www.youtube.com/watch?v=v-fV5hAz8xE
const express = require('express');
const app = express();
const port = 8080;
const fs = require('fs');

var user_value = fs.readFileSync("/etc/secret-volume/user", 'utf8');
var pwd_value = fs.readFileSync("/etc/secret-volume/password", 'utf8');

//let user_value = 'my_user';
//let pwd_value = 'my_pwd';

app.get('/', function (req, res) {
    res.send(`<H1>Picked up from kubernetes secrets</H1> <p> The secret username: ${user_value} <p> The secret password: ${pwd_value}`);
});

app.listen(port, function () {
    console.log(`Server listening on port ${port}`);
});