- Get Auth to work                  (DONE)        
- Add sockets at the chatpage
- Add chatpage
    - Maybe find a way to chat with other people that watch the same video?     (DONE)
    - Add a input field in the bottom of the chat page                          (DONE)
    - When users access video page, emit that they join the chat, anon if not logged in
    - When pressing enter or send button, emit to socket
    - Make sure that chat messages dont keep on going down under the chatwindow, only allowing 22 lines of text
- Add chatpages for each video
- Let the user join several rooms, by using more panels (faner)
- Refactor all listener events to an external file and call it through it

- Make sure that rate limiter is implemented    (DONE)

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

- Change where the video info comes from, from json object to database
    - Reading videos from Database  (DONE)
    - Saving videos to database     (DONE)
    - Reading comments              (DONE)
    - Saving comments               (DONE)
    - Reading tags                  (DONE)
    - Saving tags                   (DONE)

    - Implement that only logged in users can
        - Upload video              (DONE)
        - Comment video             (DONE)
    
    - Implement that only the user who uploaded the video, can delete it

- Remove like and dislike buttons?

Change the name of the thumbnails to not just include the .png

Try to implement AJAX on player site, so that we can add comments without reloading the page.


- Add login page                        (DONE)
- Connect login page to rest of design
- Add signup page                       (DONE)
- Connect signup page to rest of design
- Add resetpassword page                (DONE)
- connect resetpassword page with rest of design


AWS

Install
- Git
- NodeJS
- NPM
- Express?
- Nodemon
- ffmpeg
- Mysql database

Double Check HARD REQUIREMENTS:  
Backend  
- Express       (DONE)
- Database      (DONE)
- ORM / ODM     (DONE)

Frontend  
- Plain HTML
- AJAX / Fetch
- Sockets

SOFT REQUIREMENTS:  
- Clean Codebase
- Style website
- Host Application on AWS or the like


How to build db
> $ npm run buildDB

How to reset db
- npm run migrate:rollback
- npm run migrate:latest
- npm run seed:run

Or just
> $ npm run cleanDB