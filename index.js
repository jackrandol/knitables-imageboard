const express = require('express');
const app = express();
const db = require('./public/db.js');
///FILE upload boilerplate code
const multer = require('multer');
const uidSafe = require('uid-safe');
const path = require('path');
const s3 = require('./s3');

const diskStorage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, __dirname + '/uploads');
  },
  filename: function (req, file, callback) {
    uidSafe(24).then(function (uid) {
      callback(null, uid + path.extname(file.originalname));
    });
  },
});

const uploader = multer({
  storage: diskStorage,
  limits: {
    fileSize: 2097152,
  },
});

//this serves all htmlcss/front end   js requests!
app.use(express.static('public'));
app.use(express.json());

app.get('/images', (req, res) => {
  db.getImages().then((response) => {
    var imagesFromDb = response.rows;
    console.log('imagesFromDb:', imagesFromDb);
    res.json(imagesFromDb);
  });
});

app.get('/moreimages/:lastid', (req, res) => {
  db.getMoreImages(req.params.lastid).then((response) => {
    var moreImagesFromDb = response;
    res.json(moreImagesFromDb);
  });
});

app.get('/image/:id', (req, res) => {
  db.getImageById(req.params.id)
    .then((response) => {
      console.log('response.rows[0]:', response.rows[0]);
      var imageData = response.rows[0];
      res.json(imageData);
    })
    .catch((error) => {
      console.log('error from getImageById:', error);
    });
});

app.get('/imagecomments/:id', (req, res) => {
  db.getComments(req.params.id).then((response) => {
    var imageComments = response.rows;
    res.json(imageComments);
  });
});

app.post('/comment', (req, res) => {
  console.log(req.params);
  db.addComment(req.body.username, req.body.comment, req.body.image_id)
    .then((response) => {
      return res.json(response.rows);
    })
    .catch((error) => {
      console.log('error from POST /comment:', error);
      return res.json(error);
    });
});

app.get('/deleteimage/:id', (req, res) => {
  db.deleteImage(req.params.id).then((response) => {
    db.deleteComments(req.params.id);
    res.json(response);
  });
});

app.post('/upload', uploader.single('file'), s3.upload, (req, res) => {
  let fileUrl = 'https://s3.amazonaws.com/littlegremlin/' + req.file.filename;
  db.addImage(req.body.username, req.body.title, req.body.description, fileUrl)
    .then(function (response) {
      console.log('fileURl', fileUrl);
      console.log('response.rows[0]:', response.rows[0]);
      return res.json(response.rows[0]);
    })
    .catch(function (error) {
      console.log('error in catch POST /upload:', error);
      return res.json(error);
    });
});

app.listen(process.env.PORT || 8080, () => console.log('Imageboard is up!'));
