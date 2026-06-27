CREATE INDEX idx_followers_followed ON followers(followed_user_id);

CREATE INDEX idx_locations_geo ON locations USING GIST(location);

CREATE INDEX idx_post_user_active ON posts(created_by_user_id) WHERE deleted_at IS NULL;

CREATE INDEX idx_post_location_id ON posts(location_id) WHERE deleted_at IS NULL;

CREATE INDEX idx_post_media_post_id ON post_media(post_id);

CREATE INDEX idx_pmut_media_id ON post_media_user_tags(post_media_id);

CREATE INDEX idx_likes_post_id ON likes(post_id);

CREATE INDEX idx_comments_post_active ON comments(post_id) WHERE deleted_at IS NULL;

CREATE INDEX idx_comments_replying_active ON comments(replying_comment_id) WHERE replying_comment_id IS NOT NULL AND deleted_at IS NULL;

CREATE INDEX idx_stories_user_expires
ON stories(user_id, expires_at);

CREATE INDEX idx_story_views_story_id on story_views(story_id);

CREATE INDEX idx_conv_part_user ON conversation_participants(user_id);

CREATE INDEX idx_messages_conv_created_active
ON messages(conversation_id, created_at DESC)
WHERE deleted_at IS NULL;

CREATE INDEX idx_conversations_last_message
ON conversations(last_message_at DESC);


CREATE INDEX idx_receipts_user_unread
ON message_receipts(user_id)
WHERE read_at IS NULL;