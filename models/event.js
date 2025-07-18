
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    category: {type: String, 
                enum: {
                    values: ['Team Building', 'Networking & Skill Building', 'Crochet a Craft', 'Yarn Market', 'Other'],
                    message: '{VALUE} is not a valid enum value for path category.'
                },
                    required: [true, 'Category is required']},
    title: {type: String, required: [true, 'title is required']},
    hostName: {type: Schema.Types.ObjectId, ref: 'User'},
    location: {type: String, required: [true, 'location is required']},
    start: {type: Date, required: [true, 'start date is required']},
    end: {type: Date, required: [true, 'end date is required']},
    details: {type: String, required: [true, 'details is required'],
        minLength: [10, 'The content should be at least 10 charaters']},
    image: {type: String, required: [true, 'image is required']}
});

module.exports = mongoose.model('Event', eventSchema);
