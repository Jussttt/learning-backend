import { success } from "zod";
import { updateProfile,getUserProfile as getUserProfileService, searchUserService } from "../../services/userService.js";

export async function updateMyProfile(req,res){
    const user=await updateProfile(
        req.user.userId,
        req.validatedBody
    );

    return res.status(200).json({
        success:true,
        data:user,
    });
}

export async function getUserProfile(
    req,
    res
){
    const user=await getUserProfileService(
        req.params.userId
    );

    res.status(200).json(user);
}

export async function searchUsers(
    req,
    res
){
    const result=await searchUserService(
        req.validatedQuery.q,
        req.validatedQuery.limit
    );
    res.status(200).json({result});
}