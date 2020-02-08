const express = require('express');
const router = express.Router();
const Lesson = require('../models/lesson');
const User = require('../models/user')


//GET a list of test from db
router.get('/test', function (req, res) {
    res.send({ type: 'GET' });
});

//add new to lesson db
router.post('/test', function (req, res) {
    console.log(req.body);
    Lesson.create(req.body).then(function (lesson) {
        res.send(lesson);
        
    });

});

//add new to lesson db
router.post('/newuser', function (req, res) {
    const userData = new User(req.body);
    userData.save();
});



//update db
router.put('/test/:id', function (req, res) {
    res.send({ type: 'PUT' });
});

//DELETE from db
router.delete('/test/:id', function (req, res) {
    res.send({ type: 'DELETE' });
});

module.exports = router;