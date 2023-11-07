const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    let {username, password} = req.body;
    if(!username || !password)
    {
        return res.status(404).json({message: "Unable to register user. username or password missing"});
    }
    if(!isValid(username))
    {
        return res.status(404).json({message: "Unable to register user. User already exists"});
    }
    users.push({
        "username": username,
        "password": password
    });
    return res.status(200).json({message: "User successfully registered. Now you can login"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    let getBooks = new Promise((resolve, reject) => {
        resolve(res.send(JSON.stringify(books, null, 4)));
    });
    getBooks.then(() => console.log("Get books promise resolved"));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    let getBookByIsbn = new Promise((resolve, reject) => {
        resolve(res.send(books[isbn]));
    });
    getBookByIsbn.then(() => console.log("Get books by ISBN promise resolved"));
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  let getBooksByAuthor = new Promise((resolve, reject) => {
    let bookDetails = Object.values(books);
    let filteredBooks = bookDetails.filter((book) => book.author === author);
    resolve(res.send(JSON.stringify(filteredBooks, null, 4)));
  });
  getBooksByAuthor.then(() => console.log("Get books by author Promise resolved"));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    let getBooksByTitle = new Promise((resolve, reject) => {
        let bookDetails = Object.values(books);
        let filteredBooks = bookDetails.filter((book) => book.title === title);
        resolve(res.send(JSON.stringify(filteredBooks, null, 4)));
    });
    getBooksByTitle.then(() => console.log("Get books by title Promise resolved"));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    let book = books[isbn];
    if(book)
    {
        res.send(book.reviews);
    }
    else
        res.send("Invalid ISBN");
});

module.exports.general = public_users;
