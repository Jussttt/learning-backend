import { success } from "zod";
import { createUserPost, deletePost, getPostById, searchPostsService } from "../../services/postService.js";
import { getUserPosts as getUserPostsService } from "../../services/postService.js";


export async function createPost(req,res){
    const post=await createUserPost(
        req.user.userId,
        req.validatedBody
    );

    return res.status(201).json({
        success:true,
        data: post,
    });
}


export async function getPost(req,res){
    const post=await getPostById(req.validatedParams.postId);

    return res.status(200).json({
        success:true,
        data:post,

    });
}

export async function removePost(
    req,
    res
){
    await deletePost(
        req.user.userId,
        req.validatedParams.postId
    );

    return res.status(200).json({
        success:true,
        message:
            "Post deleted successfully"
    });
}


export async function getUserPosts(req,res){
    const posts=await getUserPostsService(
        req.validatedParams.userId,
        req.validatedQuery.page,
        req.validatedQuery.limit
    );

    return res.status(200).json({
        success:true,
        data: posts,
    });
}

export async function searchPosts(
    req,
    res
){
    const posts=await searchPostsService(
        req.validatedQuery.q,
        req.validatedQuery.limit,
        req.validatedQuery.offset
    );

    res.status(200).json({
        posts
    });
}