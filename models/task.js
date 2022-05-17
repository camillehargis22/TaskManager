const Joi = require('joi');
const mongoose = require('mongoose');
const { userSchema } = require('./user');

// Create Schema
const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    task: {
        type: String,
        required: true,
        maxlength: 25
    },
    notes: {
        type: String,
        maxlength: 250
    },
    category: {
        type: String,
        required: true,
        minlength: 3
    },
    tags: {
        type: Array,
        validate: {
            isAsync: true,
            validator: function(v) {
                return new Promise((resolve, reject) => {
                    const result = v && v.length > 0;
                    resolve(result);
                })
            },
            message: 'A task should have at least one tag'
        }
    },
    severity: {
        type: String,
        required: true,
        enum: ['Low', 'Average', 'High', 'Priority']
    },
    isComplete: {
        type: Boolean,
        default: false
    },
    owner: {
        type: String, // ID string
        // required: true
    },
    viewers: [String] // ID string
});

// Create Model
const Task = mongoose.model('Task', taskSchema);

// Validation function
function validateTask(task) {
    const schema = {
        title: Joi.string().required(),
        task: Joi.string().max(25).required(),
        notes: Joi.string().max(250).allow('', null),
        category: Joi.string().min(3).required(),
        tags: Joi.array(),
        severity: Joi.string().required(),
        isComplete: Joi.boolean(),
        // owner: Joi.string().required(),
        owner: Joi.string(),
        viewers: Joi.array()
    };

    return Joi.validate(task, schema);
}

module.exports.Task = Task;
module.exports.validateTask = validateTask;