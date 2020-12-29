const {db} = require('../db/db');
const {ObjectId} = require('mongodb');

exports.saveComment=async(postId,userName,content,timestampt)=>{
    const commentsCollection = db().collection('comments');
    const updateDoc = {
        postId:postId,
        username:userName,
        timestampt:timestampt,
        content:content
      }  
    await commentsCollection.insertOne(updateDoc);
    return updateDoc;
}
exports.loadComment=async(postId)=>{
    const commentsCollection=db().collection('comments');
    const filter={};
    filter.postId=postId;
    const comments=await commentsCollection.find(filter).sort({timestampt:-1}).toArray();
    // console.log(comments);
    // const ccomments=[];
    // comments.forEach(element => {
    //     element.timestampt=convertTimeStampt(element.timestampt);
    //     console.log(element);
    //     ccomments.push(element);
    // });
    // console.log(ccomments);
    return comments;
}