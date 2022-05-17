const config = require('config');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const mongoose = require('mongoose');

// user schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 5,
        maxlength: 255
    },
    password: {
        type: String,
        require: true,
        minlength: 5,
        maxlength: 255
    }
});

// generate token
userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ _id: this._id, name: this.name, email: this.email }, config.get('jwtPrivateKey'));
    return token;
}

// model
const User = new mongoose.model('User', userSchema);

// validation function
function validateUser(user) {
    const schema = {
        name: Joi.string().min(2).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    };

    return Joi.validate(user, schema);
}

// exports
module.exports.User = User;
module.exports.userSchema = userSchema;
module.exports.validateUser = validateUser;