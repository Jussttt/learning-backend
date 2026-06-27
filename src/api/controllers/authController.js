import { success } from "zod";
import { signupUser } from "../../services/authService.js";

import { loginUser ,getCurrentUser} from "../../services/authService.js";

export async function signup(req,res){

    const user=await signupUser(req.validatedBody);

    return res.status(201).json({
        success: true ,
        data: user,
    });
}

export async function login(req,res){
    const result=await loginUser(req.validatedBody);

    return res.status(200).json({
        success:true,
        data: result,
    });
}

export async function me(
    req,
    res
){


    return res.json({
        success: true ,
        data: req.currentUser,
    });

}