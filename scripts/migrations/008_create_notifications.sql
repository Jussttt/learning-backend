CREATE TABLE notifications(
    id BIGSERIAL PRIMARY KEY,

    recipient_user_id BIGINT NOT NULL
        REFERENCES app_users(id)
        ON DELETE CASCADE,

    actor_user_id BIGINT NOT NULL
        REFERENCES app_users(id)
        ON DELETE CASCADE,
    
    type VARCHAR(50) NOT NULL
    CHECK(
        TYPE IN (
            'follow',
            'like',
            'comment',
            'message'
        )
    ),

    entity_id BIGINT,

    is_read BOOLEAN NOT NULL    
        DEFAULT FALSE,

    created_at TIMESTAMP WITH TIME ZONE NOT NULL
        DEFAULT NOW()
);

CREATE INDEX idx_notifications_recipient_created
ON notifications(
    recipient_user_id,
    created_at DESC
);

CREATE INDEX idx_notifications_unread
ON notifications(
    recipient_user_id,
    is_read
);