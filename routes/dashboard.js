const Controller = require('../controllers/controller');
const router = require('express').Router();

router.get('/', Controller.dashboard)
router.get('/add', Controller.getAddTask)
router.post('/add', Controller.postAddTask)
router.get('/:id', Controller.taskCompleted)
router.get('/:id/edit', Controller.getEditTask)
router.post('/:id/edit', Controller.postEditTask)
router.get('/:id/delete', Controller.deleteTask)

module.exports = router