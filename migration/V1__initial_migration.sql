
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    google_id VARCHAR(32) NOT NULL UNIQUE,
    email VARCHAR(128) NOT NULL,
    user_name VARCHAR(128) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
);

CREATE TABLE roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(32) NOT NULL
);

CREATE TABLE user_roles (
    user_id INT NOT NULL REFERENCES users(user_id),
    role_id INT NOT NULL REFERENCES roles(role_id),
    PRIMARY KEY (user_id, role_id)
);

CREATE TABLE questions (
    question_id SERIAL PRIMARY KEY,
    question_text VARCHAR(256) NOT NULL
);

CREATE TABLE choices (
    choice_id SERIAL PRIMARY KEY,
    question_id INT NOT NULL REFERENCES questions(question_id),
    choice_text VARCHAR(128) NOT NULL
);

CREATE TABLE answers (
    answer_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id),
    choice_id INT NOT NULL REFERENCES choices(choice_id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);