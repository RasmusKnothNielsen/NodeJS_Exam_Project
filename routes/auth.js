const router = require('express').Router();
const User = require('../models/User.js');
const Role = require('../models/Role.js');
const fs = require('fs');
const nodemailer = require('nodemailer')
const mailCredentials = require('../config/mailCredentials');
const { v4: uuidv4 } = require('uuid');

// Hashing Passwords
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Dictionary that can contain username and tokens for password reset
// Used in the post /resetpassword route
let resetPasswordDict = {}

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: mailCredentials.user,
      pass: mailCredentials.password
    }
  });

/* Auth Routes*/

// Route for when users try to login
router.post('/login', async (req, res) => {

    const { username, password } = await req.body;

    // Check if user is in db
    const userFound = await User.query().select().where({'username': username}).limit(1);
    if (userFound.length > 0) {

        const validated = await bcrypt.compare(password, userFound[0].password);
        // If the user provided the correct username and password
        if(validated) {
            console.log("User validated")
            // Authentication
            req.session.authenticated = true;
            req.session.username = userFound[0].username;
            req.session.userid = userFound[0].id
            // Add the users UUID, to show that we are logged in with the specific user
            req.session.uuid = userFound[0].uuid;

            return res.redirect('/?status=loggedin');
        }
        // If the user provided the wrong password
        else {
            return res.redirect('/login?error=usernameandpasswordnotmatch')
        }

    }
    // If the user provided a username that does not exist in the DB
    else {
        res.redirect('/login?error=userdoesnotexist');
    }
});

// Route for when users try to signup
router.post('/signup', async (req, res) => {

    const { username, password, passwordRepeat, email } = await req.body;

    const isPasswordTheSame = password === passwordRepeat;
    
    // If the user provided a username, a password and the two passwords are identical.
    if (username && password && isPasswordTheSame) {
        if (password.length < 8) {
            return res.redirect('/login?error=passwordnotok');
        } else {

            try {
                // Check if username exists
                const userFound = await User.query().select().where({'username': username}).limit(1);
                // Do if else check if it exists and give response
                if (userFound.length > 0) {
                    return res.redirect('/login?error=userexists');
                } else {
                    
                    // Get the role number of USER
                    const role = await Role.query().select().where({'role': 'USER'}).limit(1);

                    const hashedPassword = await bcrypt.hash(password, saltRounds);

                    // Create the UUID for the user, that we are going to use as an identifier in our session
                    const uniqueId = uuidv4();
                    

                    // If email is provided
                    if (email != undefined) {
                        const insertedUser = await User.query().insert({
                            username,
                            password: hashedPassword,
                            roleID: role[0].id,  
                            email: email,
                            UUID: uniqueId,
                        });

                        // Send email to to notify that user has been created.t
                        const mailOptions = {
                            from: mailCredentials.user,
                            to: email,
                            subject: 'User created on KeaTube',
                            text: `A user has just been created at KeaTube using this email. If you did not create this user, please notify us!`
                          };
                          
                          transporter.sendMail(mailOptions, function(error, info){
                            if (error) {
                              console.log(error);
                            } else {
                              console.log('Email sent: ' + info.response);
                            }
                          });
                        
                    }
                    // If email is not provided
                    else {
                        const insertedUser = await User.query().insert({
                            username,
                            password: hashedPassword,
                            roleID: role[0].id,  
                            UUID: uniqueId,
                        });
                    }

                    // User successfully signed up
                    return res.status(200).redirect('/login?status=signedup');
                }

            } catch (error) {
                return res.status(500).send({ response : "Something went wrong with the database" + error});
            }
        }
    } else if (password && passwordRepeat && !isPasswordTheSame) { 
        return res.redirect('/login?error=passwordnomatch');
    } else {
        return res.redirect('/login?error=missingfields');
    }
});

// Route for initiating password reset and send email
router.post('/resetpassword', async (req, res) => {
    const { username, email } = req.body;

    // If user is in the db
    const userFound = await User.query().select().where({'username': username}).limit(1);
                
                // If user exists
                if (userFound.length > 0) {
                    
                    // If the mail provided is the one associated with the user
                    if (email != undefined && email == userFound[0].email) {

                        // Define a token for the user to log in with:
                        const userToken = uuidv4();
                        resetPasswordDict[userFound[0].username] = userToken

                        // send mail with defined transport object
                        const mailOptions = {
                            from: mailCredentials.user,
                            to: email,
                            subject: 'KeaTube - Resetting mail',
                            text: `Use the following token to reset your password: ${userToken}\nGo to /passwordReset for further information.`
                          };
                          
                          transporter.sendMail(mailOptions, function(error, info){
                            if (error) {
                              console.log(error);
                            } else {
                              console.log('Email sent: ' + info.response);
                            }
                          });

                        return res.redirect('/login?status=resetmailsent');
                    } 
                    // If the email is wrong
                    else {
                        return res.send({response: "User or email is not correct"});
                    }
                
                // If the user does not exist
                } else {
                    return res.send({response: "User is not in DB"});
                }

});

// Route for resetting password
router.post('/passwordreset', async (req, res) => {

    // Capture the information from the form
    const username = req.body.username;
    const token = req.body.token;
    const password = req.body.password;
    const passwordRepeat = req.body.passwordRepeat;

    // Check if the token is the one saved in the dictionary
    if (resetPasswordDict[username] = token) {

        // If it is, check if password and passwordRepeat match
        if (password != undefined && password == passwordRepeat) {

            // if they do, hash password and save it to the database
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            console.log("New hashed password = ", hashedPassword);
            const userUpdated = await User.query().where('username', '=', username).update({ password: hashedPassword});

            // Remember to remove the entry in our dictionary
            delete resetPasswordDict[username];
            return res.status(200).redirect('/login?status=passwordresetsuccess');
        }
        // Passwords does not match
        else {
            return res.status(401).send({response: "Passwords must match eachother"});
        }
    }
    // User provided an invalid token
    else {
        return res.status(401).send({response: "Invalid token entered"});
    }
});

// Route for when users log out
router.get('/logout', (req, res) => {
    req.session.authenticated = false;
    req.session.user = null;
    req.session.uuid = null;
    return res.status(200).redirect('/?status=loggedout');
});

// Export the route
module.exports = router;