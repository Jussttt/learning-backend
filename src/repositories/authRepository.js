import e from "express";
import { pool } from "../db/pool.js";

export async function findUserByEmail(email){
    const result=
    await pool.query(`SELECT
        id,
        email,
        profile_name,
        password_hash
        FROM app_users
        WHERE email=$1
        `,[email]);

    return result.rows[0]??null;

}

export async function doesProfileNameExist(profileName){
    const result=await pool.query(`
        SELECT EXISTS(
        SELECT 1
        FROM app_users
        WHERE profile_name=$1 
        ) AS exists
        `,
        [profileName]
        
        );

    return result.rows[0].exists;
}

export async function createUser({
    profile_name,
    email,
    password_hash,
    first_name,
    last_name
}){
    const result =await pool.query(
        `
        INSERT INTO app_users (
            profile_name,
            email,
            password_hash,
            first_name,
            last_name
        )
        VALUES (
            $1,
            $2,
            $3,
            $4,
            $5
        )
        RETURNING 
            id,
            profile_name,
            email,
            first_name,
            last_name,
            created_at
        `,
        [
            profile_name,
            email,
            password_hash,
            first_name,
            last_name,
        ]
    );
    return result.rows[0];

}


export async function findUserById(userId){
    const result=await pool.query(
        `
        SELECT 
            id,
            profile_name,
            email,
            first_name,
            last_name,
            bio,
            profile_pic_url,
            is_private,
            created_at
        FROM app_users
        WHERE id=$1
        `,[userId]
    );

    return result.rows[0]??null;
}

