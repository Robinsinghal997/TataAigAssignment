# TataAigAssignment

how to start the project 

create .env file in config folder and  insert this enviroment valiable 

PORT=8000
DBURL=mongodb://127.0.0.1:27017/EcommerceAssignment

// jwt enviroment variable
JWT_SECRET=dbdhk55gfhgjhlkf98094ngkbngf54548ggfbkgfnlbvs785456
JWt_EXPIRE=5d
COOKIE_EXPIRE=5

// smtp Service for sending email to forget password of profle managment 

SMPT_SERVICES=smtp.gmail.com
SMPT_MAIL=robinsinghal997@gmail.com
SMPT_PASSWORD=cxbtataqnlceaydo

// Adding Cloudinary enviroment or Uploading  image user image and product image 

CLOUD_NAME=robin1234565
API_KEY=299735362882269
API_SECRET=WDIi-S4nsZVQsRd7VSQnpAGUt6o



once added enviroment variable in env file then 

open terminal and run some commend 
    1. npm install // to install all dependancy 
    2. npm run dev  // to run the assignment in development mode 


after that open postman and import the  E-Commerce assignment.postman_collection.json file 

there has some admin route these route access only admin like create product , delete product, update product , getall order , update order etc 

go to the user role foler in postman and hit the api for create admin 

then you can access all routes

if there is any issue then please connect me 

Email = robinsinghal997@gmail.com
phoneno = 9927193653