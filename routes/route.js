const express = require("express"); // Imporing Express
const router = express.Router(); 
const multer = require("multer"); // For uploading image
const path = require("path");    // For using multer
const User = require("../models/userSchema"); // Importing Userschema
const { registerRoute, loginUser, forgotPassword, resetPasscode, logoutUser, addUser, postData, deleteUser, passData, updateUser } = require("../controllers/authcontrollers");// Controllers
const cookieParser = require("cookie-parser");  // For sending data from frnt to bckend
const authee = require("../middlewares/authee"); // for authenticaation.
router.use(express.json());  //to parse the data
router.use(cookieParser());  // For sending data from frnt to bckend

// TESTING ROUTE
router.get("/test", (req, res) => { res.send("Server Tested no, issue.") });

// USER REGISTER ROUTE
router.post("/register", registerRoute);

// USER LOGIN ROUTE
router.post("/login", loginUser);

// FORGOT PASSWORD ROUTE ( VERIFING EMAIL AND SENDING LINK ON GMAIL )
router.post("/forgot", forgotPassword);

// Reset Password Route
router.post("/resetpassword/:token", resetPasscode);  // passing the token to backend which we passes fron frntend.

// VALIDATING USER TO SHOW HOME PAGE
router.get("/home", authee, (req, res) => { console.log("Welcome to ContactMaster Home Page"); res.send(req.rootUser); });

// LOGGING OUT USER
router.get("/logout", logoutUser);

// ADDING NEW CONTACT USER   // Configruing Image Upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Specify the directory where files should be uploaded
    },
    filename: (req, file, cb) => {
        // Keep the original filename with a timestamp
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const upload = multer({ storage: storage });
router.post("/adduser", upload.single("image"),authee, addUser); // Adding authentication to get the user detail who wanna add contact so that we can save it in his data only.

// Validating before Sending Contact Data 
router.get("/validateuser", authee, (req, res) => { console.log("ContactMaster Contact Page Access Given."); console.log(req.rootUser.name,  req.rootUser.email); res.send(req.rootUser); })


//Delete Contact Route
router.delete("/deletedata/:contactId",authee, deleteUser);

// Passing  Data to Edit
router.get("/passdata/:id", authee, passData);

// Update Contact Data
router.post("/updateuser/:id", upload.single("image"), authee, updateUser);

module.exports = router;