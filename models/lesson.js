const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LessonSchema = new Schema({
    topic: {
        type: String,
        required: [true, 'Topic field is required']
    },
    location: {
        type: String,
        required: [true, 'Location field is required']
    },
    price: {
        type: Number,
        required: [true, 'Price field is required']
    },
    Time: {
        type: String,
        required: [true, 'Time field is required']
    },
    length: {
        type: String,
        required: [true, 'Length field is required']
    },
    rating: {
        type: Number,
        required: [true, 'Rating field is required']
    },
});

const Lesson = mongoose.model('lessons', LessonSchema);
module.exports = Lesson;