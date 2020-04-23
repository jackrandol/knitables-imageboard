DROP TABLE IF EXISTS images CASCADE;
DROP TABLE IF EXISTS comments;

CREATE TABLE images(
    id SERIAL PRIMARY KEY,
    url VARCHAR NOT NULL CHECK (url != ''),
    username VARCHAR NOT NULL CHECK (username != ''),
    title VARCHAR NOT NULL CHECK (title != ''),
    description TEXT CHECK (description != ''),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE comments (
      id SERIAL PRIMARY KEY,
      username VARCHAR(255) NOT NULL CHECK (username != ''),
      comment VARCHAR(255) NOT NULL CHECK (comment != ''),
      image_id INT NOT NULL references images(id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

