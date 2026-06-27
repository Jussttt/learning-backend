import {Queue} from "bullmq";
import { bullConnection } from "../bullConnection.js";

import { env } from "../../config/env.js";

export const notificationQueue=
    new Queue(
        "notification",
        {
            connection: bullConnection
        }
    );