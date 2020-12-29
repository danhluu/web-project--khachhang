
function writeComment(form){
    $.ajax({
        url: "/api/comments/write-comment",
        method:"POST",
        data:{
            username:form.username.value,
            postId:form.bookId.value,
            comment:form.comment.value,
            timestampt: Date.now()
        },
        success: function(){
            loadComment(form);
        }
    });
    return false;
}

function loadComment(form){
    $.ajax({
        url:"/api/comments/load-comment",
        method:"POST",
        data:{
            postId:form.bookId.value
        },
        success: function(comments){
            replaceCommentSection(comments);
        }
    });
}

function replaceCommentSection(comments){
    Handlebars.registerHelper("datetime",function(options){
        return convertTimeStampt(parseInt(options.fn(this)));
    });
    const template = Handlebars.compile($('#comment-section-script').html());
    const commentsHtml=template({comments});
    console.log(commentsHtml);
    $('ul.comment-section').html(commentsHtml);
}

function convertTimeStampt(timestampt){
    const today = new Date(timestampt);
    const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    return date+' '+time;
};

