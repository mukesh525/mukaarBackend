const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { upload, S3delete } = require('../services/upload');
const singleUpload = upload.single('file');
//const ffmpeg = require('fluent-ffmpeg')
const Joi = require("joi")

router.post('/', function (req, res) {

  singleUpload(req, res, function (err) {
    if (err) {
      return res.status(422).send({ errors: [{ title: 'File Upload Error', detail: err.message }] });
    }
    if (req.file == undefined) {
      return res.status(422).send({ errors: [{ title: 'File Upload Error', detail: 'Missing file' }] });
    }
    else {
      return res.json({ "key": req.file.key, "location": req.file.location });
    }


  });
});



router.delete('/', async (req, res) => {
  const UploadSchema = { images: Joi.array().items(Joi.string(), Joi.string()) }
  const { error } = Joi.validate(req.body, UploadSchema);

  if (error) return res.status(400).send({ "message": error.details[0].message.replace(/['"]+/g, '') });

  await req.body.images.map(value => { S3delete(value, (err, value) => { }) })
  return res.status(200).send({ "message": "Files deleted successfully" });

});

router.put('/', upload.array('file', 6), function (req, res) {
  console.log(req.files)
  var uploads = []
  req.files.map(file => uploads.push({ "key": file.key, "location": file.location }))
  res.status(200).send({ uploads: uploads })
})

module.exports = router;
``