const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{
    let filteredUsers = users.filter((user) => user.username === username);
    if(filteredUsers.length == 0)
        return true;
    else
        return false;
}

const authenticatedUser = (username,password)=>{
    let validusers = users.filter((user)=>{
        return (user.username === username && user.password === password)
    });
    return validusers.length > 0;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const {username, password} = req.body;
    if(!username || !password)
    {
        return res.status(404).json({message: "Error logging in"});
    }
    if(!authenticatedUser(username, password))
    {
        return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
    let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 60 });
  
      req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("User successfully logged in");
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  let book = books[isbn];
  if(!book)
  {
      return res.status(404).json({message: "Invalid ISBN"});
  }
  let username = req.session.authorization.username;
  book.reviews[username] = review;
  return res.status(200).json({message: "Review succesfully added"});
});

//Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    let username = req.session.authorization.username;

    let book = books[isbn];
    if(!book)
    {
        return res.status(404).json({message: "Invalid ISBN"});
    }
    delete book.reviews[username];
    return res.status(200).json({message: "Review succesfully deleted"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
