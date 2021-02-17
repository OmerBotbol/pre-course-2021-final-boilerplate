const express = require('express');
const app = express();
const {readFileSync} = require('fs');
const data = readFileSync("./tasks.json", {encoding: 'utf8', flag: 'r'})

app.get('/b', (req, res) =>{
    res.send(data)
});

app.listen(3000);