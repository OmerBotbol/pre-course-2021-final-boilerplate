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
    const id = req.params.id;
    try{
        const binContent = fs.readFileSync(`./task/${id}.json`);
        res.send(binContent);
    } catch(e){
        res.status(404).json({"message": "Invalid Record ID"});
    }
})

app.post('/b', (req, res) =>{
    try{
        const id = Date.now();
        const body = JSON.stringify(req.body, null, 4);
        fs.writeFileSync(`./task/${id}.json`, body);
        const successMessage ={
            success: true,
            "id": id,
            "message": "Bin added successfully"
        }
        res.send(successMessage);
    } catch{
        res.status(404).json({"massage": "Bin not found or it doesn't belong to your account"})
    }
});

app.put('/b/:id', (req, res) => {
    const body = req.body;
    const id = req.params.id;
    const binExist = fs.existsSync(`./task/${id}.json`);
    if(!binExist) {
        res.status(404).json({
            "message": "Bin not found",
            "success": false
    });
    return;
    }
    fs.existsSync(`./task/${id}.json`, body);
    const successMessage = {
        success: true,
        data: body,
        "version": 1,
        "parentId": id
    }   
    res.send(successMessage); 
})

app.delete('/b/:id', (req, res) => {
    const id = req.params.id;
    const binExist = fs.existsSync(`./task/${id}.json`);
    if(!binExist) {
        res.status(401).json({
            "message": "Bin not found or it doesn't belong to your account",
            "success": false
    });
    return;
    }
        fs.unlinkSync(`./task/${id}`);
        const successMessage = {
            success: true,
            "version": 1,
            "parentId": id,
            "message": "Bin deleted successfully"
        }   
        res.send(successMessage);
})

app.listen(3000, console.log("listening to port 3000"));