import { UnauthorizedError } from "../errors/UnauthorizedError.js";
import { findUserById } from "../repositories/authRepository.js"


export async function loadCurrentUser(req,res,next){
    const user=await findUserById(req.user.userId);
    
    if(!user){
        return next(new UnauthorizedError("User no longer exists"));
    }
    
    req.currentUser=user;

    next();
}