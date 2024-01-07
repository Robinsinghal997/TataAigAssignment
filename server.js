const app = require("./app");
const dotenv = require('dotenv')
const dbconnnection = require('./config/database')
const cloudinary = require("cloudinary");

// handeling uncaugth Error

process.on('uncaughtException',(error)=>{
console.log('Error',error.message);
console.log(`Shutting down the server Due to Uncaugth  Rejection`);
process.exit(1)
})

// Config
dotenv.config({path:'config/.env'})


dbconnnection()

// for Cloudinary
cloudinary.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  });
// app.all('/')

const server = app.listen(process.env.PORT,()=>{
    console.log(`server is running on ${process.env.PORT}`);
})

// Un handled Promiss Rejection

process.on('unhandledRejection',error=>{
     console.log('Error',error.message);
     console.log(`Shutting down the server Due to Unhandled Promise Rejection`);
     server.close(()=>{
        process.exit(1);
     })
})
