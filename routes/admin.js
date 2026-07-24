const Controller = require('../controllers/controller');
const router = require('express').Router();

router.get('/', Controller.adminDashboard);
router.get('/tasks/:id/edit', Controller.getEditTask);
router.post('/tasks/:id/edit', Controller.postEditTask);
router.post('/tasks/:id/delete', Controller.deleteTask);

router.get('/feeds', Controller.socialFeed);
router.get('/feeds/:id/edit', Controller.getEditFeed);
router.post('/feeds/:id/edit', Controller.postEditFeed);
router.post('/feeds/:id/delete', Controller.deleteFeed);

router.get('/users', Controller.manageUsers); 
router.post('/users/:id/role', Controller.updateUserRole);

module.exports = router;