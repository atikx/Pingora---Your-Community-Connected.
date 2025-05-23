CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    name VARCHAR(255) DEFAULT 'John Doe',
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT,
    isadmin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    avatar TEXT DEFAULT 'https://thumbs.dreamstime.com/b/generative-ai-young-smiling-man-avatar-man-brown-beard-mustache-hair-wearing-yellow-sweater-sweatshirt-d-vector-people-279560903.jpg',
    is_verified BOOLEAN DEFAULT FALSE,
    otp INTEGER
);

CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    user_id UUID REFERENCES users (id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    content JSONB NOT NULL,
    image TEXT NOT NULL,
    tags TEXT [],
    category VARCHAR(50),
    views INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    user_id UUID REFERENCES users (id) ON DELETE CASCADE,
    post_id UUID REFERENCES posts (id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, post_id)
);

CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    user_id UUID REFERENCES users (id) ON DELETE CASCADE,
    post_id UUID REFERENCES posts (id) ON DELETE CASCADE,
    parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


SELECT 
  comments.*,
  users.name AS user_name,
  users.avatar AS user_avatar
FROM comments
JOIN users ON comments.user_id = users.id;


DROP Table comments CASCADE

INSERT INTO
    users (
        name,
        email,
        isadmin,
        avatar,
        is_verified
    )
VALUES (
        'Narendra Modi',
        'nmodi@gmail.com',
        TRUE,
        'https://thumbs.dreamstime.com/b/generative-ai-young-smiling-man-avatar-man-brown-beard-mustache-hair-wearing-yellow-sweater-sweatshirt-d-vector-people-279560903.jpg',
        TRUE
    );

SELECT * from users where name = 'ATIKSH GUPTA';

DROP TABLE posts CASCADE;

DROP Table users CASCADE

SELECT * from users

DELETE FROM users WHERE name = 'john';

SELECT
    id,
    name,
    email,
    isadmin,
    avatar,
    is_verified,
    created_at
FROM users

SELECT * from posts

SELECT * FROM posts ORDER BY created_at DESC;

SELECT
    posts.title,
    posts.description,
    posts.image,
    posts.tags,
    posts.views,
    posts.category,
    posts.created_at,
    users.name AS author_name,
    users.email AS author_email,
    users.avatar AS author_avatar
FROM posts
    JOIN users ON posts.user_id = users.id
ORDER BY posts.created_at DESC;




SELECT
    posts.*,
    users.name AS author_name,
    users.email AS author_email,
    users.avatar AS author_avatar
FROM posts
JOIN users ON posts.user_id = users.id
WHERE posts.id = '62131742-5665-44e4-a18d-c6b38daf87cb';



SELECT COUNT(*) FROM posts
WHERE user_id IN (SELECT id FROM users);

DELETE from posts where user_id = '2f0b368a-022e-4a93-9054-52c800e435b4';

SELECT * FROM POSTS ;


SELECT
    posts.id,
    posts.title,
    posts.description,
    posts.image,
    posts.tags,
    posts.category,
    posts.created_at,
    users.name AS author_name,
    users.email AS author_email,
    users.avatar AS author_avatar
FROM posts
    JOIN users ON posts.user_id = users.id where posts.category = 'Science'