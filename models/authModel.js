const {db} = require('../db/db');
const {ObjectId} = require('mongodb');
const bcrypt = require('bcrypt');

exports.get = async (email, cb) => {
    const user = await db().collection('user').findOne({email:email})
    cb(null,user);
}
exports.add = async (email, password) =>{
    const userCollection = db().collection('user');
    password = bcrypt.hashSync(password, bcrypt.genSaltSync(8))
    console.log("add email");
    const userInfo ={ email: email,
      password : password,
    }
    await userCollection.insertOne(userInfo);
}

exports.getId = async (id) =>{
    console.log("Get ID");
    const user = await db().collection('user').findOne({_id: ObjectId(id)});
    return user;
}