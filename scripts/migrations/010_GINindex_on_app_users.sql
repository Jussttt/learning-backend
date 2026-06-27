CREATE INDEX idx_app_users_search
ON app_users
USING GIN(
    to_tsvector(
        'simple',

        COALESCE(profile_name,'') || ' '||
        COALESCE(first_name,'') || ' '||
        COALESCE(last_name,'')
    )
);