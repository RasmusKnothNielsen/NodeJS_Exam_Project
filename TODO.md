- Get Auth to work                  (DONE)        
- Add sockets at the chatpage       (DONE)
- Add chatpage
    - Maybe find a way to chat with other people that watch the same video?     (DONE)
    - Add a input field in the bottom of the chat page                          (DONE)
    - When users access video page, emit that they join the chat, anon if not logged in     (DONE)
    - When pressing enter or send button, emit to socket                        (DONE)
    - Make sure that chat messages dont keep on going down under the chatwindow, only allowing 22 lines of text (DONE)
    - Implement auto scroll down when new messages is in.                       (DONE)
- Add chatpages for each video                                                  (DONE)
- Let the user join several rooms, by using more panels (faner)                 (DONE)

- Allow users to change name from Anon          (DONE)

- Refactor all listener events to an external file and call it through it

IMPORTANT:
- Implement proper error handling when
    - User tries to comment when not logged in
    - User provides wrong username / password
    - User tries to upload without being logged in

- Make sure that if not logged in users try to go to /upload, they will be rejected

- Make sure that rate limiter is implemented    (DONE)
- Change email text from user creation to reflect KeaTube   (DONE)

- Change how comments are displayed under videos        
    - Implement a way to display the proper user name   (DONE)
    - Truncate the date                                 (DONE)
    - Design: Alterate between two background colors

- Add video info to Database instead of file    (DONE)
- Implement Sweetalert pop ups
    - At upload video
    - At user signup
    - At user login
    - At user logout

- Create tables in database (DONE)
    - Videos        (DONE)
    - Tags          (DONE)
    - Comments      (DONE)
- Add Seeds for videos, tags and comments   (DONE)

- Change DB table Videos, to reflect that they are linked to specific user  (DONE)
    - New Migration file    (DONE)

- Change where the video info comes from, from json object to database  (DONE)
    - Reading videos from Database  (DONE)
    - Saving videos to database     (DONE)
    - Reading comments              (DONE)
    - Saving comments               (DONE)
    - Reading tags                  (DONE)
    - Saving tags                   (DONE)

    - Implement that only logged in users can
        - Upload video              (DONE)
        - Comment video             (DONE)
    
    - Implement that only the user/admin who uploaded the video, can delete it

- Remove like and dislike buttons?                  (DONE)

Change the name of the thumbnails to not just include the .png

Try to implement AJAX on chat site, so that we can add comments without reloading the page.     (MAYBY DONE?)


- Add login page                        (DONE)
- Connect login page to rest of design
- Add signup page                       (DONE)
- Connect signup page to rest of design
- Add resetpassword page                (DONE)
- connect resetpassword page with rest of design

- Add AJAX / Fetch to a site        (DONE)  Added it at upload video, for random video naming.

- Consider to remove "SEARCH" and CATEGORIES from frontpage
- Consider to show the correct buttons in upper right corner, so that
    - If user not logged in, only display "login"
    - If user is logged in, show "Upload Video" and "Logout"

- Clean up pages
    - Make sure to use '' instead og ""
    - Remove comments and printouts that are not necesary
    - Make sure that there is enough comments where it needs to be



AWS

- Create instance       (DONE)
- Login with SSH        (DONE)

Install
- Mysql database        (DONE)
- Git                   (DONE)
- NodeJS                (DONE)
- NPM                   (DONE)
- Express?              (DONE)
- Nodemon               (DONE)
- ffmpeg                (DONE)
- PM2                   (DONE)
- Git Clone Repo        (DONE)


- Set up PM, to auto start app and mysql server at restart/crash


Double Check HARD REQUIREMENTS:  
Backend  
- Express       (DONE)
- Database      (DONE)
- ORM / ODM     (DONE)

Frontend  
- Plain HTML    (DONE)
- AJAX / Fetch
- Sockets       (DONE)

SOFT REQUIREMENTS:  
- Clean Codebase
- Style website
- Host Application on AWS or the like       (DONE)


How to build db
> $ npm run buildDB

How to reset db
- npm run migrate:rollback
- npm run migrate:latest
- npm run seed:run

Or just
> $ npm run cleanDB


AWS MySQL Server
You can start the MySQL daemon with:
cd /usr ; /usr/libexec/mysql55/mysqld_safe &

## Nice links:

### MySQL Install
https://medium.com/@chamikakasun/installing-mysql-in-an-ec2-instance-55d6a3e19caf

### Dev tools, nodeJS and PM2
https://medium.com/monstar-lab-bangladesh-engineering/deploying-node-js-apps-in-amazon-linux-with-pm2-7fc3ef5897bb


What i did to make it work
- Removed CURRENT_TIMESTAMP from migrations
- Changed each Model to be static get tableName() etc
- Installed tensorflow 


More problems in regard of online hosting
- Time in chat seems to be two hours behind