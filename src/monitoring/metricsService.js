import { postsCreatedCounter }
from "./metrics/postMetrics.js";

import { followsCreatedCounter }
from "./metrics/followMetrics.js";

import { likesCreatedCounter }
from "./metrics/likeMetrics.js";

import {
    loginCounter
}
from "./metrics/authMetrics.js";

import { notificationCounter }
from "./metrics/notificationMetrics.js";

import {
    storyJobCounter
}
from "./metrics/queueMetrics.js";

import { redisConnectionGauge }
from "./metrics/redisMetrics.js";

import { uploadsCounter }
from "./metrics/s3Metrics.js";

import { activeConnectionsGauge }
from "./metrics/socketMetrics.js";


export function incrementPostsCreated(
    postType
) {
    postsCreatedCounter.inc({
        post_type:postType
    });
}

export function incrementFollowCreated() {
    followsCreatedCounter.inc();
}

export function incrementLikeCreated() {
    likesCreatedCounter.inc();
}

export function incrementNotificationCreated(
    type
) {
    notificationCounter.inc(
        type
    );
}

export function incrementLogin(
    status
) {
    loginCounter.inc({
        status
    });
}



export function incrementStoryJob(
    status
) {
    storyJobCounter.inc({
        status
    });
}



export function incrementUploads() {
    uploadsCounter.inc();
}

export function setRedisConnected() {
    redisConnectionGauge.set(1);
}

export function setRedisDisconnected() {
    redisConnectionGauge.set(0);
}

export function setActiveSocketConnections(count) {
    activeConnectionsGauge.set(count);
}