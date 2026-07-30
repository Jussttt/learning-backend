import { Worker } from "bullmq";

import { bullConnection } from "../bullConnection.js";
import { expireStory } from "../../repositories/storyRepository.js";
import { incrementStoryJob } from "../../monitoring/metricsService.js";



new Worker(
    "stories",
        

    async(job)=>{
        try{

            const story =
                await expireStory(
                    job.data.storyId
                );

            if(story){
                console.log(
                    `Story ${story.id} expired`
                );
            }

            incrementStoryJob(
                "processed"
            );

        }catch(err){

            console.error(
                "Story expiration failed",
                err
            );
            incrementStoryJob(
                "failed"
            );
            throw err;
        }
    },

    {
        connection:
            bullConnection
    }
);