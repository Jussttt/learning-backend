import { cacheClient } from "../cache/cacheServer.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import { findUserById } from "../repositories/authRepository.js";
import { searchUsers, updateUserProfile } from "../repositories/userRepository.js";
import { logger } from "../logger/logger.js";
import { CacheKeys } from "../cache/cacheKeys.js";



export async function updateProfile(
    userId,
    updates
) {
    const updatedUser= await updateUserProfile(
        userId,
        updates
    );

    await cacheClient.del(
        CacheKeys.user(userId)
    );

    return updatedUser;
}

export async function getUserProfile(
    userId
){
    const cacheKey= CacheKeys.user(userId);

    const cachedUser=await cacheClient.get(
        cacheKey
    );

    if(cachedUser){
        logger.info(
            {cacheKey},
            "Cache hit"
        );

        return JSON.parse(
            cachedUser
        );
    }
            

    logger.info(
                {cacheKey},
                "Cache Miss"
    );

    const user=await findUserById(
        userId
    );

    if(!user){
        throw new NotFoundError("User not found");
    }

    await cacheClient.set(
        cacheKey,
        JSON.stringify(user),
        {
            EX:300
        }
    );

    return user;
}

export async function searchUserService(
    query,
    limit
){
    return await searchUsers(
        query,
        limit
    );
}

