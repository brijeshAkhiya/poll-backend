const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, path.join(__dirname, '../../../public/Images'));
  },
  filename(req, file, cb) {
    const mimetypearray = file.mimetype.split('/');
    const mimetype = mimetypearray[1];
    cb(null, `${file.fieldname}${Date.now().toString()}.${mimetype}`);
  },
});

module.exports = storage;
