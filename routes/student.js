const Controller = require('../controllers/controller');
const router = require('express').Router();

// dashboard: cuma nampilin task MILIK SENDIRI
router.get('/', Controller.studentDashboard);
router.get('/tasks/:id/add', Controller.getAddTask);
router.post('/tasks/:id/add', Controller.postAddTask);
router.get('/tasks/:id', Controller.taskCompleted);
router.get('/tasks/:id/edit', Controller.getEditTask);
router.post('/tasks/:id/edit', Controller.postEditTask);
router.get('/tasks/:id/delete', Controller.deleteTask);

router.get('/feeds', Controller.socialFeed);
router.get('/feeds/add', Controller.getAddFeed);
router.post('/feeds/add', Controller.postAddFeed);
router.get('/feeds/:id/edit', Controller.getEditFeed);
router.post('/feeds/:id/edit', Controller.postEditFeed);
router.post('/feeds/:id/delete', Controller.deleteFeed);

router.get('/profile', Controller.profile);

module.exports = router;