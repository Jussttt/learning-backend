import { createStory, findStoryOwner } from "../repositories/storyRepository.js";
import { findStoryFeed,findStoryById,hasViewedStory,createStoryView,getStoryViewers as getStoryViewersRepository } from "../repositories/storyRepository.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import { ForbiddenError } from "../errors/ForbiddenError.js";
import { generateReadUrl } from "../storage/s3Service.js";
import { scheduleStoryExpiration } from "../jobs/producers/storyProducer.js";



export async function createUserStory(
    currentUserId,
    data,
){
    
    const expiresAt=new Date( Date.now() + 24*60*60*1000);
    
    const story= await createStory({
        userId: currentUserId,
        mediaType: data.media_type,
        mediaKey:data.media_key,
        caption: data.caption ?? null,
        expiresAt,

    });

    await scheduleStoryExpiration(
        story
    );

    return story;


}

export async function  getStoryFeedService(
    currentUserId
){
    const stories=
        await findStoryFeed(
            currentUserId
        );


    return Promise.all(
        stories.map(
            async(story)=>({
                ...story,

                media_url:
                    await generateReadUrl(
                        story.media_key
                    )
            })
        )
    );
}

export async function viewStoryService(
    currentUserId,
    storyId
){
    const story =
        await findStoryById(
            storyId
        );

    if (
        !story ||
        new Date(
            story.expires_at
        ) <= new Date()
    ){
        throw new NotFoundError(
            "Story not found"
        );
    }

    const alreadyViewed =
        await hasViewedStory(
            currentUserId,
            storyId
        );

    if (
        alreadyViewed
    ){
        return;
    }

    await createStoryView(
        currentUserId,
        storyId
    );
}


export async function getStoryViewers(
    currentUserId,
    storyId
){
    const story=await findStoryOwner(storyId);

    if(!story){
        throw new NotFoundError("Story not found");
    }

    if(Number(story.user_id)!==Number(currentUserId)){
        throw new ForbiddenError("You are not allowed to view story viewers");
    }

    return await getStoryViewersRepository(storyId);
}