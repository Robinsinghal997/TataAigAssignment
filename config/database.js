const mongoose = require("mongoose");
const dbconnnection = () => {
  mongoose
    .connect(process.env.DBURL)
    .then((data) =>
      console.log(`Connected! with server ${data.connection.host}`)
    );
};
module.exports = dbconnnection;
