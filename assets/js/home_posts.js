//method to submit the form data using ajax
let createPost = function(){
    //get the form 
    let newPostForm = $('#new-post-form');

    newPostForm.submit(function(e){
        //Prevent the default behaviour
        e.preventDefault();

        //Send the request in the ajax format instead
        $.ajax({
            type: 'post',
            url: '/posts/create',
            data: newPostForm.serialize(),
            success: function(data){
                let newPost = newPostDOM(data.data.post, data.data.user);
                $('#posts-container>ul').prepend(newPost);
                deletePost($(' .delete-post-button', newPost));
            },
            error: function(err){
                console.log(err.responseText);
            }
        });

    });
};



let newPostDOM = function(post, user){
    return $(`
                <li class="list-group-item" id="post-${post._id}">
                    <div class="card text-bg-light mb-3 mx-auto" style="max-width: 500px;">
                        <div class="card-header">
                            <h5 class="card-title"> ${ user.name } posted: </h5>
                        </div>
                        <div class="card-body">
                            <p class="card-text"> ${ post.content } </p>
                                      
                                <a class="delete-post-button" href="/posts/delete/${ post._id }" class="card-link"> Delete Post </a>  
                              
                        </div>
                        <div class="card-footer">
                            <form action="/comments/create" method="post" id="new-comment-form">
                                <input type="text" name="content" placeholder="Add comments...">
                                <input type="text" name="post" value="${ post._id }" hidden>
                                <input type="submit" value="Comment">
                            </form>
                        </div>
                        <ul class="list-group list-group-flush">

                        </ul>
                    </div>    
                </li>
            `);
}

let deletePost = function(deleteLink){
    $(deleteLink).click(function(e){
        e.preventDefault();

        $.ajax({
            type: 'get',
            url: $(deleteLink).prop('href'),
            success: function(data){
                $(`#post-${data.data.post_id}`).remove();
            },
            error: function(err){
                console.log(err.responseText);
            }
        });
    });
}


let createComment = function(){
    let newCommentForm = $('#new-comment-form');

    newCommentForm.submit(function(e){
        e.preventDefault();

        $.ajax({
            type: 'post',
            url: '/comments/create',
            data: newCommentForm.serialize(),
            success: function(data){
                let newComment = newCommentDOM(data.data.comment, data.data.user);
                $(`#post-${data.data.comment.post}>ul`).prepend(newComment);
            },
            error: function(err){
                console.log(err.responseText);
            }
        });
    });
};

let newCommentDOM = function(comment, user){
    return $(`
        <li class="list-group-item" id="comment-${comment._id }">
            <p class="card-text"> ${ comment.content } </p>
            <p class="card-text text-muted" style="display: inline;"> ${ user.name } </p>

                <a href="/comments/delete/${ comment._id } " class="card-link delete-comment-button"> Delete Comment </a>
            
        </li>
    `);
}

createPost();
createComment();


