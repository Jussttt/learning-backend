import { httpRequestDuration } from "../monitoring/metricsRegistry.js";

export async function metricsMiddleware(
    req,
    res,
    next
){
    const end=httpRequestDuration.startTimer();
    res.on(
        "finish",
        ()=>{
            end({
                method:req.method,
                route:req.route?.path??req.path,
                status_code:res.statusCode
            });
        }
    );
    
    next();
} 