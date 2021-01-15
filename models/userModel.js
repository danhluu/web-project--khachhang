const { db } = require('../db/db');
const { ObjectId } = require('mongodb');
const cloudinary = require('../utils/cloudinary')
const bcrypt = require('bcrypt')
exports.get = async(id) => {
    const usersCollection = db().collection('user');
    const user = await usersCollection.findOne({ _id: ObjectId(id) })
    return user;
};

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