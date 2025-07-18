const eventModel = require('../models/event');
const rsvpModel = require('../models/rsvp');
const { DateTime} = require('luxon');


exports.index = (req, res, next) =>{
    eventModel.find()
    .then(events=>res.render('./events/index', {events}))
    .catch(err=>next(err));
    
};

exports.new = (req, res) =>{
    res.render('./events/new');
};

exports.create = (req, res, next) =>{
    console.log("Form Data:", req.body);
    let event = eventModel(req.body);

    try {
        /*if (req.body.start) {
            event.start = DateTime.fromISO(req.body.start, "yyyy-LL-dd'T'HH:mm").toJSDate();
            console.log("Parsed Start Date:", event.start);
            //if (!event.start) throw new Error('Invalid start date format');
            if (event.start <= new Date()) {
                req.flash('error', 'Start date must be in the future');
                return res.redirect('back');
            }
            
        }
        if (req.body.end) {
            event.end = DateTime.fromISO(req.body.end, "yyyy-LL-dd'T'HH:mm").toJSDate();
            console.log("Parsed End Date:", event.end);
            if (event.end <= event.start) {
                req.flash('error', 'End date must be after the start date');
                return res.redirect('back');
            }
            //req.flash('error', 'end must be after start');
            //if (!event.end) throw new Error('Invalid end date format');
        }
        */
        if (req.body.start) {
            event.start = req.body.start; // Mongoose should cast this
            console.log("Start Date (raw):", req.body.start); // Log raw start date
            console.log("Start Date (parsed):", event.start); // Log Mongoose-parsed date
            if (new Date(event.start) <= new Date()) {
                req.flash('error', 'Start date must be in the future');
                return res.redirect('back');
            }
        }
        if (req.body.end) {
            event.end = req.body.end; // Mongoose should cast this
            console.log("End Date (raw):", req.body.end); // Log raw end date
            console.log("End Date (parsed):", event.end); // Log Mongoose-parsed date
            if (new Date(event.end) <= new Date(event.start)) {
                req.flash('error', 'End date must be after the start date');
                return res.redirect('back');
            }
        }
    } catch (error) {
        console.error("Error Parsing Dates:", error);
        error.status = 400;
        return next(error);
    }
     
    if (req.file) {
        console.log("Uploaded file name:", req.file.filename); 
        event.image = req.file.filename; 
    } else {
        console.log('No image uploaded!');
    }
    event.hostName = req.session.user;
    console.log("Event Object Before Save:", event);
    event.save()
    .then(event =>{
        req.flash('success', 'Event was created successfully!');
        res.redirect('/events');
    })
    .catch(err =>{
        console.error("Database Save Error:", err);
        if(err.name === 'ValidationError'){
            console.error("Validation Error Details:", err.errors);
            err.status = 400;
            req.flash('error', Object.values(err.errors).map(e => e.message).join(', '));
        return res.redirect('back');
        }
        next(err);
    });
};

//updated this now show all rsvps for each event
exports.show = (req, res, next) => {
    let id = req.params.id;
    Promise.all([
        eventModel.findById(id).populate('hostName', 'firstName lastName'),
        rsvpModel.countDocuments({event: id, status: 'Yes'})
    ])
    
    .then(([events, rsvpCount]) =>{
        if(events){
            console.log(events);
            events.startForm = DateTime.fromJSDate(events.start).toFormat('EEE, MMMM dd yyyy, h:mma');
            events.endForm = DateTime.fromJSDate(events.end).toFormat('h:mma');
            res.render('./events/oneEvent', {events, rsvpCount});
        }else{
            let err = new Error('The server cannot locate event with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err));
};

exports.edit = (req, res, next) => {
    let id = req.params.id;
    eventModel.findById(id)
    .then(event=>{
            event.startForm = DateTime.fromJSDate(event.start).toFormat("yyyy-LL-dd'T'HH:mm");
            event.endForm = DateTime.fromJSDate(event.end).toFormat("yyyy-LL-dd'T'HH:mm");
            res.render('./events/edit', {event});
    })
    .catch(err=>next(err));
};

exports.update = (req, res, next) => {
    let event = req.body;
    let id = req.params.id;
    
    if(req.file){
        event.image = req.file.filename;
    }

    try {
        /*if (req.body.start) {
            event.start = DateTime.fromISO(req.body.start).toJSDate();
            req.flash('error', 'start must be after today');
            //if (!event.start) throw new Error('Invalid start date format');
        }
        if (req.body.end) {
            event.end = DateTime.fromISO(req.body.end).toJSDate();
            req.flash('error', 'end must be after start');
            //if (!event.end) throw new Error('Invalid end date format');
        }*/
        if (req.body.start) {
            event.start = req.body.start;
            console.log("Start Date (raw):", req.body.start);
            console.log("Start Date (parsed):", new Date(event.start));
            if (new Date(event.start) <= new Date()) {
                req.flash('error', 'Start date must be in the future');
                return res.redirect('back');
            }
        }

        if (req.body.end) {
            event.end = req.body.end; 
            console.log("End Date (raw):", req.body.end);
            console.log("End Date (parsed):", new Date(event.end));
            if (new Date(event.end) <= new Date(event.start)) {
                req.flash('error', 'End date must be after the start date');
                return res.redirect('back');
            }
        }
    } catch (error) {
        error.status = 400;
        return next(error);
    }

    eventModel.findByIdAndUpdate(id, event, {useFindAndModify: false, runValidators: true})
    .then(event => {
            req.flash('success', 'Event was updated successfully!');
            res.redirect('/events/' + id);
    })
    .catch(err=>{
        if(err.name === 'ValidationError')
            err.status = 400;
        next(err)
    });
    
};

//chnaged to delete all accosiated rsvps attached to the event
exports.delete = (req, res, next) => {
    let id = req.params.id;
    rsvpModel.deleteMany({event: id})
    .then(() =>{
        return eventModel.findByIdAndDelete(id, {useFindAndModify: false})
    })
    .then(event=>{
        if(!event){
            throw new Error('No event found');
        }
        req.flash('success', 'Event was deleted successfully!');
            res.redirect('/events');
    })
    .catch(err=>next(err));
    
};

exports.rsvp = (req, res, next) => {
    let eventId = req.params.id;
    let userId = req.session.user._id;
    let status = req.body.status;
    
    rsvpModel.findOneAndUpdate({user: userId, event: eventId}, {status: status}, {upsert: true, new: true})
    .then(rsvp =>{
        req.flash('success', 'Your RSVP has been recorded: ' + status);
        res.redirect('/users/profile');
    })
    .catch(err=>next(err));
};