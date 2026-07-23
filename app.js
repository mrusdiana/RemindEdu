const express = require('express');
const session = require('express-session');
const router = require('./routes');
const app = express();
const port = 3000;

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));

app.use(session({
    secret: 'ganti-dengan-string-rahasia',
    resave: false,
    saveUninitialized: false,
}));

app.use('/', router);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});