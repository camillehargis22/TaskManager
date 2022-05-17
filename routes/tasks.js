const { Task, validateTask } = require('../models/task');
const { User } = require('../models/user');
const auth = require('../middleware/auth');
const viewAuth = require('../middleware/view-auth');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

// GET, all tasks, router
router.get('/', [auth, viewAuth], async (req, res) => {
    // Return the documents from DB
    res.send(await Task.find());
});

// GET, task by id
router.get('/:id', [auth, viewAuth], async (req, res) => {
    // find by id
    const task = await Task.findById(req.params.id);

    // if not found, return status 404
    if (!task) return res.status(404).send("The task with the given ID was not found.");

    // return the task
    res.send(task);
});

// POST, add a task
router.post('/', auth, async (req, res) => {
    // validate
    const result = validateTask(req.body);
    if (result.error) return res.status(400).send(result.error.details[0].message);

    // validate owner and viewers
    // const user = await User.findById(req.user._id);
    // if (!user) return res.status(400).send('Invalid user ID.');

    // create new object
    let task = new Task({
        title: req.body.title,
        task: req.body.task,
        notes: req.body.notes,
        category: req.body.category,
        tags: req.body.tags,
        severity: req.body.severity,
        isComplete: req.body.isComplete,
        // owner: user._id,
        // viewers: req.body.viewers
    });

    // save to db
    task = await task.save();

    // return new task
    res.send(task);
});

// PUT, update a task
router.put('/:id', [auth, viewAuth], async (req, res) => {
    // validate
    const result = validateTask(req.body);
    if (result.error) return res.status(400).send(result.error.details[0].message);

    // validate owner and viewers
    // const user = await User.findById(req.user._id);
    // if (!user) return res.status(400).send('Invalid user ID.');

    // find by id and update
    const task = await Task.findByIdAndUpdate(
        req.params.id,
        {
            title: req.body.title,
            task: req.body.task,
            notes: req.body.notes,
            category: req.body.category,
            tags: req.body.tags,
            severity: req.body.severity,
            isComplete: req.body.isComplete,
            // owner: user._id,
            // viewers: req.body.viewers
        },
        { new: true }
    );

    // if id not found, return 404
    if (!task) return res.status(404).send('The task with the given ID was not found.');

    // return the updated task
    res.send(task);
});

// DELETE, remove a task
router.delete('/:id', [auth, viewAuth], async (req, res) => {
    // find by id and remove
    const task = await Task.findByIdAndRemove(req.params.id);

    // if id not found, return 404
    if (!task) return res.status(404).send('The task with the given ID was not found.');

    // return deleted task
    res.send(task);
});

module.exports = router;