const {db} = require('../db/db');
const {ObjectId} = require('mongodb');
const cloudinary = require('../utils/cloudinary')
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { promisify } = require('util');
const nodemailerSendgrid = require('nodemailer-sendgrid');
const { resolve } = require('path');
const SENDGRID_API_KEY = '';
const transport = nodemailer.createTransport(nodemailerSendgrid({
  apiKey: SENDGRID_API_KEY,
}));
exports.get = async (id) => {
    const usersCollection = db().collection('user');
    const user = await usersCollection.findOne({_id: ObjectId(id)})
    return user;
}
exports.getByEmail = async (email) => {
  const usersCollection = db().collection('user');
  const user = await usersCollection.findOne({email})
  return user;
}

exports.sendMail = async(req,email)=>
{
  const usersCollection = db().collection('user');
  const user = await usersCollection.findOne({email})
  const token = (await promisify(crypto.randomBytes)(20)).toString('hex');
 
  if (!user) {
    req.flash('error', 'No account with that email address exists.');
    return res.redirect('/forgot');
  }

  user.resetPasswordToken = token;
  console.log(user.resetPasswordToken)
  user.resetPasswordExpires = Date.now() + 3600000;
  
  const resetEmail = {
    to: user.email,
    from: 'luannguyen210500@gmail.com',
    subject: 'Node.js Password Reset',
    text: `
      You are receiving this because you (or someone else) have requested the reset of the password for your account.
      Please click on the following link, or paste this into your browser to complete the process:
      http://${req.headers.host}/reset/${token}
      If you did not request this, please ignore this email and your password will remain unchanged.
    `,
  };
  console.log('toi day luon roi');
  await transport.sendMail(resetEmail,function(error,info){
    if(error){
      console.log("error is " + error);
      resolve(false);
    }else{
      console.log("Email sent");
      resolve(true);
    }
  });
  console.log('toi day la cuoi cung roi');
  req.flash('info', `An e-mail has been sent to ${user.email} with further instructions.`);
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