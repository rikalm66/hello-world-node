const express = require('express');
const app = express();
const port = 8080;
const fs = require('fs');

try {
    var user_value = fs.readFileSync("/etc/secret-volume/user", 'utf8');
} catch (err) {
    user_value = err;
}

try {
    var pwd_value = fs.readFileSync("/etc/secret-volume/password", 'utf8');
} catch (err) {
    pwd_value = err;
}

app.get('/', function (req, res) {
    res.send(`<H1>Picked up from kubernetes secrets, mounted as a volume</H1> <p> The secret username: ${user_value} <p> The secret password: ${pwd_value}`);
});

app.listen(port, function () {
    console.log(`Server listening on port ${port}`);
});