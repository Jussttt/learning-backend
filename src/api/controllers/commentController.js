import { success } from "zod";
import { createPostComment,deleteComment,getPostComments,getPostCommentCount } from "../../services/commentService.js";



export async function createComment(
    req,
    res
){
    const comment=await createPostComment(
        req.user.userId,
        req.validatedParams.postId,
        req.validatedBody.content
    );

    return res.status(201).json({
        success: true,
        data:comment,
    });
}

export async function getComments(
    req,
    res
){
    const comments =
        await getPostComments(
            req.validatedParams.postId
        );

    return res.status(200).json({
        success: true,
        data: comments,
    });
}

export async function removeComment(
    req,
    res
){
    await deleteComment(
        req.user.userId,
        req.validatedParams.commentId
    );

    return res.status(200).json({
        success: true,
        message:
            "Comment deleted successfully",
    });
}

export async function getCommentCount(
    req,
    res
){
    const data =
        await getPostCommentCount(
            req.validatedParams.postId
        );

    return res.status(200).json({
        success: true,
        data,
    });
}