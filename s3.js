const aws = require('aws-sdk');
const fs = require('fs');

let secrets;
//this if else block is only on here in case we host our site on heroku
if (process.env.NODE_ENV == 'production') {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require('./secrets'); // in dev they are in secrets.json which is listed in .gitignore
}


//here we're creating an aws client
const s3 = new aws.S3({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET
});


exports.upload = (req, res, next) => {
    console.log(req.file);
///if there's no file - tell aws not to upload anything
    if (!req.file) {
        console.log('no file :(');
        return res.sendStatus(500);
    }

    const {filename, mimetype, size, path} = req.file;

    const promise = s3.putObject({
        Bucket: "littlegremlin",
        ACL: 'public-read',
        Key: filename,
        Body: fs.createReadStream(path),
        ContentType: mimetype,
        ContentLength: size
    }).promise();

    promise.then(() => {
        console.log('image made it to Amazon!');
        next();
        //this will delete the image from uploads folder once the image has been
        //uploaded to amazon
        fs.unlink(path, () => {});
    }).catch(err => {
        console.log('error in putObject of s3.js:', err);
        res.sendStatus(500);
    });

};
