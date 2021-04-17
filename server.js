const express = require('express') // Include ExpressJS
const app = express() // Create an ExpressJS app
const bodyParser = require('body-parser'); // Middleware

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