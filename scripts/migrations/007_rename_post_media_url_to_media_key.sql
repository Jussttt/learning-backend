BEGIN;

ALTER TABLE post_media
RENAME COLUMN media_url
TO media_key;

COMMIT;