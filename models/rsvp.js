const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rsvpSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    event:{type: Schema.Types.ObjectId, ref: 'Event', required: true},
    status:{type: String, enum: ['Yes', 'No', 'Maybe'], required: [true, 'RSVP cannot be empty']}
});

module.exports = mongoose.model('Rsvp', rsvpSchema);

