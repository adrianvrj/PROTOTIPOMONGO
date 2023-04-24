const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const Task = require('./models/task');

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    user: 'admin',
    pass: 'admin'
};

mongoose.connect('mongodb://localhost:27017/proyecto', options)
    .then(() => console.log('Conexión exitosa a la base de datos'))
    .catch(err => console.log(err));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

app.set('view engine', 'ejs');

app.listen(8888, () => {
    console.log('Servidor iniciado en el puerto 8888');
});

app.get('/', async (req, res) => {
    const tasks = await Task.find();
    res.render('index', { tasks });
});

app.get('/new', (req, res) => {
    res.render('new');
});

app.post('/new', async (req, res) => {
    const task = new Task(req.body);
    await task.save();
    res.redirect('/');
});

app.get('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const task = await Task.findById(id);
    res.render('edit', { task });
});

app.post('/edit/:id', async (req, res) => {
    const { id } = req.params;
    await Task.updateOne({ _id: id }, req.body);
    res.redirect('/');
});

app.get('/show/:id', async (req, res) => {
    const { id } = req.params;
    const task = await Task.findById(id);
    res.render('show', { task });
});

app.get('/delete/:id', async (req, res) => {
    const { id } = req.params;
    await Task.findByIdAndDelete(id);
    res.redirect('/');
});