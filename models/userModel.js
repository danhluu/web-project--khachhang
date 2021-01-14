const { db } = require('../db/db');
const { ObjectId } = require('mongodb');
const cloudinary = require('../utils/cloudinary')
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
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
exports.get = async(id) => {
    const usersCollection = db().collection('user');
    const user = await usersCollection.findOne({ _id: ObjectId(id) })
    return user;
}
exports.getByEmail = async(email) => {
    const usersCollection = db().collection('user');
    const user = await usersCollection.findOne({ email })
    return user;
}

exports.sendMail = async(req, email) => {
    const usersCollection = db().collection('user');
    const user = await usersCollection.findOne({ email })
    const token = (await promisify(crypto.randomBytes)(20)).toString('hex');

    if (!user) {
        req.flash('message', 'No account with that email address exists.');
        return res.redirect('/forgot');
    }

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


exports.updateOne = async(id, imgInfo, userInfo) => {
    const usersCollection = db().collection('user');
    const filter = { _id: ObjectId(id) };
    const user = await usersCollection.findOne({ _id: ObjectId(id) })
    if (user.avatarID) {
        await cloudinary.uploader.destroy(user.avatarID);
    }
    const options = { upsert: true };
    const updateDoc = {
        $set: {
            name: userInfo.name,
            age: userInfo.age,
            avatar: imgInfo.path,
            avatarID: imgInfo.filename,
        },
    };
    const result = await usersCollection.updateOne(filter, updateDoc, options);
    return result;
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