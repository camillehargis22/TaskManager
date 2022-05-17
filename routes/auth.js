const { User } = require('../models/user');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const Joi = require('joi');
const mongoose = require ('mongoose');
const express = require('express');
const router = express.Router();

// POST
router.post('/', async (req, res) => {
    // validate
    const result = validate(req.body);
    if (result.error) return res.status(400).send(result.error.details[0].message);

    // validate email/username
    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Invalid email or password.');

    // validate password
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('Invalid email or password.');

    // create json web token
    const token = user.generateAuthToken();

    // send
    res.send(token);
});

function validate(req) {
    const schema = {
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    };

    return Joi.validate(req.schema);
}

// export
module.exports = router;