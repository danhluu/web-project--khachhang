const commentModelAPI = require('../../models/commentModel');
const queryString = require('query-string');

exports.writeComment=async(req,res,next)=>{
    const username=req.body.username || "le danh lul job";
    const postId=req.body.postId;
    const comment=req.body.comment;
    const timestampt=req.body.timestampt;
    res.json(await commentModelAPI.saveComment(postId,username,comment,timestampt));
}
exports.loadComment=async(req,res,next)=>{
    res.json(await commentModelAPI.loadComment(req.body.postId,req.body.nComment));
}