const express = require('express') // Include ExpressJS
const app = express() // Create an ExpressJS app
const bodyParser = require('body-parser'); // Middleware
const  sqlite3 = require('sqlite3').verbose();// Include sqlite3
var nodemailer = require('nodemailer');//Include nodemailer

// Save Registered user data in db
function Register (username,password,primary_email,secondary_email){
    var db = new sqlite3.Database('emailmanager');// Connect db 
    db.serialize(function() {
        db.run("CREATE TABLE IF NOT EXISTS user_data (UID TEXT NOT NULL UNIQUE, PASS TEXTNOT NULL, PEMAIL TEXT NOT NULL, SEMAIL TEXT )",
            (err) => {if(err){console.error(err.message)}});
      
        var stmt = db.prepare("INSERT INTO user_data VALUES (?,?,?,?)");
        
        stmt.run(username,password,primary_email,secondary_email);
        
        stmt.finalize();

      });
    db.close();// Close connection
    return true;
}
//Authenticate User Login
function Authenticate (username,password){
    var pass = "";
    var db = new sqlite3.Database('emailmanager');// Connect db
    db.run("SELECT PASS FROM user_data WHERE UID = ?",username, function(err, row) {
            pass = row.PASS;
        });
    db.close();// Close connection
    if(pass = password){
        return true;
    }
    return false;
}
//Send Email
function sendmail (sender,password,reciever,sub,msg){
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: sender,
          pass: password
        }
      });
      
      var mailOptions = {
        from: sender,
        to: reciever,
        subject: sub,
        text: msg
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
}

app.use(bodyParser.urlencoded({ extended: false }));

// Route to Homepage
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/static/index.html');
});

// Route to Login Page
app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/static/login.html');
});

app.post('/login', (req, res) => {
  // Username & Password for Validation
  var usn = "Mango";
  var pas = "Fruit"; 
  // Insert Login Code Here
  let username = req.body.username;
  let password = req.body.password;
  if(username==usn && password==pas){
    res.send(`Welcome ${username} !`);
  }
  else{
    res.send(`Wrong Data Entered. Username: ${username} Password: ${password}`);
  }
  
});

const port = 8080 // Port we will listen on

// Function to listen on the port
app.listen(port, () => console.log(`This app is listening on port ${port}`));