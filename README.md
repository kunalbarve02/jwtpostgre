# User authentication using JWT

# Steps to run the app
1. Clone the repository using this command
  ```bash
   git clone https://github.com/kunalbarve02/jwtpostgre.git
  ```
2. Run the following command to install dependencies 
  ```bash
   npm i
  ```
3. If all dependencies are installed successfully run this command to start the app
  ```bash
   npm start
  ```
4. If you see this output in console 
  ```bash
   app listening on port 8000
   connected to DB!!
  ```
  then app is up and running.

  
5. Run the following command to run tests.
  ```bash
   npm run test
  ```
** If using any other operating system than windows, please change the syntax of setting environment variables in scripts section of package.json

PostgreSQL database is hosted at - postgres://root:YdJkFQBM9VsaHvVtwW0dWYxPM5hctcHL@dpg-ciojrslph6elhbvi0iig-a.singapore-postgres.render.com/users_gq0d

Postman collection - https://www.postman.com/avionics-geologist-11393109/workspace/public/collection/27284879-dc4e7a36-312c-430f-bf63-30b79afadaeb?action=share&creator=27284879

# Steps for using Postman Collection
1. Create an user with register request
2. Then signin to obtain JWT Token and user-id
3. Everytime a user logs in or registering click on Users collection go to variables and replace token value with current token and hit save

Postman documentation - https://documenter.getpostman.com/view/27284879/2s946fdXmc
