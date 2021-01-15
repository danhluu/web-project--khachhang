const { db } = require('../db/db');

exports.saveComment = async(postId, userName, content, timestampt) => {
    const commentsCollection = db().collection('comments');
    const updateDoc = {
        postId: postId,
        username: userName,
        timestampt: timestampt,
        content: content
    }
    await commentsCollection.insertOne(updateDoc);
    return updateDoc;
}
const COMMENTS_PER_TIME = 5;
exports.loadComment = async(postId, commentPageNumber, numComment = COMMENTS_PER_TIME) => {
    const commentsCollection = db().collection('comments');
    const filter = {};
    filter.postId = postId;
    const comments = await commentsCollection.find(filter).sort({ timestampt: -1 }).limit(numComment).skip(numComment * (commentPageNumber - 1)).toArray();
    return comments;
}