const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const config = require('../config');
var path = require('path')

aws.config.update({
  secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
  accessKeyId: config.AWS_ACCESS_KEY_ID,
  region: 'us-west-1'
});

const s3 = new aws.S3();

var allowedtype = [
  'image/*',
  'image/jpeg',
  'image/gif',
  'image/png',
  'video/mp4',
  'video/mov',
  'video/quicktime',
  'video/*',
  'audio/mpeg',
  'audio/mp4',
  'application/pdf']

const fileFilter = (req, file, cb) => {
  if (allowedtype.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid ' + file.mimetype + ' file type allowed type ' + allowedtype), false);
  }
}

const upload = multer({
  fileFilter,
  storage: multerS3({
    acl: 'public-read',
    s3,
    bucket: config.BUCKET,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: 'TESTING_METADATA' });
    },
    key: function (req, file, cb) {
      var filename = Date.now().toString() + path.extname(file.originalname)
      cb(null, filename)
    }
  })
});


var deleteObj = function (key, cb) {
  s3.deleteObject({
    Bucket: config.BUCKET,
    Key: key
  }, function (err, data) {
    cb(err, data)
  })
};


exports.upload = upload;
exports.S3delete = deleteObj; 
