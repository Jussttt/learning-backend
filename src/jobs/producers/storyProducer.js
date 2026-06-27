import { storyQueue } from "../queues/storyQueue.js";

export async function scheduleStoryExpiration(
    story
){
    const delay=new Date(story.expires_at).getTime()-Date.now();
    
    await storyQueue.add(
        "expire-story",
        {
            storyId:story.id
        },
        {
            delay
        }
    );
}