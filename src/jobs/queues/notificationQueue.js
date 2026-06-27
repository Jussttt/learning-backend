import {Queue} from "bullmq";
import { bullConnection } from "../bullConnection.js";


export const notificationQueue=
    new Queue(
        "notification",
        {
            connection: bullConnection
        }
    );