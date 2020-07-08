const express = require('express');

const db = require('./data/db.js');

const router = express.Router();

//when this code runs the default root dir is /api/posts

router.get('/', (req, res) => {

    res.send('hi');

});

module.exports = router;