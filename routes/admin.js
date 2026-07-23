const Controller = require('../controllers/controller');
const router = require('express').Router();

// dashboard admin: nampilin task SEMUA USER
router.get('/', Controller.adminDashboard);
router.get('/tasks/:id/edit', Controller.getEditTask);
router.post('/tasks/:id/edit', Controller.postEditTask);
router.get('/tasks/:id/delete', Controller.deleteTask);

router.get('/feeds', Controller.socialFeed);
router.get('/feeds/:id/edit', Controller.getEditFeed);
router.post('/feeds/:id/edit', Controller.postEditFeed);
router.post('/feeds/:id/delete', Controller.deleteFeed);

router.get('/users', Controller.manageUsers); // fitur khusus admin: kelola akun

module.exports = router;