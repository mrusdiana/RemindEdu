const Controller = require('../controllers/controller');
const router = require('express').Router();
const studentRouter = require('./student');
const adminRouter = require('./admin');
const { isLoggedIn, isStudent, isAdmin } = require('../middlewares/auth');

router.get('/', Controller.homePage);
router.get('/login', Controller.login);
router.post('/login', Controller.postLogin);
router.get('/register', Controller.getRegister);
router.post('/register', Controller.postRegister);
router.get('/signUp', Controller.signUp);

router.use(isLoggedIn);
router.get('/logout', Controller.logout);

// Rute menu utama setelah login
router.get('/socialFeed', Controller.socialFeed);
router.get('/dashboard', Controller.dashboard);
router.get('/profile', Controller.profile);

router.use('/student', isStudent, studentRouter);
router.use('/admin', isAdmin, adminRouter);

module.exports = router;
