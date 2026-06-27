import {  PutObjectCommand ,GetObjectCommand, DeleteObjectCommand} from "@aws-sdk/client-s3";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import {randomUUID} from "crypto";

import { env } from "../config/env.js";

import { s3Client } from "./s3Client.js";

export async function generateUploadUrl(
    contentType
){
    const mimeToExtension={
        "image/jpeg":"jpeg",
        "image/png":"png",
        "image/webp":"webp",
        "video/mp4":"mp4"
    }

    const extension=mimeToExtension[contentType];

    if(!extension) throw new Error("Unsupported file type");


    const key=`uploads/${randomUUID()}.${extension}`;

    const command=new PutObjectCommand({
        Bucket:
            env.S3_BUCKET_NAME,
        Key: key,

        ContentType: contentType
    });

    const uploadUrl=await getSignedUrl(
        s3Client,
        command,
        {
            expiresIn:300
        }
    );

    return {
        uploadUrl,
        key
    };

    
}       

export async function generateReadUrl(
    key
){
    const command =new GetObjectCommand({
        Bucket:
            env.S3_BUCKET_NAME,
        Key:
            key
    });

    return await getSignedUrl(
        s3Client,
        command,
        {
            expiresIn: 3600
        }
    );

}

export async function deleteObject(
    key
){
    await s3Client.send(
        new DeleteObjectCommand(
            {
                Bucket:env.S3_BUCKET_NAME,
                Key:key
            }
        )
    );

}