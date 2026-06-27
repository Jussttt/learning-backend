INSERT INTO post_types(name) 
VALUES
('image'),
('video')
ON CONFLICT (name) DO NOTHING;