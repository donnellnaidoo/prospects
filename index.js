var express = require("express")
var bodyparser = require("body-parser")
var mongoose = require("mongoose")

const app = express();

app.use(bodyparser.json())
app.use(express.static('public'))
app.use(bodyparser.urlencoded({extended:true}))

mongoose.connect('mongodb://localhost:27017/prospects-users')

var db = mongoose.connection;

db.on('error', ()=>console.log("Error in connecting to database"));
db.once('open', ()=>console.log("Connected to database"))


app.post("/sign_up", (req, res) => {
    console.log(req.body)
    var name = req.body.name;
    var email = req.body.email;
    var acctype = req.body.accountType; // Access the selected account type
    var password = req.body.password;

    

    var data = {
        "name": name,
        "email": email,
        "acctype": acctype,
        "password": password
    }

    
    db.collection('users').insertOne(data, (err, collection) => {
        if (err) {
            console.error("Error inserting record:", err);
            return res.status(500).send("Error inserting record");
        }
        console.log("Record inserted successfully");
        // Redirect or send a response as needed
        res.redirect('/feed/feed.html');
    });
});




app.get("/", (req,res) =>{
    res.set({
        "Allow-access-Allow-Origin": '*'
    })
    return res.redirect('index.html')
}).listen(3000);




console.log("Listening on port 3000")