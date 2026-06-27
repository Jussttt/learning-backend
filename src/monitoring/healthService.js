import { pool }
from "../db/pool.js";

import { cacheClient } from "../cache/cacheServer.js";
import { storyQueue } from "../jobs/queues/storyQueue.js";
import { HeadBucketCommand } from "@aws-sdk/client-s3";
import { s3Client } from "../storage/s3Client.js";
import { env } from "../config/env.js";

export async function
checkDatabaseHealth() {

  try{
    await pool.query("SELECT 1");

    return {
      status:"up"
    };

  
  }catch{
    return {
      status:"down"
    };
  }

  
}

export async function checkRedisHealth(){
  try{
    await cacheClient.ping();

    return {
      status:"up"
    };
  }catch{
    return {
      status:"down"
    };
  }
}

export async function checkBullMQHealth(){
  try{
    await storyQueue.getJobCounts();

    return {
      status:"up"
    };
  }catch(err){
    console.error(
        "BullMQ health check failed:",
        err
    );
    return {
      status:"down"
    };
  }
}

export async function checkS3Health(){
  try{
    await s3Client.send(
      new HeadBucketCommand({
        Bucket:
          env.S3_BUCKET_NAME
      })
    );

    return {
      status:"up"
    };
  }catch{
    return {
      status:"down"
    };
  }
}

export async function checkHealth(){
  const [
    database,
    redis,
    bullmq,
    s3
  ]=await Promise.all([
    checkDatabaseHealth(),
    checkRedisHealth(),
    checkBullMQHealth(),
    checkS3Health()
  ]);

  const healthy=[
    database,
    redis,
    bullmq,
    s3
  ].every(
    (service)=>{
      return service.status==="up"
    }
  );

  return {
    status:healthy?"healthy":"degraded",
    uptime:process.uptime(),
    timestamp: new Date().toISOString(),

    services:{
      database,
      redis,
      bullmq,
      s3
    }
  };
}