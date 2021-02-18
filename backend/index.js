const express = require('express');
const app = express();
const fs= require('fs');
const {readFileSync} = require('fs');


app.use(express.json());

app.get('/b', (req, res) =>{
    try{
        const listOfTasks=[];
        fs.readdirSync('./task').forEach(file => {
            let task = JSON.parse(readFileSync(`./task/${file}`, {encoding: 'utf8', flag: 'r'}))
            listOfTasks.push(task)
        });
        res.send(listOfTasks);
    } catch(e){
        res.status(404).json({massage: e})
    }
});
app.get('/b/:id', (req, res) => {
    try{
        fs.readdirSync('./task').forEach(file => {
            if(file === req.params.id){
                res.send(JSON.parse(readFileSync(`./task/${file}`, {encoding: 'utf8', flag: 'r'})))
            }
        });
    } catch(e){
        res.status(404).json({massage: e})
    }
})

app.post('/b', (req, res) =>{
    try{
        const body = JSON.stringify(req.body, null, 4);
        fs.writeFileSync(`./task/${Date.now()}.json`, body);
        res.send(body);
    } catch{
        res.status(500).json({massage: e})
    }
});

app.put('/b/:id', (req, res) => {
    try{
        const body = JSON.stringify(req.body, null, 4);
        fs.writeFileSync(`./task/${req.params.id}`, body);
        res.send('update success');
    } catch(e){
        res.status(500).json({massage: e})
    }
})

app.delete('/b/:id', (req, res) => {
    try{
        fs.unlinkSync(`./task/${req.params.id}`);
        res.send('the file has deleted');
    } catch{
        res.status(404).json({massage: e})
    }
})

app.listen(3000, console.log("listening to port 3000"));