var express = require('express');
var app = express();
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const {promisify} = require('util');
const {OAuth2Client} = require('google-auth-library');
const gmail = google.gmail('v1');
const readFileAsync = promisify(fs.readFile);
const gmailGetMessagesAsync = promisify(gmail.users.messages.get);
const gmailListMessagesAsync = promisify(gmail.users.messages.list);


// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/gmail.modify'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

// Load client secrets from a local file.
fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Gmail API.
  authorize(JSON.parse(content), listLabels);
  authorize(JSON.parse(content), getRecentEmail);

});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

function listLabels(auth) {
  const gmail = google.gmail({version: 'v1', auth});
  gmail.users.labels.list({
    userId: 'me',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const labels = res.data.labels;
    if (labels.length) {
      console.log('Labels:');
      labels.forEach((label) => {
        console.log(`- ${label.name}`);
      });
    } else {
      console.log('No labels found.');
    }
  });
}




/**
 * Get the recent email from your Gmail account
 *
 * @param {google.auth.OAuth2} oauth2Client An authorized OAuth2 client.
 * @param {String} query String used to filter the Messages listed.
 */
  function getRecentEmail(auth) {
    // Only get the recent email - 'maxResults' parameter
    gmail.users.messages.list({auth: auth, userId: 'me',}, function(err, response) {
        if (err) {
            console.log('The API returned an error: ' + err);
            return;
        }
      
      // Get the message id which we will need to retreive tha actual message next.
      var i;
      for (i = 20; i >0 ; i--) {
  var message_id = response['data']['messages'][i]['id'];
   gmail.users.messages.get({auth: auth, userId: 'me', 'id': message_id}, function(err, response) {
          if (err) {
              console.log('The API returned an error: ' + err);
              return;
          }
         
         //console.log(response['data']);
         //message_raw = response['data']['snippet'].body.data;
message_raw = response.data.snippet;
raw_string=message_raw.toString();

message_head = response.data.payload.headers[7].value;
head_string=message_head.toString();
const users = require("./mails");

fs.readFile("mails.json", function(err, data) {
      
    // Check for errors
    if (err) throw err;
   
    // Converting to JSON
    //const mails = JSON.parse(data);
      
    //`console.log(mails); // Print users 
});

   
// Defining new user
let mail = {
    sender: head_string,
    email: raw_string,
    
};
   
// STEP 2: Adding new data to users object
 users.push(mail);
   
// STEP 3: Writing to a file
fs.writeFile("static/mails.json", JSON.stringify(users), err => {
     
    // Checking for errors
    if (err) throw err; 
   
    console.log("Done writing"); // Success
});

/*data = message_head;  
buff = new Buffer(data, 'base64');  
text = buff.toString();*/
console.log(message_head);
console.log(message_raw);


//buff = new Buffer(data, 'base64');  
      });
} 
      

      
     
    });
  

}

app.listen(3000);