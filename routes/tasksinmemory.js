const Joi = require('joi');
const express = require('express');
const router = express.Router();

const tasks = [];

// GET, List all tasks
router.get('/', (req, res) => {
    // delay result to emulate db
    setTimeout(() => {
        // Return the array of tasks
        res.send(tasks);
    }, 500);
});

// GET, List a single task
router.get('/:id', (req, res) => {
    // Look for task with given id
    const task = tasks.find(c => c.id === parseInt(req.params.id));

    // If the response is not found, return status 404
    if (!task) return res.status(404).send("The task with the given ID was not found.");

    // delay result to emulate db
    setTimeout(() => {
        // Return the task
        res.send(task);
    }, 500);
});

// POST, Add a task
router.post('/', (req, res) => {
    // Validate the response
    const result = validateTask(req.body);
    if (result.error) return res.status(400).send(result.error.details[0].message);

    // This is to help ensure no id is the same, now will get ID from db as part of req
    // let newId = tasks.length + 1;
    // while (tasks.find(c => c.id === newId)) {
    //     newId += 1;
    // }

    // Create new object (task)
    const task = {
        id: req.params.id,
        title: req.body.title,
        task: req.body.task,
        notes: req.body.notes,
        category: req.body.category,
        tags: req.body.tags,
        severity: req.body.severity,
        isComplete: req.body.isComplete
    };

    // Add the new task to array
    tasks.push(task);

    // delay result to emulate db
    setTimeout(() => {
        // Return the new task
        res.send(task);
    }, 500);
});

// PUT, Update a task
router.put('/:id', (req, res) => {
    // Look for task with given id
    let task = tasks.find(c => c.id === parseInt(req.params.id));

    // If id doesn't exist, return 404
    if (!task) return res.status(404).send('The task with the given ID was not found.');

    // Validate the request and return 400 if invalid
    const result = validateTask(req.body);
    if (result.error) return res.status(400).send(result.error.details[0].message);

    // Update the task, each property    
    task = {
        title: req.body.title,
        task: req.body.task,
        notes: req.body.notes,
        category: req.body.category,
        tags: req.body.tags,
        severity: req.body.severity,
        isComplete: req.body.isComplete
    };

    // delay result to emulate db
    setTimeout(() => {
        // Return the updated task
        res.send(task);
    }, 500);
});

// DELETE, Remove a task
router.delete('/:id', (req, res) => {
    // Look for task with given id
    const task = tasks.find(c => c.id === parseInt(req.params.id));

    // If id doesn't exist, return 404
    if (!task) return res.status(404).send('The task with the given ID was not found.');

    // Get the index of the task
    const index = tasks.indexOf(task);

    // Remove the task
    tasks.splice(index, 1);

    // delay result to emulate db
    setTimeout(() => {
        // Return the deleted task
        res.send(task);
    }, 500);
});

// Validation function
function validateTask(task) {
    const schema = {
        title: Joi.string().max(20),
        task: Joi.string().min(3).required(),
        notes: Joi.string(),
        category: Joi.string(),
        tags: Joi.array(),
        severity: Joi.number(),
        isComplete: Joi.boolean()
    };

    return Joi.validate(task, schema);
}

module.exports = router;