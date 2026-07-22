const Controller = require('../controllers/controller');
const router = require('express').Router();

router.get('/', Controller.socialFeed)
router.get('/add', Controller.getAddFeed)
router.post('/add', Controller.getAddFeed)
router.get('/:id/edit', Controller.getEditFeed)
router.post('/:id/edit', Controller.getEditFeed)
router.post('/:id/delete', Controller.deleteFeed)

module.exports = router