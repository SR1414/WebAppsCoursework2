const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LessonSchema = new Schema({
    topic: String,
    location: String,
    school: String,
    price: Number,
    time: String,
    length: String,
    rating: Number,
    reviews: Array
});

const Lesson = mongoose.model('lessons', LessonSchema);
module.exports = Lesson;