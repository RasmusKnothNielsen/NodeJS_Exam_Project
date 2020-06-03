- Get Auth to work
- Add sockets at the chatpage
- Add chatpage
    - Maybe find a way to chat with other people that watch the same video?

- Make sure that rate limiter is implemented

- Add video info to Database instead of file    (DONE)
- Implement Sweetalert pop ups
- Create tables in database (DONE)
    - Videos        (DONE)
    - Tags          (DONE)
    - Comments      (DONE)
- Add Seeds for videos, tags and comments   (DONE)

- Change where the video info comes from, from json object to database
    - Reading videos from Database
    - Saving videos to database
    - Reading comments
    - Saving tags
    - Reading tags
    - Saving tags

- Add login page                        (DONE)
- Connect login page to rest of design
- Add signup page                       (DONE)
- Connect signup page to rest of design
- Add resetpassword page                (DONE)
- connect resetpassword page with rest of design

Double Check HARD REQUIREMENTS:  
Backend  
- Express
- Database
- ORM / ODM

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