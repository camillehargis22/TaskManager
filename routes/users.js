const { User, validateUser } = require('../models/user');
const auth = require('../middleware/auth');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

// GET, currnet user
router.get('/me', auth, async (req, res) => {
    const user = await User.findById(req.user._id);
    res.send(_.pick(user, ['_id', 'name', 'email']));
});

// POST
router.post('/', async (req, res) => {
    // validate
    const result = validateUser(req.body);
    if (result.error) return res.status(400).send(result.error.details[0].message);

    // make sure email is not already registered
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send('User already registered.');

    // create new user
    user = new User(_.pick(req.body, ['name', 'email', 'password']));

    // hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    // save to db
    await user.save();

    // create json web token and add header
    const token = user.generateAuthToken();
    console.log(`token: ${token}`);
    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
});

// exports
module.exports = router;