const Controller = require('../controllers/controller');
const router = require('express').Router();
const studentRouter = require('./student');
const adminRouter = require('./admin');
const { isLoggedIn, isStudent, isAdmin } = require('../middlewares/auth');
const dotenv = require('dotenv')
const {google} = require('googleapis')
const { User } = require('../models/index')

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'http://localhost:3000/login/google/callback'
)

console.log('CEK CLIENT ID:', process.env.GOOGLE_CLIENT_ID);

const scopes = [
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile"
]

const authorizationUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    include_granted_scopes: true,
})

router.get('/', Controller.homePage);
router.get('/login', Controller.login);
router.post('/login', Controller.postLogin);
router.get('/login/google', (req, res) => {
    res.redirect(authorizationUrl)
});
router.get('/login/google/callback', async (req, res) => {
    try {
        const { code } = req.query;
        if (!code) {
            return res.redirect('/login?error=Google login gagal');
        }

        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);

        const oauth2 = google.oauth2({
            auth: oauth2Client,
            version: 'v2'
        });

        const { data } = await oauth2.userinfo.get();

        if (!data || !data.email) {
            return res.redirect('/login?error=Tidak bisa membaca akun Google');
        }

        let user = await User.findOne({ where: { email: data.email } });

        if (!user) {
            const crypto = require('crypto');
            user = await User.create({
                name: data.name || data.email,
                email: data.email,
                password: crypto.randomBytes(24).toString('hex'),
                role: 'student'
            });
        }

        req.session.userId = user.id;
        req.session.role = user.role;

        return res.redirect(user.role === 'admin' ? '/admin' : '/student');
    } catch (error) {
        console.error(error);
        return res.redirect('/login?error=Google login gagal');
    }
});
router.get('/register', Controller.getRegister);
router.post('/register', Controller.postRegister);

router.use(isLoggedIn);
router.get('/logout', Controller.logout);

router.use('/student', isStudent, studentRouter);
router.use('/admin', isAdmin, adminRouter);

module.exports = router;