import { verifyAccessToken } from "../utils/jwt.js";

export function authenticateSocket(
    socket,
    next
){
    try{
        const token =socket.handshake.auth.token;

        if(!token){
            return next(
                new Error(
                    "Authentication required"
                )
            );
        }

        const payload=verifyAccessToken(token);

        socket.user={
            userId:payload.userId
        };

        next();
    }catch{
        next(
            new Error("Invalid Token")
        );
    }
}