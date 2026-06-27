import bcrypt from "bcrypt";

import { findUserByEmail,doesProfileNameExist,createUser,findUserById } from "../repositories/authRepository.js";

import { ConflictError } from "../errors/ConflictError.js";
import { logger } from "../logger/logger.js";
import { env } from "../config/env.js";
import { UnauthorizedError } from "../errors/UnauthorizedError.js";
import { generateAccessToken } from "../utils/jwt.js";


export async function signupUser(data){

    const existingUser=await findUserByEmail(
        data.email
    );

    if(existingUser){
        logger.warn(
            {
                email:data.email
            },
            "Signup failed: email already exists"
        );

        throw new ConflictError("Email Already Exists");
    }

    const usernameExists= await doesProfileNameExist(data.profile_name);

    if(usernameExists){
        logger.warn(
            {
                profile_name:data.profile_name
            },
            "Signup failed: username already exists"
        );
        throw new ConflictError("Profile Name Already exists");
    }

    const password_hash=await bcrypt.hash(
        data.password,
        env.BCRYPT_ROUNDS
    );

    const user=await createUser({
        ...data,password_hash
    });

    logger.info(
        {
            userId: user.id,
            profileName: user.profile_name
        },
        "User registered"
    );
    
    return user;
}

export async function loginUser({
    email,
    password
}){

    const user= await findUserByEmail(email);

    if(!user){

        logger.warn(
            {
                email:email
            },
            "Login failed: user not found"
        );
        throw new UnauthorizedError();
    }

    const isPasswordValid=await bcrypt.compare(
        password,user.password_hash
    )

    if(!isPasswordValid){
        logger.warn(
            {
                email:email
            },
            "Login failed: invalid password"
        );
        throw new UnauthorizedError();
    }

    const accessToken=
        generateAccessToken({
            userId:user.id,
        });

    logger.info(
        {
            userId: user.id,
            profileName: user.profile_name
        },
        "User logged in"
    );

    return {
        accessToken,
        user:{
            id:user.id,
            email:user.email,
            profile_name:user.profile_name
        }
    };
}

export async function getCurrentUser(userId){
    const user=await findUserById(userId);

    if(!user){
        throw new NotFoundError("User not found");
    }

    return user;
}