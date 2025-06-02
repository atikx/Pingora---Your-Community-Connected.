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
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_scheduled BOOLEAN DEFAULT FALSE,
    scheduled_at TIMESTAMP
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
    parent_id UUID REFERENCES comments (id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    user_id UUID REFERENCES users (id) ON DELETE CASCADE,
    author_id UUID REFERENCES users (id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, author_id)
);

CREATE TYPE request_status AS ENUM ('pending', 'approved', 'rejected');

CREATE TABLE admin_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    user_id UUID REFERENCES users (id) ON DELETE CASCADE NOT NULL,
    reason VARCHAR(500) NOT NULL,
    status request_status DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DROP Table admin_requests

drop table adminRequests;   

SELECT comments.*, users.name AS user_name, users.avatar AS user_avatar
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
        'Atiksh Gupta',
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

SELECT * FROM users

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
WHERE
    posts.id = '62131742-5665-44e4-a18d-c6b38daf87cb';

SELECT COUNT(*) FROM posts WHERE user_id IN ( SELECT id FROM users );

DELETE from posts
where
    user_id = '2f0b368a-022e-4a93-9054-52c800e435b4';

SELECT * FROM POSTS;

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
    JOIN users ON posts.user_id = users.id
where
    posts.category = 'Science'

SELECT
    posts.*,
    users.id AS author_id,
    users.name AS author_name,
    users.email AS author_email,
    users.avatar AS author_avatar
FROM posts
    JOIN users ON posts.user_id = users.id;

SELECT users.email
FROM subscriptions
    JOIN users ON subscriptions.user_id = users.id
WHERE
    subscriptions.author_id = '76ed88f3-9cdc-4fff-8074-f9083cbf74d7';

DELETE FROM subscriptions;

SELECT * FROM subscriptions;

SELECT * from users

INSERT INTO
    subscriptions (user_id, author_id)
VALUES (
        'a5c6cfbf-abcb-447f-8cb7-20fef2ef3faa',
        '76ed88f3-9cdc-4fff-8074-f9083cbf74d'
    )
RETURNING
    *;

UPDATE users
SET
    is_verified = true
WHERE
    email = 'modi@gmail.com'
RETURNING
    *

SELECT users.email
FROM subscriptions
    JOIN users ON subscriptions.user_id = users.id
WHERE
    subscriptions.author_id = '76ed88f3-9cdc-4fff-8074-f9083cbf74d7';

delete from subscriptions

select * from subscriptions;

SELECT * from likes;

ALTER TABLE posts
ADD COLUMN is_scheduled BOOLEAN DEFAULT FALSE,
ADD COLUMN scheduled_at TIMESTAMP;

SELECT
    posts.id,
    posts.title,
    posts.description,
    posts.image,
    posts.views,
    posts.tags,
    posts.category,
    posts.created_at,
    users.name AS author_name,
    users.email AS author_email,
    users.avatar AS author_avatar
FROM posts
    JOIN users ON posts.user_id = users.id
WHERE
    posts.is_scheduled = false;

select * from subscriptions;

SELECT users.id, users.name, users.avatar, users.created_at
FROM subscriptions
    JOIN users ON subscriptions.author_id = users.id
WHERE
    subscriptions.user_id = 'a5c6cfbf-abcb-447f-8cb7-20fef2ef3faa';

Select * from users where isadmin = true;

UPDATE users SET isadmin = false where id = 'e77492eb-147e-4248-97fc-e9628891f728'