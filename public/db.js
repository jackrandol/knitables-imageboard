const spicedPg = require('spiced-pg');
// const secrets = require('./secrets');
// you can leave the // after postgres: if you want

const db = spicedPg(
  process.env.DATABASE_URL ||
    `postgres://postgres:postgres@localhost:5432/imageboard`
);

exports.getImages = function () {
  return db.query(
    `SELECT * FROM images
        ORDER BY id DESC
        LIMIT 10`
  );
};

//getting the images always with the same query
//startId is always the highest number image on screen
//the offset is the number of images currenlty on screen
//the offset says skip that many number of rows or images and then start pulling the next ten images

exports.addImage = function (username, title, description, url) {
  console.log('***data inserted into images DB table***');

  return db.query(
    `INSERT INTO images (username, title, description, url)
        VALUES ($1, $2, $3, $4)
        RETURNING *`,
    [username, title, description, url]
  );
};

exports.getImageById = function (id) {
  return db.query(
    `SELECT url, title, username, id, description,
        (SELECT id FROM images WHERE id < $1
        ORDER BY id DESC
        LIMIT 1) AS "prevImageId",
        (SELECT id FROM images WHERE id > $1
        ORDER BY id ASC
        LIMIT 1)
        AS "nextImageId"
        FROM images
        WHERE id = $1`,
    [id]
  );
};

exports.getComments = function (id) {
  return db.query(`SELECT * FROM comments WHERE image_id = $1`, [id]);
};

exports.addComment = function (username, comment, image_id) {
  return db.query(
    // console.log('comment entered into DB!');
    `INSERT INTO comments (username, comment, image_id)
        VALUES ($1, $2, $3)
        RETURNING *`,
    [username, comment, image_id]
  );
};

exports.getMoreImages = function (lastid) {
  return db
    .query(
      `SELECT url, title, username, id, description, (
            SELECT id FROM images
            ORDER BY id ASC
            LIMIT 1
            ) AS "lowestId" FROM images
            WHERE id < $1
            ORDER BY id DESC
            LIMIT 10`,
      [lastid]
    )
    .then(({ rows }) => rows);
};

exports.deleteImage = function (id) {
  return db.query(`DELETE FROM images WHERE id = $1`, [id]);
};

exports.deleteComments = function (image_id) {
  return db.query(`DELETE FROM comments WHERE image_id = $1`, [image_id]);
};
