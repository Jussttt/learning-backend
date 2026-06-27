import { Worker } from "bullmq";

import { bullConnection } from "../bullConnection.js";
import { expireStory } from "../../repositories/storyRepository.js";



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

        }catch(err){

            console.error(
                "Story expiration failed",
                err
            );

            throw err;
        }
    },

    {
        connection:
            bullConnection
    }
);