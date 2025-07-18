const User = require('../models/user');
const event = require('../models/event');
const rsvpModel = require('../models/rsvp');



//get the sign up form 
exports.new = (req, res) => {
        return res.render('./user/signup');
};

//creates a new user (signup)
exports.create = (req, res, next) => {
        let user = new User(req.body);
        if(user.email)
            user.email = user.email.toLowerCase();
        user.save()
        .then(()=>{
            req.flash('success', 'Registration succeeded!');
            res.redirect('/users/login');
        })
        .catch(err=>{
        if(err.name === 'ValidationError'){
            req.flash('error', err.message);
            return res.redirect('/');
        }
        if(err.code === 11000){
            req.flash('error', 'Email address has been used');
            return res.redirect('/users/signup');
        }
        next(err);
    });
    
};

//render the login page 
exports.getUserLogin = (req, res) => {

        return res.render('./user/login');

};

//process the login request 
exports.login = (req, res, next)=>{
    let { email, password } = req.body;
    if(email)
        email = email.toLowerCase();
    
    if (!email || !password) {
        req.flash('error', 'Email and password are required');
        return res.redirect('/users/login');
    }

User.findOne({ email: email }).select('+password')
.then(user => {
    if (!user) {
        console.log('wrong email address');
        req.flash('error', 'wrong email address');  
        res.redirect('/users/login');
        } else {
        
            user.comparePassword(password)
        .then(result=>{
            if(result) {
                req.session.user = {
                    _id: user._id,
                    firstName: user.firstName,
                    email: user.email
                };
                req.flash('success', 'You have successfully logged in');
                res.redirect('/');
        } else {
            req.flash('error', 'wrong password');      
            res.redirect('/users/login');
        }
        });     
    }     
})
.catch(err => next(err));

};

//get profile
exports.profile = (req, res, next) => {
    let id = req.session.user;
    Promise.all([User.findById(id), event.find({hostName: id}), rsvpModel.find({user: id}).populate('event')])//quirying the user and events at the same time
    .then(results=>{
        const [user, event, rsvps] = results; //added the users rsvps on the profile page^
        res.render('./user/profile', {user, event, rsvps});
    })
    .catch(err=>next(err));
    
};

//log out the user
exports.logout = (req, res, next) => {
    req.session.destroy(err=>{
        if(err)
            return next(err);
        else
            res.redirect('/');
    });
};