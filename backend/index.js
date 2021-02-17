const express = require('express');
const app = express();
const fs= require('fs');
const {readFileSync} = require('fs');


app.use(express.json());

app.get('/b', (req, res) =>{
    const listOfTasks=[];
    fs.readdirSync('./task').forEach(file => {
        let task = JSON.parse(readFileSync(`./task/${file}`, {encoding: 'utf8', flag: 'r'}))
        listOfTasks.push(task)
    });
    res.send(listOfTasks);
});
app.get('/b/:id', (req, res) => {
    fs.readdirSync('./task').forEach(file => {
        if(file === req.params.id){
            res.send(JSON.parse(readFileSync(`./task/${file}`, {encoding: 'utf8', flag: 'r'})))
        }
    });
})

app.post('/b', (req, res) =>{
    const body = JSON.stringify(req.body, null, 4);
    fs.writeFileSync(`./task/${Date.now()}.json`, body);
    res.send(body);

});

app.put('/b/:id', (req, res) => {
    const body = JSON.stringify(req.body, null, 4);
    fs.writeFileSync(`./task/${req.params.id}`, body);
    res.send('update success');
})

app.delete('/b/:id', (req, res) => {
    fs.unlinkSync(`./task/${req.params.id}`);
    res.send('the file has deleted');
})

app.listen(3000, console.log("listening to port 3000"));