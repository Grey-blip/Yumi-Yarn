const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const {fileUpload} = require('../middleware/fileUpload');
const { isLoggedIn, isAuthor, rsvpAuthor} = require('../middleware/auth');
const {validateId} = require('../middleware/validator');
const { validateForm, validateRSVP, validateResult } = require('../middleware/validator');


router.get('/', eventController.index);

router.get('/new', isLoggedIn, eventController.new);

router.post('/', isLoggedIn, fileUpload, validateForm, validateResult, eventController.create);

router.get('/:id', validateId, eventController.show);

router.get('/:id/edit', isLoggedIn, isAuthor, eventController.edit);

router.put('/:id', isLoggedIn, validateId, isAuthor, fileUpload, validateForm, validateResult, eventController.update);

router.delete('/:id', isLoggedIn, validateId, isAuthor, eventController.delete);

router.post('/:id/rsvp', isLoggedIn, validateId, rsvpAuthor, validateRSVP, validateResult, eventController.rsvp);


module.exports = router;
