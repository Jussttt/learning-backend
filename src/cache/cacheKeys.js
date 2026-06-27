export const CacheKeys = {
    user: (userId) =>
        `user:${userId}`,

    userPosts: (userId) =>
        `user_posts:${userId}`,

    followStats: (userId) =>
        `follow_stats:${userId}`,

    feed: (userId) =>
        `feed:${userId}`
};