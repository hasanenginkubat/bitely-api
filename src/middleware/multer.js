const multer = require("multer");
const multerS3 = require("multer-s3");
const { S3 } = require("@aws-sdk/client-s3");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

const s3 = new S3({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS,
  },
});

const storage = multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, uuidv4() + '-' + file.originalname);
    },
  });
  

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 2,
  },
});

module.exports = upload;