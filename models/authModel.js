const { db } = require('../db/db');
const { ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');

exports.get = async(email, cb) => {
    const user = await db().collection('user').findOne({ email: email })
    cb(null, user);
}
exports.add = async(req, email, password) => {
    const userCollection = db().collection('user');
    password = await bcrypt.hashSync(password, bcrypt.genSaltSync(8));
    console.log("add email");
    const userInfo = {
        email: email,
        password: password,
        name: req.body.name,
        status: "active",
        avatar: 'https://res.cloudinary.com/danhluu/image/upload/v1609581236/avatardefault_92824_fdzmi5.png'
    }
    await userCollection.insertOne(userInfo);
    return;
}
exports.getId = async(id) => {
    const user = await db().collection('user').findOne({ _id: ObjectId(id) });
    return user;
}
exports.updatePassword = async(user, oldPassword, newPassword) => {
    const userCollection = db().collection('user');
    if (oldPassword === newPassword) {
        password = await bcrypt.hashSync(newPassword, bcrypt.genSaltSync(8));
        const options = { upsert: true };
        const updateDoc = {
            $set: {
                password: password
            },
        };
        await userCollection.updateOne({ _id: ObjectId(user._id) }, updateDoc, options);
        return 'Thanh cong'
    } else {
        return 'Khong thanh cong'
    }
}
exports.isUserExist=async(_email)=>{
    const user = await db().collection('user').findOne({email: _email });
    if (user) return true;
        else return false;
}