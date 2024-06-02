const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    //code to check is the username is valid
    const validUsers = users.filter((user)=>{
        return user.username === username;
    })

    if(validUsers.length > 0){
        return true;
    }
    return false;
}

const authenticatedUser = (username,password)=>{ //returns boolean
    //Code to check if username and password match the one we have in records.
    for(let i = 0; i<users.length; i++){
        if(users[i].username===username && users[i].password===password){
            return true;
        }
    }

    return false;
}

// Middleware to parse JSON bodies
regd_users.use(express.json());

// Middleware to parse URL-encoded bodies
regd_users.use(express.urlencoded({ extended: true }));

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const {username, password} = req.body;
    if(!(username && password)){
        return res.status(404).json({message: "Error logging in"});
    }
    if(authenticatedUser(username, password)){
        const accessToken = jwt.sign(
            {data: password},
            "access",
            {expiresIn: 60 * 60}
        );

        req.session.authorization = {
            accessToken,
            username
        };

        return res.status(200).json({message: "User is logged in successfully"});
    }else{
        return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
  
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const book = books[req.params.isbn];
  if(!book){
    return res.status(404).json({message: "Book does not exist"});
  }
  
  book.reviews = {...book.reviews, [req.session.authorization.username]: req.query.review};
  books[req.params.isbn] = book;
  return res.status(200).json(book);
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const book = books[req.params.isbn];
    if(book){
        delete book['reviews'][req.session.authorization.username];
        books[req.params.isbn] = book;
        return res.status(200).json(book);
    }

    return res.status(404).json({message: "Book does not exist"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
