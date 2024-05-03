// var express = require("express")
// // var bodyparser = require("body-parser")
// var mongoose = require("mongoose")

// // let name = document.getElementById('name').value;
// // console.log(name);

// const app = express();

// // app.use(bodyparser.json())
// app.use(express.static('public'))
// // app.use(bodyparser.urlencoded({extended:true}))
// const bodyParser = require("body-parser");

// // Add this line to your Express setup
// app.use(bodyParser.urlencoded({ extended: true }));

// mongoose.connect('mongodb://localhost:27017/prospects-users')

// var db = mongoose.connection;

// db.on('error', ()=>console.log("Error in connecting to database"));
// db.once('open', ()=>console.log("Connected to database"))


// // app.post("/sign_up", (req, res) => {
// //     console.log(req.body)
// //     var name = req.body.name;
// //     var email = req.body.email;
// //     var acctype = req.body.accountType; // Access the selected account type
// //     var password = req.body.password;


// //     var data = {
// //         "name": name,
// //         "email": email,
// //         "acctype": acctype,
// //         "password": password
// //     }

    
// //     db.collection('users').insertOne(data, (err, collection) => {
// //         if (err) {
// //             console.error("Error inserting record:", err);
// //             return res.status(500).send("Error inserting record");
// //         }
// //         console.log("Record inserted successfully");
// //         // Redirect or send a response as needed
// //         res.redirect('/feed/feed.html');
// //     });
// // });

// const passwordValidator = require('password-validator');

// // Create a password schema
// const schema = new passwordValidator();
// schema
//   .is().min(8)                                    // Minimum length 8
//   .is().max(100)                                  // Maximum length 100
//   .has().uppercase()                              // Must have uppercase letters
//   .has().lowercase()                              // Must have lowercase letters
//   .has().digits()                                 // Must have digits
//   .has().not().spaces();                          // Should not have spaces

// app.post("/sign_up", (req, res) => {
//     const { name, email, accountType, password } = req.body;

//     // Check if any field is missing
//     if (!name || !email || !accountType || !password) {
//         return res.status(400).send("All fields are required.");
//     }

//     // Check password strength
//     if (!schema.validate(password)) {
//         return res.status(400).send("Password is too weak. It must contain at least 8 characters including uppercase, lowercase, digits, and no spaces.");
//     }

//     var data = {
//         "name": name,
//         "email": email,
//         "accountType": accountType,
//         "password": password
//     }

//     db.collection('users').insertOne(data, (err, collection) => {
//         if (err) {
//             console.error("Error inserting record:", err);
//             return res.status(500).send("Error inserting record");
//         }
//         console.log("Record inserted successfully");
//         // Redirect or send a response as needed
//         res.redirect('/feed/feed.html');
//     });
// });


// app.post('/login', async (req, res) => {
//     const { email, password } = req.body;
//     console.log(req.body);

//     try {
//         const user = await User.findOne({ email });

//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         // Compare the passwords directly
//         if (user.password !== password) {
//             return res.status(401).json({ message: 'Invalid password' });
//         }

//         // Password is valid, you can generate JWT token here and send it back to the client
//         res.redirect('/feed/feed.html');
//     } catch (error) {
//         console.error('Error during login:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// });




// app.get("/", (req,res) =>{
//     res.set({
//         "Allow-access-Allow-Origin": '*'
//     })
//     return res.redirect('index.html')
// }).listen(3000);

// console.log("Listening on port 3000")



/////////////////////
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passwordValidator = require('password-validator');


const app = express();
const PORT = 3000;

// Middleware
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Database connection
mongoose.connect('mongodb://localhost:27017/prospects-users', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', () => console.log("Error in connecting to database"));
db.once('open', () => console.log("Connected to database"));

// User model
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    accountType: String,
    password: String
});

const User = mongoose.model('User', userSchema);

// Password schema
const schema = new passwordValidator();
schema
  .is().min(8)                                    // Minimum length 8
  .is().max(100)                                  // Maximum length 100
  .has().uppercase()                              // Must have uppercase letters
  .has().lowercase()                              // Must have lowercase letters
  .has().digits()                                 // Must have digits
  .has().not().spaces();                          // Should not have spaces

// Sign up route
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Define the destination folder for uploaded files

app.post("/sign_up", upload.single('profile_picture'), (req, res) => {
    const { name, email, accountType, password } = req.body;

    // Check if any field is missing
    if (!name || !email || !accountType || !password) {
        return res.send('<script>alert("All fields are required."); window.history.back();</script>');
    }

    // Check password strength
    if (!schema.validate(password)) {
        return res.send('<script>alert("Password is too weak. It must contain at least 8 characters including uppercase, lowercase, digits, and no spaces."); window.history.back();</script>');
    }

    // Retrieve the path of the uploaded file
    const profilePicturePath = req.file ? req.file.filename : null; // Use req.file.filename to get the filename

    const data = {
        name,
        email,
        accountType,
        password,
        profilePicturePath // Add profile picture path to data
    };

    console.log("Data before creating user:", data);

    User.create(data)
        .then(user => {
            console.log("Record inserted successfully");
            console.log("User:", user);
            res.redirect(`/feed/feed.html?name=${encodeURIComponent(name)}&profilePicturePath=${encodeURIComponent(profilePicturePath)}`);
        })
        .catch(err => {
            console.error("Error inserting record:", err);
            return res.send('<script>alert("Error inserting record"); window.history.back();</script>');
        });
});


// Login route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.send('<script>alert("User not found"); window.history.back();</script>');
        }

        // Compare passwords directly (assuming plaintext passwords for demonstration)
        if (user.password !== password) {
            return res.send('<script>alert("Invalid password"); window.history.back();</script>');
        }

        // Password is valid, redirect to dashboard with user's name and profile picture path
        res.redirect(`/feed/feed.html?name=${encodeURIComponent(user.name)}&profilePicturePath=${encodeURIComponent(user.profilePicturePath)}`);

    } catch (error) {
        console.error('Error during login:', error);
        return res.send('<script>alert("Internal server error"); window.history.back();</script>');
    }
});


// Default route
app.get("/", (req,res) =>{
    res.set({
        "Allow-access-Allow-Origin": '*'
    })
    return res.redirect('index.html')
});

// Start the server
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
