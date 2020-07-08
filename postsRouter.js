const express = require('express');

const db = require('./data/db.js');

const router = express.Router();

//when this code runs the default root dir is /api/posts

router.post('/', (req, res) => {
	if (!req.body.title || !req.body.contents) {
		res.status(400).json({
			errorMessage: 'Please provide a title and contents for the post.',
		});
	} else {
		db.insert({
			title: req.body.title,
			contents: req.body.contents,
		})
			.then((idObj) => {
				db.findById(idObj.id)
					.then((postArr) => {
						res.status(201).json(postArr[0]);
					})
					.catch();
			})
			.catch((err) => {
				res
					.status(500)
					.json({
						error: 'There was an error while saving the post to the database',
					});
			});
	}
});

router.get('/', (req, res) => {
	db.find()
		.then((arr) => {
			res.json(arr);
		})
		.catch((err) => {
			res.json(err);
		});
});

module.exports = router;
