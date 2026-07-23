const Controller = require('../controllers/controller');
const router = require('express').Router();
const studentRouter = require('./student');
const adminRouter = require('./admin');
const { isLoggedIn, isStudent, isAdmin } = require('../middlewares/auth');

// ===== PUBLIK — belum perlu login =====
router.get('/', Controller.homePage);
router.get('/login', Controller.login);
router.post('/login', Controller.postLogin);
router.get('/register', Controller.getRegister);
router.post('/register', Controller.postRegister);

router.get('/', Controller.homePage)
router.get('/login', Controller.login)
router.get('/signUp', Controller.signUp)
router.use('/dashboards', Controller.dashboard)
router.use('/socialFeeds', Controller.socialFeed)
router.use('/profiles', Controller.profile)

router.use(isLoggedIn);
router.get('/logout', Controller.logout);

// // ===== CABANG BERDASARKAN ROLE =====
router.use('/student', isStudent, studentRouter);
router.use('/admin', isAdmin, adminRouter);

module.exports = router;