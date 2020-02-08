const express = require('express')
const app = express();
const bodyParser = require('body-parser')
const routes = require('./routes/api')
const mongoose = require('mongoose');


//bring in models
let Lesson = require('./models/lesson');
let User = require('./models/user');

mongoose.connect('mongodb://localhost/skoolapp', {
    useUnifiedTopology: true,
    useNewUrlParser: true
});

// allow cross origin access 
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json())
app.use('/api', routes);


app.use(bodyParser.json())
const lessons = [
    { 'topic': 'math', 'location': 'hendon', 'price': 100 },
    { 'topic': 'math', 'location': 'colindale', 'price': 80 },
    { 'topic': 'math', 'location': 'brent cross', 'price': 90 },
    { 'topic': 'math', 'location': 'golders green', 'price': 120 },
];
//app.get('/lessons', function (req, res) {
//  res.send(JSON.stringify(lessons));
//})

app.post('/newuser', function (req, res) {
    console.log(req.body);
    const userData = new User(req.body);
    userData.save();
    res.redirect('/');
});

app.post('/getuser', function (req, res) {
    User.find(req.body, function(err, users) {
        if(err){
            res.send('FUCK');
            next();
        }
        res.json(users);
    })
})


app.use(express.static('public'));

app.listen('1000', function () {
    console.log('Server Started on 1000...')
});