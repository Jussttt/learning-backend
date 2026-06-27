import { verifyAccessToken } from "../utils/jwt.js";
import { UnauthorizedError } from "../errors/UnauthorizedError.js";

export function authenticate(
    req,
    res,
    next
){
    const authHeader=req.headers.authorization;

    if(!authHeader){
        return next(new UnauthorizedError(
            "Authentication required"
        ));
    }

    const [scheme,token]=authHeader.split(" ");

    if(scheme!=="Bearer" || !token){
        return next(new UnauthorizedError("Invalid Authorization Header"));
    }

    try{
        const payload=verifyAccessToken(token);

        req.user={
            userId: payload.userId,
        };

        next();
    } catch{
        req.log.warn(
            { err },
            "JWT verification failed"
        );
        next(new UnauthorizedError("Invalid or expired token"));
    }
}