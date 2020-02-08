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
var courses = [
    { topic: 'math', location: 'hendon', price: 100, time: '12:00', length: 2, rating: 5,},
    { topic: 'math', location: 'colindale', price: 80, time: '13:00', length: 1.5, rating: 3,},
    { topic: 'math', location: 'brent cross', price: 90, time: '12:00', length: 1, rating: 4,},
    { topic: 'math', location: 'golders green', price: 120, time: '14:00', length: 2, rating: 5,},
    { topic: 'english', location: 'hendon', price: 110, time: '15:00', length: 2.5, rating: 5,},
    { topic: 'english', location: 'colindale', price: 90, time: '08:00', length: 2, rating: 4,},
    { topic: 'english', location: 'brent cross', price: 90, time: '09:00', length: 2, rating: 2,},
    { topic: 'english', location: 'golders green', price: 130, time: '10:00', length: 1, rating: 5,},
    { topic: 'sports', location: 'hendon', price: 120, time: '14:00', length: 1, rating: 5, classID: 9 },
    { topic: 'sports', location: 'golders green', price: 140, time: '16:00', length: 1.5, rating: 4,}];
//app.get('/lessons', function (req, res) {
//  res.send(JSON.stringify(lessons));
//})
app.get('/courses', (req, res) => {
    res.send(JSON.stringify(courses));
})

app.get('/users', (req, res) => {
    User.find({}, function (err, users){
        if(err){
            res.send('err');
        }
        res.send(users);
    })
})


app.post('/newuser', function (req, res) {
    const useremail = JSON.stringify(req.body.email);
    User.findOne({ email: req.body.email }, function(err, users) {
        
        if(users !== null){
        res.redirect('/');  
        }
        if(users == null){
            const userData = new User(req.body);
            userData.save();
            res.redirect('/');
        }
        if(err){
            res.send('error');
            next();
        }
    })
});
app.post('/checkuser', function (req, res) {
    console.log(JSON.stringify(req.body));
    var uemail = JSON.stringify(req.body)
    console.log(uemail);
    User.findOne({ email: req.body.email }, function(err, users) {
        console.log(users);
        res.send('err');
        if(err){
            res.send('error');
            next();
        }
    })
});

app.get('/getuser', function (req, res) {
    User.find({}, function(err, users) {
        //users[1].activity = null;
        //users[1].activity = courses;
        //res.send(users[1].activity[1]);
        res.send(JSON.stringify("hello"));
    })
})


app.use(express.static('public'));

app.listen('1000', function () {
    console.log('Server Started on 1000...')
});