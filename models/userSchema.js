const mongoose = require("mongoose");  // importing mongoose
const bcrypt = require("bcryptjs");    // for hasing and comparing password
const jsonweb = require("jsonwebtoken");  // for generating token on login and forgot passowrd

const userSchema = new mongoose.Schema({   // schema for user info
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    cpassword: {
        type: String,
        required: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    contacts: [{    // contacts data added by user
        contact: {
            name: { type: String, required: true },
            email: { type: String, required: true },
            number: { type: String, required: true },
            image: { type: String, required: true },
        }
    }]
});

// Password Hashing for hashing password before saving
userSchema.pre("save", async function (next) {
    if (this.isModified("password")) { // it mean jb pass chnge ho tb hi ecrypt krna he.
        this.password = await bcrypt.hash(this.password, 12);
        this.cpassword = await bcrypt.hash(this.cpassword, 12);
    }
    next();
});

// Token Generation   generating token on login 
userSchema.methods.generateAuthToken = async function () {
    try {
        let token = jsonweb.sign({ _id: this._id }, process.env.SECRETKEY);
        // ( database tokens = db tokens({ db token:let token }) )
        this.tokens = this.tokens.concat({ token: token });
        await this.save();
        return token;

    }
    catch (err) { console.log(err); }
}

const User = mongoose.model("users", userSchema); // creating a intense to use this schema
module.exports = User; // exporting instence