import { Worker } from "bullmq";

import { bullConnection } from "../bullConnection.js";

import { findStoriesForCleanup,deleteStory } from "../../repositories/storyRepository.js";

import {deleteObject} from "../../storage/s3Service.js"

new Worker(
    "story-cleanup",
    async()=>{
        const stories=await findStoriesForCleanup();

        console.log(
            `Found ${stories.length} stories`
        );

        for(
            const story of stories
        ){
            try{
                await deleteObject(story.media_key);

                await deleteStory(story.id);

                console.log(
                    `Deleted story ${story.id}`
                );
            }catch(err){
                console.error(
                    `Failed Story ${story.id}`,
                );
            }
        }

    },
    {
        connection:bullConnection
    }

);