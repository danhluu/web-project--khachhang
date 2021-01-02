
var socket=io();
socket.on("Server-sent-data", function(data)
{
    prependComment(data);
});
function writeComment(form){
    const formdata={
        username:form.username.value,
        postId:form.bookId.value,
        comment:form.comment.value,
        timestampt: Date.now()
    }
    $.ajax({
        url: "/api/comments/write-comment",
        method:"POST",
        data:formdata,
        success: function(){
            realtimeComment(formdata);
        }
    });
    return false;
}
var inc=1;
function loadComment(postId){
    inc++;
    $.ajax({
        url:"/api/comments/load-comment",
        method:"POST",
        data:{
            postId:postId,
            nComment:inc
        },
        success: function(comments){
            if (Array.isArray(comments) && comments.length) {
                // array exists and is not empty
                appendCommentSection(comments);
            }else{
                inc--;
            }   
        }
    });
}

function appendCommentSection(comments){
    Handlebars.registerHelper("datetime",function(options){
        return convertTimeStampt(parseInt(options.fn(this)));
    });
    const template = Handlebars.compile($('#comment-section-script').html());
    const commentsHtml=template({comments});
    console.log(commentsHtml);
    $('#load-more-button').before(commentsHtml);
}

function convertTimeStampt(timestampt){
    const today = new Date(timestampt);
    const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    return date+' '+time;
};

function prependComment(data){
    data.content=data.comment;
    Handlebars.registerHelper("datetime",function(options){
        return convertTimeStampt(parseInt(options.fn(this)));
    });
    const template = Handlebars.compile($('#comment-section-script').html());
    const singlecommentsHtml=template({comments:[data,]});
    console.log(singlecommentsHtml);
    $('#comment-box').after(singlecommentsHtml);
}

function realtimeComment(data){
    socket.emit("Client-sent-data", data);
}