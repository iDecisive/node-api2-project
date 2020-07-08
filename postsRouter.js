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
						res.status(201).json(postArr);
					})
					.catch();
			})
			.catch((err) => {
				res.status(500).json({
					error: 'There was an error while saving the post to the database',
				});
			});
	}
});

router.post('/:id/comments', (req, res) => {
	if (!req.body.text) {
		res
			.status(400)
			.json({ errorMessage: 'Please provide text for the comment.' });
	} else {
		db.findById(req.params.id)
			.then(() => {
				db.insertComment({
					text: req.body.text,
					post_id: req.params.id,
				})
					.then((comID) => {
						res.status(201).json(comID);
					})
					.catch((err) => {
						res.status(500).json({
							error:
								'There was an error while saving the comment to the database',
						});
					});
			})
			.catch((err) => {
				res.status(404).json({
					message: 'The post with the specified ID does not exist.', //Why is it sending the error catch() for insertComment above instead of this one?
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
			res
				.status(500)
				.json({ error: 'The posts information could not be retrieved.' });
		});
});

router.get('/:id', (req, res) => {
	db.findById(req.params.id)
		.then((postArr) => {
			if (!postArr[0]) {
				res.status(404).json({
					message: 'The post with the specified ID does not exist.',
				});
			} else {
				res.json(postArr);
			}
		})
		.catch((err) => {
			res
				.status(404)
				.json({ error: 'The post information could not be retrieved.' });
		});
});

router.get('/:id/comments', (req, res) => {
	db.findPostComments(req.params.id)
		.then((comArr) => {
			if (!comArr[0]) {
				res
					.status(404)
					.json({ message: 'The post with the specified ID does not exist.' }); //
			} else {
				res.json(comArr);
			}
		})
		.catch((err) => {
			res.status(500).json({
				error: 'The comments information could not be retrieved.',
			});
		});
});

router.delete('/:id', (req, res) => {
	db.findById(req.params.id)
		.then((postArr) => {
			if (!postArr[0]) {
				res.status(404).json({
					message: 'The post with the specified ID does not exist.',
				});
			} else {
				const deleted = postArr[0];
				db.remove(req.params.id)
					.then(() => {
						res.json(deleted);
					})
					.catch(() => {
						res.status(500).json({ error: 'The post could not be removed' });
					});
			}
		})
		.catch((err) => {
			res.status(500).json({
				error: 'Something inside findById().then( xxx ) did not work',
			});
		});
});

router.put('/:id', (req, res) => {
	if (!req.body.title || !req.body.contents) {
		res.status(400).json({
			errorMessage: 'Please provide title and contents for the post.',
		});
	} else {
		db.findById(req.params.id)
			.then((postArr) => {
				if (!postArr[0]) {
					res.status(404).json({
						message: 'The post with the specified ID does not exist.',
					});
				} else {
                    db.update(req.params.id, req.body).then(wasUpdated => {
                        if (wasUpdated === 1) {
                            //res.status(200).json("updated");
                            db.findById(req.params.id).then(postArr2 => {
                                res.status(200).json(postArr2)
                            }).catch(() => {
                                res.status(500).json({ error: 'Could not fetch updated post '});
                            })
                        } else {
                            res.status(500).json({ error: "Could not update post"});
                        }
                    }).catch();
				}
			})
			.catch(() => {
				res
					.status(500)
					.json({
						error: 'Something inside findById().then( xxx ) did not work',
					});
			});
	}
});

module.exports = router;
