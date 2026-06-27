import {
    followUser,getUserFollowStats,unfollowUser
} from "../../services/followService.js";

export async function follow(
    req,
    res
){

    await followUser(
        req.user.userId,
        req.validatedParams.userId
    );

    return res.status(201).json({
        success: true,
        message:
            "User followed successfully",
    });

}



export async function unfollow(req,res){
    await unfollowUser(
        req.user.userId,
        req.validatedParams.userId
    );

    return res.status(200).json({
        success: true,
        message: "User unfollowed succesfully"
    });

}

export async function getFollowStats(req,res) {
    const stats=await getUserFollowStats(req.validatedParams.userId);

    return res.status(200).json({
        succsss: true ,
        data: stats,
    });
}