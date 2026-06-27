CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX idx_users_profile_name_trgm
ON app_users
USING GIN(profile_name gin_trgm_ops);

CREATE INDEX idx_users_first_name_trgm
ON app_users
USING GIN(first_name gin_trgm_ops);

CREATE INDEX idx_users_last_name_trgm
ON app_users
USING GIN(last_name gin_trgm_ops);