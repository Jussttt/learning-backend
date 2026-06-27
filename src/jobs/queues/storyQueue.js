import { Queue } from "bullmq";

import { bullConnection } from "../bullConnection.js";

export const storyQueue=new Queue(
    "stories",
    {
        connection:bullConnection
    }
);