const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
    firstName: {type: String, required: [true, 'first name is required']},
    lastName: {type: String, required: [true, 'last name is required']},
    email: {type: String, required: [true, 'email address is required'], unique: true},
    password: {type: String, required: [true, 'password is required'] },
}
);

//replacing plain text pw
//pre middleware 
userSchema.pre('save', function(next){
    let user = this;
    if(!user.isModified('password'))
        return next();
    bcrypt.hash(user.password, 10)
    .then(hash => {
        user.password = hash;
        next();
    })
    .catch(err => next(err));
});

//method to compare the login pw and the pw stored in the database 
userSchema.methods.comparePassword = function(loginPassword){
    console.log("Comparing with stored password:", this.password);
    return bcrypt.compare(loginPassword, this.password);
}
    

module.exports = mongoose.model('User', userSchema);