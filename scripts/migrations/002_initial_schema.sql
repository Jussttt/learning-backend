CREATE TABLE app_users(
    id BIGSERIAL PRIMARY KEY,

    profile_name VARCHAR(50) UNIQUE NOT NULL,

    email CITEXT NOT NULL UNIQUE,

    password_hash VARCHAR(255) NOT NULL,

    first_name VARCHAR(50),
    last_name VARCHAR(50),

    bio TEXT,
    profile_pic_url TEXT,

    is_private BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_profile_name_format
        CHECK (
            profile_name ~ '^[a-zA-Z0-9_.]+$'
        ),

    CONSTRAINT chk_bio_length
        CHECK (
            bio IS NULL
            OR LENGTH(bio) <= 150
        )
);

CREATE TABLE followers(
	following_user_id BIGINT NOT NULL,

	followed_user_id BIGINT NOT NULL,

	created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
	
	PRIMARY KEY(following_user_id,followed_user_id),
	FOREIGN KEY(following_user_id) REFERENCES app_users(id) ON DELETE CASCADE,
	FOREIGN KEY (followed_user_id) REFERENCES app_users(id) ON DELETE CASCADE,
	CHECK(following_user_id <> followed_user_id)
	
);


CREATE TABLE post_types(
	id SMALLSERIAL PRIMARY KEY,
	name VARCHAR(30) NOT NULL UNIQUE 
);


CREATE TABLE locations(
	id 	BIGSERIAL PRIMARY KEY,
	name VARCHAR(255) NOT NULL,
	city VARCHAR(100),
	country_code VARCHAR(3),
	location GEOGRAPHY(point,4326) NOT NULL,
	created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()

);


CREATE TABLE posts(
	id BIGSERIAL PRIMARY KEY,
	created_by_user_id BIGINT NOT NULL,
	post_type_id SMALLINT NOT NULL,
	location_id BIGINT,
	caption TEXT,
	created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
	deleted_at TIMESTAMP WITH TIME ZONE,

	FOREIGN KEY (created_by_user_id) REFERENCES app_users(id) ON DELETE CASCADE,
	FOREIGN KEY (post_type_id) REFERENCES post_types(id),
	FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE SET NULL,
    CONSTRAINT chk_caption_length
    CHECK(
        caption IS NULL OR LENGTH(caption) <= 2200
    )
);


CREATE TABLE post_media(
	id BIGSERIAL PRIMARY KEY,
	post_id BIGINT NOT NULL,
	media_url TEXT NOT NULL,
	media_type VARCHAR(30) NOT NULL,
	position SMALLINT NOT NULL,
	width INT,
	height INT,
	created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

	FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    CONSTRAINT chk_post_media
    CHECK(
        media_type IN ('image','video')
    ),
    CONSTRAINT chk_position
    CHECK (position >0)
);


CREATE TABLE post_media_user_tags(
	user_id BIGINT NOT NULL,
	post_media_id BIGINT NOT NULL,
	x_coordinate FLOAT,
	y_coordinate FLOAT,
	created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

	PRIMARY KEY(user_id,post_media_id),
	FOREIGN KEY (user_id) REFERENCES app_users(id) ON DELETE CASCADE,
	FOREIGN KEY (post_media_id) REFERENCES post_media(id) ON DELETE CASCADE,
    CONSTRAINT chk_x_coordinate
    CHECK (
        x_coordinate IS NULL OR
        (x_coordinate >= 0 AND x_coordinate <= 1)
    ),

    CONSTRAINT chk_y_coordinate
        CHECK (
            y_coordinate IS NULL OR
            (y_coordinate >= 0 AND y_coordinate <= 1)
        )
	
);

CREATE TABLE likes (
    user_id BIGINT NOT NULL,
    post_id BIGINT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    PRIMARY KEY (user_id, post_id),
    FOREIGN KEY (user_id) REFERENCES app_users(id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);

CREATE TABLE comments (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    post_id BIGINT NOT NULL,
    content TEXT NOT NULL,
    replying_comment_id BIGINT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,

    FOREIGN KEY (user_id) REFERENCES app_users(id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (replying_comment_id) REFERENCES comments(id) ON DELETE SET NULL,
    CONSTRAINT chk_comment_not_empty
        CHECK (LENGTH(TRIM(content))>0)
);

CREATE TABLE stories (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    media_type VARCHAR(10) NOT NULL
        CHECK (media_type IN ('image', 'video')),
    media_url TEXT NOT NULL,
    caption TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,

    FOREIGN KEY (user_id) REFERENCES app_users(id) ON DELETE CASCADE,
    CONSTRAINT chk_story_expiry
        CHECK (expires_at > created_at)
);

CREATE TABLE story_views (
    user_id BIGINT NOT NULL,
    story_id BIGINT NOT NULL,
    viewed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    PRIMARY KEY (user_id, story_id),
    FOREIGN KEY (user_id) REFERENCES app_users(id) ON DELETE CASCADE,
    FOREIGN KEY (story_id) REFERENCES stories(id) ON DELETE CASCADE
);

CREATE TABLE conversations (
    id BIGSERIAL PRIMARY KEY,
    type VARCHAR(20) NOT NULL,
    last_message_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_conversation_type
        CHECK(
            type IN ('direct','group')
        )
);

CREATE TABLE conversation_participants (
    conversation_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    PRIMARY KEY (conversation_id, user_id),
    FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES app_users(id) ON DELETE CASCADE
);

CREATE TABLE messages (
    id BIGSERIAL PRIMARY KEY,
    conversation_id BIGINT NOT NULL,
    sender_user_id BIGINT ,
    message_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,

    FOREIGN KEY (conversation_id)
        REFERENCES conversations(id)
        ON DELETE CASCADE,

    FOREIGN KEY (sender_user_id)
        REFERENCES app_users(id)
        ON DELETE SET NULL,

    CONSTRAINT chk_message_not_empty
        CHECK (LENGTH(TRIM(message_text)) > 0)
);

CREATE TABLE message_receipts (
    message_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    delivered_at TIMESTAMP WITH TIME ZONE,
    read_at TIMESTAMP WITH TIME ZONE,

    PRIMARY KEY (message_id, user_id),
    FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES APP_users(id) ON DELETE CASCADE,
    CONSTRAINT chk_receipt_timestamps
    CHECK (
        delivered_at IS NULL
        OR read_at IS NULL
        OR read_at >= delivered_at
    )
);
