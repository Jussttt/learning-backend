import { success } from "zod";
import { getPostLikeCount, likePost,unlikePost } from "../../services/likeService.js";

export async function like(
    req,res
){
    await likePost(
        req.user.userId,
        req.validatedParams.postId
    );

    return res.status(201).json({
        success: true,
        message: "Post liked successfully",
    });
}

export async function unlike(req,res){
    await unlikePost(
        req.user.userId,
        req.validatedParams.postId
    );

    res.status(200).json({
        success: true,
        message: "Post unliked successfully"
    });
}

export async function getLikeCount(req,res){
    const data=await getPostLikeCount(
        req.validatedParams.postId
    );

    return res.status(200).json({
        success: true,
        data,
    });
}