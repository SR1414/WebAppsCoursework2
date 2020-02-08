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
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}));


app.use('/api', routes);


var courses = [
    { topic: 'math', location: 'hendon', price: 100, time: '12:00', length: 2, rating: 5, },
    { topic: 'math', location: 'colindale', price: 80, time: '13:00', length: 1.5, rating: 3, },
    { topic: 'math', location: 'brent cross', price: 90, time: '12:00', length: 1, rating: 4, },
    { topic: 'math', location: 'golders green', price: 120, time: '14:00', length: 2, rating: 5, },
    { topic: 'english', location: 'hendon', price: 110, time: '15:00', length: 2.5, rating: 5, },
    { topic: 'english', location: 'colindale', price: 90, time: '08:00', length: 2, rating: 4, },
    { topic: 'english', location: 'brent cross', price: 90, time: '09:00', length: 2, rating: 2, },
    { topic: 'english', location: 'golders green', price: 130, time: '10:00', length: 1, rating: 5, },
    { topic: 'sports', location: 'hendon', price: 120, time: '14:00', length: 1, rating: 5, classID: 9 },
    { topic: 'sports', location: 'golders green', price: 140, time: '16:00', length: 1.5, rating: 4, }];
//app.get('/lessons', function (req, res) {
//  res.send(JSON.stringify(lessons));
//})
app.get('/courses', (req, res) => {
    res.send(JSON.stringify(courses));
})

app.get('/users', (req, res) => {
    User.find({}, function (err, users) {
        if (err) {
            res.send('err');
        }
        res.send(users);
    })
})


app.post('/newuser', function (req, res) {
    console.log(req.body.email)
    var response = {
        activity: [],
        email: "",
        firstname: "",
        lastname: "",
        usertype: "",
        message: "",
    }
    User.findOne({ email: req.body.email }, function (err, users) {
        console.log(users);
        if (!users) {
            console.log("User does not exist");
            const userData = new User(req.body);
            userData.save();
            response.message = "Account Created";
            response.email = req.body.email;
            response.firstname = req.body.firstname;
            response.lastname = req.body.lastname;
            response.usertype = req.body.usertype;
            console.log(response)
            res.send(response);
        }
        if (users) {
            console.log("User Already exists");
            response.message = "Email Already Registered to another Account"
            res.send(response);
        }
        if (err) {
            res.send(response);
            next();
        }
    })
});
app.post('/loguser', function (req, res) {
    var response = {
        activity: [],
        email: "",
        firstname: "",
        lastname: "",
        usertype: "",
        message: "",
    }
    console.log(req.body.email);
    var uemail = JSON.stringify(req.body.email);
    console.log(uemail);
    User.findOne({ email: req.body.email }, function (err, users) {
        if (!users) {
            console.log("Invalid Email");
            response.message = "Invalid Email";
            res.send(response);
        }
        if (users) {
            console.log("Valid Email");
            if (users.password !== req.body.password) {
                console.log("Invalid Password");
                response.message = "Invalid Password";
                res.send(response);
            }
            if (users.password == req.body.password) {
                console.log("Valid Password");
                response.activity = users.activity;
                response.email = users.email;
                response.firstname = users.firstname;
                response.lastname = users.lastname;
                response.usertype = users.usertype;
                response.message = "Logged In";
                res.send(response);
            }
        }
    })

});

app.get('/getuser', function (req, res) {
    User.find({}, function (err, users) {
        //users[1].activity = null;
        //users[1].activity = courses;
        //res.send(users[1].activity[1]);
        res.send(JSON.stringify(users));
    })
})


app.use(express.static('public'));

app.listen('1000', function () {
    console.log('Server Started on 1000...')
});