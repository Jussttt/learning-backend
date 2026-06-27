import { success } from "zod";
import { createUserStory,getStoryFeedService,viewStoryService,getStoryViewers as getStoryViewersService } from "../../services/storyService.js";

export async function createStory(req,res){
    
    const story=await createUserStory(
        req.user.userId,
        req.validatedBody
    );
    
    return res.status(201).json({
        success: true,
        data: story,
    });
}


export async function getStoryFeed(
    req,
    res
){
    const stories =
        await getStoryFeedService(
            req.user.userId
        );

    return res.status(200).json({
        success: true,
        data: stories,
    });
}

export async function viewStory(
    req,
    res
){
    await viewStoryService(
        req.user.userId,
        req.validatedParams.storyId
    );

    return res.status(200).json({
        success: true,
    });
}

export async function getStoryViewers(req,res){
    const viewers=await getStoryViewersService(
        req.user.userId,
        req.validatedParams.storyId
    );

    return res.status(200).json({
        success:true,
        data: viewers,
    });
}