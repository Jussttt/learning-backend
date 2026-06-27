BEGIN;

ALTER TABLE stories
RENAME COLUMN media_url
TO media_key;

COMMIT;