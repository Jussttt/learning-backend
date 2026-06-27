import { success } from "zod";
import { getFeed } from "../../services/feedService.js";


export async function getUserFeed(
    req,
    res
){
    const {cursor,limit}=req.validatedQuery;

    const result=await getFeed(
        req.user.userId,
        cursor,
        limit
    );
    

    return res.status(200).json({
        success: true,
        data: result.posts,
        nextCursor: result.nextCursor,
    
    });
}   