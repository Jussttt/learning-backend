import {ListBucketsCommand} from "@aws-sdk/client-s3";

import { s3Client } from "./s3Client.js";

const result=await s3Client.send(
    new ListBucketsCommand({})
);

console.log(result.Buckets);