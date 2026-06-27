import { Queue } from "bullmq";

import { bullConnection } from "../bullConnection.js";

export const storyCleanupQueue=new Queue(
    "story-cleanup",
    {
        connection:bullConnection
    }
);