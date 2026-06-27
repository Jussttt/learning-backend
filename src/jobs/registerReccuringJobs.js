import { storyCleanupQueue }
from "./queues/storyCleanupQueue.js";

export async function registerRecurringJobs(){

    await storyCleanupQueue.upsertJobScheduler(
        "daily-story-cleanup",
        {
            pattern:"0 2 * * *"
        },
        {
            name:"cleanup",
            data:{}
        }
    );

    console.log(
        "Story cleanup scheduler registered"
    );
}