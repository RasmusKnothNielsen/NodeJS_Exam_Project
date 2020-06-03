# Exam Project, NodeJS

## What is this?

Repo containing work done with the NodeJS Exam Project done at Computer Science, KEA

## How to run this?



## FAQ

Here is a list of known issues and how to fix them:

### Error: ER_NOT_SUPPORTED_AUTH_MODE

Client does not support authentication protocol requested by server; consider upgrading MySQL client

Fix:
Go to MySQL and enters the following
> $ ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password'  
Remember to change out your own password  
> $ flush privileges;

Try to connect again.

This works because we switch away from the caching_sha2_password feature, that was implemented in MySQL 8.0 but not yet supported by NodeJS
