export const APP_NAME="insta-backend";

export const API_PREFIX="/api/v1";

export const CONVERSATION_TYPES=Object.freeze({
    DIRECT: "direct",
    GROUP: "group",
});

export const CONVERSATION_TYPE_VALUES=Object.values(CONVERSATION_TYPES);

export const MEDIA_TYPES=Object.freeze({
    IMAGE:"image",
    VIDEO:"video",
});

export const MEDIA_TYPE_VALUES=Object.values(MEDIA_TYPES);


export const TOKEN_TYPES=Object.freeze({
    ACCESS:"access",
    REFRESH:"refresh",
});

export const STORY_EXPIRY_HOURS=24;

export const STORY_EXPIRY_MS=STORY_EXPIRY_HOURS * 60 * 60 * 1000;

export const PAGINATION=Object.freeze({
    DEFAULT_PAGE_SIZE: 20,
    MAX_PAGE_SIZE:100,
});


export const USERNAME_RULES=Object.freeze({
    MIN_LENGTH: 3,
    MAX_LENGTH: 30,
    PATTERN: /^[a-zA-Z0-9_.]+$/,

});