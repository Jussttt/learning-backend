import pinoHttp from "pino-http";

import {logger} from "./logger.js";

export const requestLogger=pinoHttp({logger,
    customProps(req){
        return {
            requestId:req.requestId,
        };
    },
});