const Controller = require('../controllers/controller');
const router = require('express').Router();

router.get('/', Controller.profile)

module.exports = router