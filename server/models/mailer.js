const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your-email@gmail.com',
        pass: 'your-email-password'
    }
});

const send2FACode = async (email, code) => {
    const mailOptions = {
        from: 'your-email@gmail.com',
        to: email,
        subject: 'Your 2FA Code',
        text: `Your 2FA code is ${code}. It is valid for 15 minutes.`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('2FA code sent successfully');
    } catch (error) {
        console.error('Error sending 2FA code:', error);
    }
};

module.exports = { send2FACode };
