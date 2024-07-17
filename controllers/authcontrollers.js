const User = require("../models/userSchema");  // importing user schema
const bcrypt = require("bcryptjs");   // for hasing and comparing password
const jsonweb = require("jsonwebtoken");    // to generate token while login and forgot password
const nodemailer = require('nodemailer');  // for sending mail to user wmail for reset link
const multer = require("multer");   // for uploading image to backend 
const authee = require("../middlewares/authee");  // for authenticating the user

// REGISTER ROUTE CONTROLLER
exports.registerRoute = async (req, res) => {
    const { name, email, password, cpassword } = req.body; // destructuring the data coming from frntend
    if (!name || !email || !password || !cpassword) {      // checking if data is empty or not ans sending error and procedding to try 
        console.log("Empty Feilds.");
        res.status(400).json({ error: "Empty Feilds." });
    }
    try {
        const findemail = await User.findOne({ email: email });  // if email already exists ,throw error
        if (findemail) {
            console.log("User already registered with same email address.");
            res.status(422).json({ error: "User already exits with same email address." });
        }
        else {
            const newuser = new User({ name, email, password, cpassword });  // if new email then create new data object to save in db
            const saveuser = await newuser.save();  // saving to db
            if (saveuser) {     // if saved ,throw success
                console.log("User Registered Sucesfully.");
                res.status(201).json({ message: "User Registered Sucesfully." })
            }
            else {   // if cant save to db, throw error
                console.log("Cant register the user.")
                res.status(401).json({ error: "Cant register the user." });
            }
        }
    }
    catch (error) {  // any other error ,then throw error
        console.log(error);
        res.status(500).json({ error: "Cant register the user.catch error." });
    }
}

// LOGIN ROUTE CONTROLLER
exports.loginUser = async (req, res) => {
    const { email, password } = req.body; // destructring the frnted input
    if (!email || !password) {   // checking if input is not empty
        console.log("Empty Data feilds");
        res.status(400).json({ error: "Empty Data feilds" });
    }
    try {
        const finduser = await User.findOne({ email });   // finding if user registered or not
        if (!finduser) {
            console.log("The email address is not registered.");
            res.status(422).json({ error: "The email address is not registered." });
        }
        else {  // if registered then compare password , if matches then success , loggiind
            console.log("User Found.");
            const comparepassword = await bcrypt.compare(password, finduser.password);
            if (!comparepassword) {
                console.log("Wrong Password.");
                res.status(401).json({ error: "Wrong Password." });
            }
            else { // if password matched then generate token ( generatetoken function is defined in userschema)
                const token = await finduser.generateAuthToken();
                console.log(token);

                res.cookie("jwtoken", token, {  // once token generated ,sending token to browser
                    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    path: "/",
                    sameSite: "strict",
                });
                console.log("Login successful.");
                return res.status(200).json({ message: "Login successful." });
            }
        }

    }
    catch (error) {
        console.log("Unexpected error", error);
        res.status(500).json({ error: "Unexpected error", error });
    }
}

