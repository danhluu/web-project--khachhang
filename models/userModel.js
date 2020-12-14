const {db} = require('../db/db');
const {ObjectId} = require('mongodb');
const cloudinary = require('../utils/cloudinary')

exports.get = async (id) => {
    const usersCollection = db().collection('user');
    const user = await usersCollection.findOne({_id: ObjectId(id)})
    return user;
}

exports.updateOne=async(id,imgInfo,userInfo)=>{
    const usersCollection = db().collection('user');
    console.log(userInfo);
    const filter = { _id:ObjectId(id)};
    const user = await usersCollection.findOne({_id: ObjectId(id)})
    if(user.avatarID)
      {
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
    const result = await usersCollection.updateOne(filter,updateDoc,options);
    return result;
}