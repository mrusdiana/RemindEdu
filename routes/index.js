const Controller = require('../controllers/controller');
const router = require('express').Router();
const dashboardRoute = require('./dashboard')
const socialFeedRoute = require('./socialFeed')
const profileRoute = require('./profile')


router.get('/', Controller.homePage)
router.get('/login', Controller.login)
router.get('/signUp', Controller.signUp)
router.use('/dashboards', dashboardRoute)
router.use('/socialFeeds', socialFeedRoute)
router.use('/profiles', Controller.profile)

module.exports = router