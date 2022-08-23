// history.js

const router = require('express').Router();
const config = require('./config.json');

// GET all data from History collection in MONGODB
router.get('/search', async (req, res) => {
    try {
        // get all history from History collection in the mongo database
        const db = req.app.locals.db;
        const collection = db.collection('History');

        // get all snippets by passing in an empty object for finding everything
        const all = await collection.find({}).toArray();

        res.json(all);
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;
