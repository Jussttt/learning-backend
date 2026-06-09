import { success } from "zod";
import { logger } from "../logger/logger.js";

export function errorHandler(err,req,res,next){
    logger.error({
        requestId: req.requestId,
        err,
    },"Request failed");

    const statusCode=err.statusCode|| 500;

    return res.status(statusCode).json({
        success: false,
        error:{
            message: err.message|| "Internal Server Error",
        },
    });
}