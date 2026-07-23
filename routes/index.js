const Controller = require('../controllers/controller');
const router = require('express').Router();
const studentRouter = require('./student');
const adminRouter = require('./admin');
const { isLoggedIn, isStudent, isAdmin } = require('../middlewares/auth');
const dotenv = require('dotenv')
const {google} = require('googleapis')
const { User } = require('../models/index')

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOLE_CLIENT_ID,
    process.env.GOOLE_CLIENT_SECRET,
    'http://localhost:3000/login/google/callback'
)

const scopes = [
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile"
]

const authorizationUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    include_granted_scopes: true,
})

// ===== PUBLIK — belum perlu login =====
router.get('/', Controller.homePage);
router.get('/login', Controller.login);
router.get('/login/google', (req, res) => {
    res.redirect(authorizationUrl)
});
router.get('/login/google/callback', async (req, res) => {
    const {code} = req.query

    const {tokens} = await oauth2Client.getToken(code as string);

    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({
        auth: oauth2Client,
        version: 'v2'
    })

    const {data} = await oauth2.userinfo.get()

    if(!data || !data.name){
        return res.json({
            data:data,
        })
    }

    let user = await User.findUnique({
        where: {
            email: data.email
        }
    })

    if(!user) {
        user = await User.create({
            data: {
                name: data.name,
                email: data.email,
                address:"-"
            }
        })
    } 
});
router.get('/register', Controller.getRegister);
router.post('/register', Controller.postRegister);

// // ===== WAJIB LOGIN dari sini ke bawah =====
router.use(isLoggedIn);
router.get('/logout', Controller.logout);

// // ===== CABANG BERDASARKAN ROLE =====
router.use('/student', isStudent, studentRouter);
router.use('/admin', isAdmin, adminRouter);

module.exports = router;