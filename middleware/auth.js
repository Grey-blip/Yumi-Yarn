
const event = require('../models/event');

//check if user is a guest
exports.isGuest = (req, res, next) =>{
    if(!req.session.user){
        return next();
    }else{
        req.flash('error', 'You are logged in already');
        return res.redirect('/users/profile');
    }
};

//check if the user is authenticated 
exports.isLoggedIn = (req, res, next) =>{
    console.log('Checking if user is logged in...');
    if(req.session.user){
        return next();
    }else{
        req.flash('error', 'You need to log in first');
        return res.redirect('/users/login');
    }
};

exports.isAuthor = (req, res, next) =>{
    let id = req.params.id;
    /*if(!id.match(/^[0-9a-fA-F]{24}$/)){
        let err = new Error('Invalid story id');
        err.status = 400;
        return next(err);
    }*/
    event.findById(id)
    .then(event=>{
        if(event){
            if(event.hostName.equals(req.session.user._id)){
                return next();
            }else{
                let err = new Error('Unauthorized to access the resource');
                err.status = 401;
                return next(err);
            }
        }else{
            let err = new Error('The server cannot locate event with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err));
};

//If the user rsvps for their own event they get sent an error
exports.rsvpAuthor = (req, res, next) =>{
    let id = req.params.id;
    event.findById(id)
    .then(event=>{
        if(event){
            if(event.hostName.equals(req.session.user._id)){
                let err = new Error('Unauthorized to access to RSVP');
                err.status = 401;
                return next(err);
            }else{
                return next();
            }
        }else{
            let err = new Error('The server cannot locate event with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err));
};