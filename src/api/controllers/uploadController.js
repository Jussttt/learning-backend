import { generateReadUrl } from "../../storage/s3Service.js";

import { generateUploadUrl } from "../../storage/s3Service.js";

export async function createPresignedUrl(
    req,
    res
) {
    const result=await generateUploadUrl(
        req.body.contentType
    );

    res.status(200).json(result);
}

export async function getReadUrl(
    req,
    res
){
    const {key}=req.query;

    const url=await generateReadUrl(key);

    res.status(200).json({
        url
    });
}