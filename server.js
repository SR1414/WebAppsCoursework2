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
    { topic: 'math', location: 'hendon', school: 'Middlesex University', price: 100, time: '12:00', length: 2, rating: 5, reviews: [] },
    { topic: 'math', location: 'colindale', school: 'St James Catholic High School', price: 80, time: '13:00', length: 1.5, rating: 3, reviews: [] },
    { topic: 'math', location: 'brent cross', school: 'North London Tutorial College', price: 90, time: '12:00', length: 1, rating: 4, reviews: [] },
    { topic: 'math', location: 'golders green', school: 'Golders Green College', price: 120, time: '14:00', length: 2, rating: 5, reviews: [] },
    { topic: 'english', location: 'hendon', school: 'Wentworth College', price: 110, time: '15:00', length: 2.5, rating: 5, reviews: [] },
    { topic: 'english', location: 'colindale', school: 'Barnet and Southgate College', price: 90, time: '08:00', length: 2, rating: 4, reviews: [] },
    { topic: 'english', location: 'brent cross', school: 'Whitefield School', price: 90, time: '09:00', length: 2, rating: 2, reviews: [] },
    { topic: 'english', location: 'golders green', school: 'The King Alfred School', price: 130, time: '10:00', length: 1, rating: 5, reviews: [] },
    { topic: 'sports', location: 'hendon', school: 'Brampton College', price: 120, time: '14:00', length: 1, rating: 5, reviews: [] },
    { topic: 'sports', location: 'golders green', school: 'Hampstead School', price: 140, time: '16:00', length: 1.5, rating: 4, reviews: [] }];
/*var i;
var x;
Lesson.find({ topic: courses[1].topic, location: courses[1].location, school: courses[1].school, price: courses[1].price }, function (err, lessons) {
    if (lessons.length == 0) {
        for (i = 0; i <= courses.length-1; i++) {
            const lessonData = new Lesson(courses[i]);
            lessonData.save();
        }
        courses
    }
    if (lessons.length !== 0) {
        console.log("There are lessons")
        Lesson.find({}, function (err, lessons) {
            console.log(lessons.length-1);
        })

    }

})
*/
app.get('/courses', (req, res) => {
    Lesson.find({}, function (err, lessons) {
        if (lessons.length == 0) {
            for (i = 0; i <= courses.length - 1; i++) {
                const lessonData = new Lesson(courses[i]);
                lessonData.save();
                Lesson.find({}, function (err, lessons) {
                })
            }
            res.send(lessons);
        }
        if (lessons.length !== 0) {
            res.send(lessons);
        }

        if (err) {
            res.send('err');
        }
    })


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
        reviews: [],
        email: "",
        firstname: "",
        lastname: "",
        usertype: "",
        password: "",
        message: ""
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
                response.reviews = users.reviews;
                response.email = users.email;
                response.firstname = users.firstname;
                response.lastname = users.lastname;
                response.usertype = users.usertype;
                response.password = users.password;
                response.message = "Logged In";
                res.send(response);
            }
        }
    })

});

app.post('/updateuser', function (req, res) {
    console.log(req.body.currentuseremail);
    User.findOne({ email: req.body.email }, function (err, users) {
        if (users.length !== 0) {
            console.log("Email Already Registered")
            return;
        }
        if (users.length == 0) {
            User.findOne({ email: req.body.currentuseremail }, function (err, users) {
                console.log(users)
                User.updateOne({ email: users.email }, { $set: { email: req.body.email, firstname: req.body.firstname, lastname: req.body.lastname, password: req.body.password } })
                    .catch(function (error, affect, resp) {
                        console.log("updated");
                    })
                console.log("updated user");
            })
        }
    })

})
app.post('/deleteuser', function (req, res) {
    var response = {
        message: ''
    }
    User.deleteOne({ email: req.body.currentuseremail }, function (err){
        console.log("Account Deleted");
        res.send(response);
    })
})
app.post('/deleteuser', function (req, res) {
    var response = {
        message: ''
    }
    User.deleteOne({ email: req.body.currentuseremail }, function (err){
        console.log("Account Deleted");
        res.send(response);
    })
})
app.post('/deleteclass', function (req, res) {
    var response = {
        message: ''
    }

    Lesson.deleteOne({ topic: req.body.selectedtopic, school: req.body.selectedschool }, function (err){
        console.log("Class Deleted");
        response.message = "Class Deleted";
        res.send(response);
    })
})

app.post('/newreview', function (req, res) {
    Lesson.findOne({ topic: req.body.selectedtopic, school: req.body.selectedschool }, function (err, lessons) {
        //var x = lessons.reviews[1].authoremail;
        //var y = req.body.email;
        //console.log(x);
        //console.log(y);
        //console.log(x == y);
        console.log(lessons.reviews.length)
        if (lessons.reviews.length == 0) {
            console.log("no reviews");
            Lesson.updateOne({ topic: req.body.selectedtopic, school: req.body.selectedschool }, { $push: { reviews: { authoremail: req.body.email, authorfirstname: req.body.firstname, authorlastname: req.body.lastname, authorreview: req.body.userreview } } }).catch(function (error, affect, resp) {
                console.log("review saved");
            })
            Lesson.updateOne({ topic: req.body.selectedtopic, school: req.body.selectedschool }, { $set: { rating: req.body.userrating } }).catch(function (error, affect, resp) {
                console.log("review saved");
            })
        }
        if (lessons.reviews.length !== 0) {
            for (i = 0; i <= lessons.reviews.length - 1; i++) {
                console.log(lessons.reviews[i]);

                if (lessons.reviews[i].authoremail == req.body.email) {
                    console.log(lessons.reviews);
                    lessons.reviews[i].authorreview = req.body.userreview;
                    lessons.rating = req.body.userrating;
                    console.log(lessons.reviews);
                    console.log("true")
                    Lesson.updateOne({ topic: req.body.selectedtopic, school: req.body.selectedschool }, { $set: { reviews: lessons.reviews, rating: lessons.rating } }).catch(function (error, affect, resp) {
                        console.log("review saved");
                    })
                }
                if (lessons.reviews[i].authoremail !== req.body.email) {
                    Lesson.updateOne({ topic: req.body.selectedtopic, school: req.body.selectedschool }, { $push: { reviews: { authoremail: req.body.email, authorfirstname: req.body.firstname, authorlastname: req.body.lastname, authorreview: req.body.userreview } } }).catch(function (error, affect, resp) {
                        console.log("review saved");
                    })
                    Lesson.updateOne({ topic: req.body.selectedtopic, school: req.body.selectedschool }, { $set: { rating: req.body.userrating } }).catch(function (error, affect, resp) {
                        console.log("review saved");
                    })
                }
            }
        }
        //Lesson.updateOne({school: lessons.school },{$set: {reviews: y }, function(err, result) {
        //console.log(result);
        //}})




    })


})

app.get('/getuser', function (req, res) {
    console.log(req.body);
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