// const PostComments = require('./home_post_comments');


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
                let newPost = newPostDOM(data.data.post);
                $('#posts-container>ul').prepend(newPost);
                deletePost($(' .delete-post-button', newPost));

                // call the create comment class
                new PostComments(data.data.post._id);

                // CHANGE :: enable the functionality of the toggle like button on the new post
                new ToggleLike($(' .toggle-like-button', newPost));

                new Noty({
                    theme: 'relax',
                    text: "Post published!",
                    type: 'success',
                    layout: 'topRight',
                    timeout: 1500
                    
                }).show();
            },
            error: function(err){
                console.log(err.responseText);
            }
        });

    });
};



let newPostDOM = function(post){
    return $(`
                <li class="list-group-item" id="post-${post._id}">
                    <div class="card text-bg-light mb-3 mx-auto" style="max-width: 500px;">
                        <div class="card-header">
                            <h5 class="card-title"> ${ post.user.name } posted: </h5>
                        </div>
                        <div class="card-body">
                            <p class="card-text"> ${ post.content } </p>
                            <a class="toggle-like-button" data-likes="0" href="/likes/toggle/?id=${post._id}&type=Post" class="card-link" id="toggle-likes"> 
                                0 Likes
                            </a>
                            <br>        
                            <a class="delete-post-button" href="/posts/delete/${ post._id }" class="card-link"> Delete Post </a>  
                              
                        </div>
                        <div class="card-footer">
                            <form action="/comments/create" method="post" id="post-${post._id}-comments-form">
                                <input type="text" name="content" placeholder="Add comments...">
                                <input type="text" name="post" value="${ post._id }" hidden>
                                <input type="submit" value="Comment">
                            </form>
                        </div>
                        <ul class="list-group list-group-flush" id="post-comments-${post._id}">

                        </ul>
                    </div>    
                </li>
            `);
}

// method to delete a post from DOM
let deletePost = function(deleteLink){
    $(deleteLink).click(function(e){
        e.preventDefault();

        $.ajax({
            type: 'get',
            url: $(deleteLink).prop('href'),
            success: function(data){
                $(`#post-${data.data.post_id}`).remove();
                new Noty({
                    theme: 'relax',
                    text: "Post Deleted",
                    type: 'success',
                    layout: 'topRight',
                    timeout: 1500
                    
                }).show();
            },error: function(error){
                console.log(error.responseText);
            }
        });

    });
}





// loop over all the existing posts on the page (when the window loads for the first time) and call the delete post method on delete link of each, also add AJAX (using the class we've created) to the delete button of each
let convertPostsToAjax = function(){
    $('#posts-container>ul>li').each(function(){
        let self = $(this);
        let deleteButton = $(' .delete-post-button', self);
        deletePost(deleteButton);

        // get the post's id by splitting the id attribute
        let postId = self.prop('id').split("-")[1]
        // new PostComments(postId);
    });
}


createPost();
convertPostsToAjax();


