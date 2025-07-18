
const { body, validationResult, check } = require('express-validator');

//Check the user is utilizing a valid ID
exports.validateId = (req, res, next) =>{
    let id = req.params.id;
    console.log("Input ID:", typeof id);
    if(typeof id === 'string' && id.match(/^[0-9a-fA-F]{24}$/)) {
        return next();
    }else{
        let err = new Error('Invalid story id');
        err.status = 400;
        return next(err);
        
    }
};

exports.validateSignUp = [   
    body('firstName', 'First name is required').notEmpty().trim().escape(),
    body('lastName','Last name is required').notEmpty().trim().escape(),
    body('email', 'Email address is not valid').isEmail().trim().escape().normalizeEmail(),
    body('password', 'Password must be at least 8 charaters and at most 64 charaters').isLength({min: 8, max: 64})
];


exports.validateLogin = [
    body('email', 'Email address is not valid').isEmail().trim().escape().normalizeEmail(),
    body('password', 'Password must be at least 8 charaters and at most 64 charaters').isLength({min: 8, max: 64})
];

const validCategories = ['Team Building', 'Networking & Skill Building', 'Crochet a Craft', 'Yarn Market', 'Other'];

exports.validateForm = [
    body('title', 'Title is required').notEmpty().trim().escape(),
    body('details', 'Description is required').notEmpty().trim().escape(),
    body('category').notEmpty().withMessage('Category is required').isIn(validCategories).withMessage('Category can only be: Team Building, Networking & Skill Building, Crochet a Craft, Yarn Market, Other').trim(),
    body('start', 'Start must be a valid ISO8601 date').isISO8601().toDate().trim().escape(),
    body('start', 'Start date must be in the future').custom((value) => {
        return new Date(value) > new Date();
    }).trim().escape(),
    body('end', 'End must be a valid ISO8601 date').isISO8601().toDate().trim().escape(),
    body('end', 'End date must be after start date').custom((end, { req }) => {
        return new Date(end) > new Date(req.body.start);
    }).trim().escape(),
    body('location', 'Location is required').notEmpty().trim().escape(),
    check('image','An image is required').custom((_, {req}) => {
        if (!req.file){
            throw new Error('An image is required');
        }
        return true;
    }).trim().escape()

];

exports.validateRSVP = [
    body('status').notEmpty().withMessage('RSVP can not be Empty')
    .isIn(['Yes','No','Maybe']).withMessage('The status of your RSVP can only be: YES, NO, or MAYBE').trim().escape()
];

exports.validateResult = (req, res, next)=>{
    let errors = validationResult(req);
    console.log("Form Data:", req.body); // Debugging the form data
    console.log("Validation Errors:", errors.array());
    if(!errors.isEmpty()) {
        errors.array().forEach(error=>{
            req.flash('error', error.msg);
        });
        return res.redirect('back');
    }else{
        return next();
    }
};