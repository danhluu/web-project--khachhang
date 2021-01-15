const { db } = require('../db/db');
const { ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
const crypto = require('crypto')
const nodemailer = require('nodemailer');
const { promisify } = require('util');
const transporter = nodemailer.createTransport({
    service: process.env.service,
    auth: {
        user: process.env.user_account,
        pass: process.env.user_password
    },
    host: process.env.transporter_host,
    port: process.env.transporter_port,
    secure: false,
});
exports.findByEmail = async(email) => {
    const user = await db().collection('user').findOne({ email: email })
    return user
}
exports.register = async(req, email, password) => {
    const userCollection = db().collection('user');
    password = await bcrypt.hashSync(password, bcrypt.genSaltSync(8));
    const token = (await promisify(crypto.randomBytes)(20)).toString('hex');
    const tokenExpires = Date.now() + 3600000
    const userInfo = {
        email: email,
        password: password,
        name: req.body.name,
        confirmToken: token,
        confirmTokenExpires: tokenExpires,
        status: "PendindConfirm",
        avatar: 'https://res.cloudinary.com/danhluu/image/upload/v1609581236/avatardefault_92824_fdzmi5.png'
    }
    await userCollection.insertOne(userInfo);
    return token;
}
exports.getId = async(id) => {
    const user = await db().collection('user').findOne({ _id: ObjectId(id) });
    return user;
}


exports.findToken = async(token, tokenExpires) => {
    const usersCollection = db().collection('user');
    let user = await usersCollection.findOne({ resetPasswordToken: token, resetPasswordExpires: tokenExpires })
    return user;
}

exports.resetPassword = async(token, tokenExpires, newPassword) => {
    const usersCollection = db().collection('user');
    let user = await usersCollection.findOne({ resetPasswordToken: token, resetPasswordExpires: tokenExpires })
    password = await bcrypt.hashSync(newPassword, bcrypt.genSaltSync(8));
    let updateDoc = {
        $set: {
            password: password,
            resetPasswordToken: undefined,
            resetPasswordExpires: undefined
        }
    }
    await usersCollection.updateOne({ _id: user._id }, updateDoc, { upsert: true });
    const confirmMail = {
        to: user.email,
        from: 'BookStore',
        subject: 'Reset Password Successfully',
        text: `
        This is a confirmation that the password for your account  ${user.email}   has just been changed.
    `,
    };
    await transporter.sendMail(confirmMail)

}
exports.resetMail = async(req, email) => {
    const usersCollection = db().collection('user');
    let user;
    try {
        user = await usersCollection.findOne({ email })
    } catch (error) {
        req.flash('message', 'No account with that email address exists.');
        return;
    }
    const token = (await promisify(crypto.randomBytes)(20)).toString('hex');

    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000;
    let updateDoc = {
        $set: {
            resetPasswordToken: token,
            resetPasswordExpires: user.resetPasswordExpires
        }
    }
    await usersCollection.updateOne({ _id: ObjectId(user._id) }, updateDoc, { upsert: true });
    const resetEmail = {
        to: user.email,
        from: 'BookStore',
        subject: 'BookStore Password Reset',
        text: `
      You are receiving this because you (or someone else) have requested the reset of the password for your account.
      Please click on the following link, or paste this into your browser to complete the process:
      http://${req.headers.host}/reset/${token}
      If you did not request this, please ignore this email and your password will remain unchanged.
    `,
    };
    try {
        await transporter.sendMail(resetEmail)
        req.flash('message', `An e-mail has been sent to ${user.email} with further instructions.`);

    } catch (error) {
        req.flash('message', 'Khong gui mail duoc')
    }
    // lam API thi ngon hon
    // res.render('forgot')
}

exports.sendConfirmToken = async(email, token) => {
    const confirmEmail = {
        to: email,
        from: 'BookStore',
        subject: 'BookStore Verification',
        text: `
      Click this link to verify your account:
      http://${req.headers.host}/confirm/${token}
    `,
    };
    await transporter.sendMail(confirmEmail);
}
exports.confirmedEmail = async(userId) => {
    let updateDoc = {
        $set: {
            confirmToken: undefined,
            confirmTokenExpires: undefined,
            status: 'active'
        }
    }
    await usersCollection.updateOne({ _id: ObjectId(userId) }, updateDoc, { upsert: true });
}
exports.isUserExist = async(_email) => {
    const user = await db().collection('user').findOne({ email: _email });
    if (user) return true;
    else return false;
}