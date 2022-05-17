function viewAuth(req, res, next) { // not implementing yet
    // if ((req.body.owner !== req.user._id) && (!req.body.viewers !== req.user._id)) {
    //     return res.status(403).send('Access denied.');
    // }

    next();
}

module.exports = viewAuth;