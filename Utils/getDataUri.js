const DataUri = require("datauri/parser.js");
const path = require("path");
const getDataUri = async (file) => {
  const parser = new DataUri();
  const extName = path.extname(file.originalname).toString();
  return parser.format(extName, file.buffer);
};

module.exports = getDataUri;