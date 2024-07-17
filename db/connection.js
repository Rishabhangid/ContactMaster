const mongoose = require("mongoose"); // importing mongoose
const DB = process.env.DB;   // importing db link
mongoose.connect(DB)    // connecting bd
.then(res=>console.log("DATABASE CONNECTING TO BACKEND SUCESFULLY."))
.catch(err=>console.log("ERROR IN CONNECTING WITH DATABASE."))