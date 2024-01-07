const multer = require('multer')

const storage = multer.memoryStorage();

const singleUpload = multer({ storage }).single('file')
const multipalUpload = multer({ storage }).array('file', 5)

module.exports = {
    multipalUpload,
    singleUpload,
}