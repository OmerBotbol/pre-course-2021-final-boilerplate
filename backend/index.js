const express = require('express');
const app = express();
const {readFileSync} = require('fs');
const data = readFileSync("./tasks.json", {encoding: 'utf8', flag: 'r'})
console.log (data);

app.get('/b', (req, res) =>{
    res.send(data)
});
app.get('/b/:id', (req, res) => {
    const filteredTask = data.filter(task => task.id === req.params.id);
    res.send(filteredTask);
})

app.listen(3000);