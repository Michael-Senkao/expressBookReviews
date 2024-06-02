const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const userExists = (username) =>{
    validUsers = users.filter((user) =>{
        return user.username === username;
    });

    if(validUsers.length > 0){
        return true;
    }
    return false;
};

// Middleware to parse JSON bodies
public_users.use(express.json());

// Middleware to parse URL-encoded bodies
public_users.use(express.urlencoded({ extended: true }));

public_users.post("/register", (req,res) => {
  //Write your code here
  const {username, password} = req.body;
  if(userExists(username)){
    return res.status(403).json({message: "Username already exists."});
  }
  const user = {
    "username": username,
    "password": password,
  }
  users.push(user);
  return res.status(200).json({message: "User Registration Successful!"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const book = books[req.params.isbn];
  if(!book){
    return res.status(404).json({message: `There's no book with isbn number ${req.params.isbn}`})
  }
  return res.status(300).json(book);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  for(key in books){
    if(books[key].author === req.params.author){
        return res.status(300).json(books[key]);
    }
  }
  return res.status(404).json({message: `There's no book with author name ${req.params.author}`})
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  for(key in books){
    if(books[key].title === req.params.title){
        return res.status(300).json(books[key]);
    }
  }
  return res.status(404).json({message: `There's no book with title ${req.params.title}`})
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const book = books[req.params.isbn];
  if(book){
    return res.status(300).json(book.reviews);
  }
  return res.status(404).json({message: `There's no book with isbn number ${req.params.isbn}`})
});

module.exports.general = public_users;
