# Shopify Winter 2022 Backend Challenge

## Contents
  - [Get Started](#get-started)
  - [Features](#features)
  - [Workflow](#workflow)
  - [Testing](#testing)


# Get Started

**You will need to set up Docker to run this code!**

To run the code locally, follow the steps below  
1. Run `git clone https://github.com/jaspk06/shopify-back-end-challenge.git`  
2. `cd` into the project repository  
3. Run `docker-compose  -f docker-compose.yml -f docker-compose.dev.yml up -d` to run the development environment on `localhost:8080`
4. Run `docker-compose  -f docker-compose.yml -f docker-compose.prod.yml up -d` to run the production environment which tests, builds then runs the server on `localhost:8080`

# Features

- User registration using name, email, and password
- Login and secure routes with JWT authentication
- Uploading images in bulk or one at a time with autotagging
- Deleted any/all images that the user owns
- Getting any/all images that the user owns

# Workflow

**Import the Postman Collection to access the exact request formats (File->Import)**

1. Users must register through `POST /user/register` using a first name, last name, email and password. This will return a jwt token and corresponding user ID.
2. Users can login through `POST /user/login` using their email and password. This will also return a jwt token and corresponding user ID.

For image uploading functions or account deletion, users must have their jwt token and user id
- To upload images, users can access `POST /images/userId`
- To get any/all images owned by them, users can access `GET /images/userId`
- To delete images owned by them, users can access `DELETE /images/delete/userId`
- To delete all images owned by them, users can access `DELETE /images/deleteAll/userId`
- To delete a user, users can access `DELETE /user/delete`

# Testing
![Test Results](https://i.imgur.com/fXTpCH4.png)

- Mocha and Chai are being used for endpoint unit testing
- Postman is being used to manually test endpoints
