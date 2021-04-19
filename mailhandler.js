const express = require('express') // Include ExpressJS
const app = express() // Create an ExpressJS app
const bodyParser = require('body-parser'); // Middleware
const  sqlite3 = require('sqlite3').verbose();// Include sqlite3
const nodemailer = require('nodemailer');//Include nodemailer

//Logged user Data
var Username = "";
var PEmail = "";
var SEmail = "";

// Save Registered user data in db
function Register (username,password,primary_email,secondary_email){
    var db = new sqlite3.Database('emailmanager');// Connect db 
    db.serialize(function() {
        db.run("CREATE TABLE IF NOT EXISTS userdata (UID TEXT NOT NULL UNIQUE, PASS TEXT NOT NULL, PEMAIL TEXT NOT NULL, SEMAIL TEXT )",
            (err) => {if(err){console.error(err.message)}});
      
        var stmt = db.prepare("INSERT INTO userdata VALUES (?,?,?,?)");
        
        stmt.run(username,password,primary_email,secondary_email);
        
        stmt.finalize();
      });
    db.close();// Close connection
    return true;
}
//Authenticate User Login
async function Authenticate (username,password){
    var pass = "";
    var db = new sqlite3.Database('emailmanager');// Connect db
    db.serialize(function(){
      db.get("SELECT UID id, PASS pas, PEMAIL pe, SEMAIL se FROM userdata WHERE UID = ? ",username, function(err, row) {
        if(err){
          pass="";
          console.error(err.message);
        }
          pass = row.pas;
          PEmail = row.pe;
          SEmail = row.se;
        
        });
    });
    
    db.close();// Close connection

    if(pass == password){
        Username = username;
        return true;
    }
    else{
        return false;
    }
    
}
//Send Email
function sendmail (sender,password,reciever,sub,msg){
  var sent = false;
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
          console.log(error.message);
        } else {
          sent = true;
        }
      });
      return sent;
}

app.use(bodyParser.urlencoded({ extended: false }));

// Route to Homepage
app.get('/home', (req, res) => {
  res.sendFile(__dirname + '/static/home.html');
});

// Route to Login Page
app.get('/register', (req, res) => {
  res.sendFile(__dirname + '/static/register.html');
});

// Route to Login Page
app.get('/send_email', (req, res) => {
    res.sendFile(__dirname + '/static/send_email.html');
  });

app.post('/home', (req, res) => {

  // Insert Login Code Here
  let username = req.body.uname;
  let password = req.body.pswd;
  if(Authenticate(username,password)){
    res.sendFile(__dirname + '/static/send_email.html');
  }
  else{
    res.sendFile(__dirname + '/static/home.html');
  }
  
});

app.post('/register', (req, res) => {

  let username = req.body.uname;
  let password = req.body.pswd;
  let pemail = req.body.email1;
  let semail = req.body.email2;

  if(Register(username,password,pemail,semail)){
      res.sendFile(__dirname + '/static/home.html');
  }
  else{
    res.sendFile(__dirname + '/static/register.html');
  }
  
});

app.post('/send_email', (req, res) => {
    if(req.body.emailselect == "email1"){
      var sender = PEmail;
    }
    else if(req.body.emailselect == "email2"){
      var sender = SEmail;
    }
    let pass = req.body.gpswd;
    let reciever = req.body.tomail;
    let sub = req.body.subject;
    let msg = req.body.contentemail;
    console.log(sender + pass + reciever + sub + msg)
    if(sendmail(sender,pass,reciever,sub,msg)){
        res.send(`Mail Sent.`);
    }
    else{
        res.send(`Failed to send mail`)
    }
    
  });

const port = 8080 // Port we will listen on

// Function to listen on the port
app.listen(port, () => console.log(`This app is listening on port ${port}`));