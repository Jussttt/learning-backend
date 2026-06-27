export const RateLimits={
    LOGIN:{
        limit:5,
        windowSeconds:60,
        prefix:"login"
    },
    SIGNUP:{
        limit:3,
        windowSeconds:300,
        prefix:"signup"
    },
    COMMENT:{
        limit:20,
        windowSeconds:60,
        prefix:"comment"
    }
};