// Forgot Password Code
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;  // user inputs the registered email for reset link
    if (!email) {   // checking input
        console.log("Empty Feild");
        res.status(400).json({ error: "Empty Feild" });
    }
    try {
        const findemail = await User.findOne({ email: email });  // finding user with email
        if (!findemail) {
            console.log("Email not found."); // if email not found
            res.status(422).json({ error: "Email not found." });
        }
        else {
            // console.log('Email:', process.env.EMAIL);
            // console.log('Password:', process.env.PASSWORD);

            // if email found then generating a token which is valid for only 5 min.
            const token = jsonweb.sign({ id: findemail._id }, process.env.KEY, { expiresIn: "5m" }); // Generating Temporaly Token to verify Reset Password User,expires in 5m. 
            console.log(token);

            // Code to send Reset Link to User Email
            var transporter = nodemailer.createTransport({ // nodemailer code to send the mail
                service: 'gmail',
                port: 465,
                secure: true,
                logger: true,
                debug: true,
                secureConnection: false,
                auth: {
                    user: process.env.EMAIL, // sender email password and password stored in env file
                    pass: process.env.PASSWORD
                },
                tls: {
                    rejectUnauthorized: true
                }
            });

            var mailOptions = {   // definig mail body, here we send frnted link for reset component and also sending the token to validate the user and also further in reset password route will check this tokens validity. 
                from: process.env.EMAIL,
                to: email,
                subject: 'Reset Password Link',
                // text: `http://localhost:3000/reset/${token}`  // forntend component link to open the rest page.
                html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                <p style="color: #333;">Hello,</p>
                <p style="color: #555; font-size: 16px;">To reset your password, please click the following link:</p>
                <a href="http://localhost:3000/reset/${token}" style="display: inline-block; padding: 10px 20px; color: white; background-color: #007BFF; text-decoration: none; border-radius: 5px; margin: 10px 0;">Reset Password</a>
                <p style="color: #555; font-size: 16px;">The link is valid only for 5 minutes.</p>
                <p style="color: #555; font-size: 16px;">If you did not request a password reset, please ignore this email.</p>
                <br>
                <img src="https://drive.google.com/file/d/1TPjYT71XHStCNa1UMeRJblVOqjPK4T5G/view?usp=sharing" style="display: block; margin: 20px auto; border-radius: 10px;" alt="Example Image" />
                <p style="color: #777; font-size: 14px; text-align: center;">Best regards,<br>Your Company</p>
                </div>
                `
            };

            transporter.sendMail(mailOptions, function (error, info) {  // nodemailer error handling functtion
                if (error) {
                    console.log(error);
                    res.status(500).json({ error: "Error in sending Link." });
                } else {
                    console.log('Email sent: ' + info.response);
                    res.status(200).json({ message: "Reset Link sent to your registered email id." });
                }
            });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error." });
    }
}

// Reset Pasword Code
exports.resetPasscode = async (req, res) => {
    const { token } = req.params; // getting token form fronted to verify it with DB ,wheather the token is active or expired.
    const { password } = req.body; // taking users new entered password
    try {
        const verifyy = await jsonweb.verify(token, process.env.KEY);  // verifying the token come from frntend with the key we generated it
        const id = verifyy.id;  // if verified then storing users id in id
        const updatepassword = await bcrypt.hash(password, 12); // hasing new password
        const updateDB = await User.findByIdAndUpdate({ _id: id }, { password: updatepassword }) // updating new password by finding user y id which we stored 
        console.log("password updated succesfully."); // success message
        return res.status(200).json({ message: "password updated." })
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "error in updating password." });
    }
}

//Logout User
exports.logoutUser = async (req, res) => { // deleting token generated when user login 
    // res.cookie("fakeapi",token);
    console.log("Logged Out!!");
    res.clearCookie("jwtoken", { path: "/" }); // the path should be same as we set at the time of defining cookie in login route.
    res.status(200).send("User Logout");
}

// Add New Contact Controller
exports.addUser = async (req, res) => { // passing authentication to getting user login info to save the contact in his data only. 
    const useridd = req.rootUser._id;  // getting _id of user who is logged in, to save contact in his data only.
    console.log(useridd);
    console.log("reachable");
    const { name, email, number } = req.body; // destructuring name and file.
    const file = req.file; // taking input file

    console.log("reachable2");
    console.log(req.body);
    console.log(req.file);

    if (!name || !email || !number || !file) {  // checking if empty
        return res.status(400).json({ error: "Empty data fields or no file uploaded." });
    }

    const contact = {   // preparing data to save in db.
        name,
        email,
        number,
        image: file.path
    };

    try {
        const user = await User.findById(useridd); // finding user by authee id
        if (!user) {
            return res.status(404).json({ error: 'User not found.' }); // error if user not found.
        }
        console.log("user found.");

        user.contacts.push({ contact });  // adding data to user
        await user.save();               // saving data
        console.log("saved")
        res.status(200).json({ message: 'Contact added successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error adding contact: ' + error.message });
    }
};

// Delete Contact Controller
// on clicking delete button, delete function executed in which we passed the id of the contact of which the delete request is sent by user.
// in delete function ,we are calling delete methos to backend route and passing the id of which delete icon is clicked.
// in backnd, getting id passed from frntend and user id from authee then niche  
exports.deleteUser = async (req, res) => { // applied  authee to identify user
    const { contactId } = req.params; // 
    const userId = req.rootUser._id;
    console.log(contactId);
    console.log(userId);

    try {
        const user = await User.findById(userId); // checking wheather user is login or not and finding user with  authee id
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Filter out the contact to be deleted
        user.contacts = user.contacts.filter(contact => contact._id.toString() !== contactId); // if user found , then filtering the data by removing fntend id data.
 
        await user.save(); // saving
        res.status(200).json({ message: "Contact deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
}

// sending the contact data wwhich user wants to edit.
// onclicking update button, we called update component and pass the id of the data which user want to edit (also have to tell route in app.js  that something will come with route.)
// now in update using useefect we fetched the data of user contect to update by passing the id .
// in this route we get the id passed by frnted, and using authee finded user and finding contact by id and passing to frntend.
// in fronted we stored the data from bckend and using usestate filled it.
exports.passData = async (req, res) => {

    const id = req.params.id;
    const userId = req.rootUser._id;
    try {
        const finduser = await User.findById(userId);
        if (!finduser) {
            res.send(finduser);
            console.log("user not found.");
            res.status(400).json({ error: "User not found." });
        }
        else {
            console.log("User found.")
            // finduser.contacts = finduser.contacts.find(contact => contact._id.toString() === id);
            const contact = finduser.contacts.find(contact => contact._id.toString() === id);
            if (!contact) {
                console.log("No contact found.")
                res.status(422).json({ error: "No contact found." });
            }
            else {
                console.log("Contact found.")
                res.status(200).json(contact);
            }
        }
    }
    catch (error) {
        console.log(error);
    }
}


// it update the user contact
// once user lcick the update data this route and passed the id which defines unique contact data and getting user id by authee.
exports.updateUser = async (req, res) => {
    console.log("Request Body:");
    console.log(req.body);
    const userId = req.rootUser._id;
    const contactId = req.params.id;
    const { name, email, number } = req.body; // destr. frnt data
    const image = req.file.path;  // destr. frnt data

    try {
        // Find the user
        const user = await User.findById(userId);  // finding user by authee id
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }

        // Find the contact within the user's contacts array
        const contact = user.contacts.id(contactId);     // if user found then  finding contact of user
        if (!contact) {
            return res.status(404).send({ error: 'Contact not found' });
        }
        console.log("contact found");
        console.log(contact);

        // Update the contact fields   if  contact found then update it
        contact.contact.name = name;
        contact.contact.email = email;
        contact.contact.number = number;
        contact.contact.image = image;

        // Save the updated user object
        await user.save();

        console.log("Contact updated successfully");
        res.status(200).send(user); // Sending updated user object as response
    } catch (error) {
        console.error("Error updating contact:", error);
        res.status(500).send({ error: 'Error updating contact' });
    }
}





