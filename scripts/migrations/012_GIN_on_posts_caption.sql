CREATE INDEX idx_posts_caption_search
ON posts
USING GIN(
    to_tsvector(
        'english',
        COALESCE(caption,'')
    )
);