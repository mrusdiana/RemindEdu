const transporter = require('../config/mailer');

exports.sendEmail = async (req, res) => {
    const { email, subject, message } = req.body;

    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: subject,
            text: message
        });
        res.render('success', { title: 'Berhasil' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Gagal kirim email');
    }
};