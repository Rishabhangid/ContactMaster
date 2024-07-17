// IMPORTING PACKAGES
const express = require("express");
const app = express();
const cors = require("cors");  // dealing with cors policy
const cookieParser = require("cookie-parser");  // helping to send token from frnt to bckend
const dotenv = require("dotenv");          // storing confidential data
dotenv.config({path:"./config.env"});      // importing dotenv file
app.use("/uploads",express.static("uploads")) // for multer images, to show image.

// MIDDLEWARES
app.use(cors());   // cors policy middleware
require("./db/connection");   // connecting to databse
app.use(express.json());     // to convert response in json format
app.use(cookieParser());     // cookie middleware



// SETTING UP SERVER
const PORT = process.env.PORT  // importing port number
app.use(require("./routes/route"));  // importing routes
app.listen(PORT,()=>{console.log(`Server Started at port no. ${PORT}`);}) // starting server
