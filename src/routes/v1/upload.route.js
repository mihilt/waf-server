const express = require('express');
const multer = require('multer');
const fs = require('fs');

const controller = require('../../controllers/upload');

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;

    const uploadPath = `./public/uploads/${year}/${month}`;

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}.${file.mimetype.split('/')[1]}`);
  },
});

const upload = multer({ storage });

router.post('/', upload.single('file'), controller.upload);

module.exports = router;
