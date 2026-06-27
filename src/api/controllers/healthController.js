import { checkHealth } from "../../monitoring/healthService.js";

export async function health(
    req,
    res
){
    const result =await checkHealth();

    return res.status(
        result.status==="healthy"?200:503
    ).json(result);
}