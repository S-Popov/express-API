const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    next();
});

const tasks = [
    {id: 1, desc: "kurec", completed: true},
    {id: 2, desc: "golqm kurec", completed: false},
    {id: 3, desc: "hui", completed: false}
]

app.get('/', (req, res) =>{
    res.send('Hello World!!!');
});

app.get('/api/tasks', (req, res) => {
    res.send(tasks);
});

app.post('/api/tasks', (req, res) => {
    const {error} = validateTask(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const task = {
        id: tasks.length + 1,
        desc: req.body.desc,
        completed: false,
    };
    tasks.push(task);
    res.send(task);
});

app.put('/api/tasks/:id', (req, res) => {
    const task = tasks.find(t => t.id === parseInt(req.params.id));
    if (!task) return res.status(404).send('The task with the given id cannot be found'); 
 
    //400 Bad Request
    const {error} = validateTask(req.body);
    if(error) return res.status(400).send(error.details[0].message);
        
    task.desc = req.body.desc;
    res.send(task);
});

function validateTask(task) {
    const schema = {
        desc: Joi.string().min(5).required()
    };
    return Joi.validate(task, schema);
}

app.delete('/api/tasks/:id', (req, res) => {
    const task = tasks.find(t => t.id === parseInt(req.params.id));
    if (!task) return res.status(404).send('The task with the given id cannot be found'); 

    const index = tasks.indexOf(task);
    tasks.splice(index, 1);

    res.send(task);
});

app.get('/api/tasks/:id', (req, res) => {
    const task = tasks.find(t => t.id === parseInt(req.params.id));
    if (!task) return res.status(404).send('The task with the given id cannot be found'); 
    res.send(task);
});


// creating an environmental variable for production
// PORT
// to change port in cmd 
//      $set PORT=5000
//      $nodemon index.js
//      $Listening on port 5000...
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`))