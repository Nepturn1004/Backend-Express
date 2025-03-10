const express = require('express');
let books = require('./booksdb.js');
let isValid = require('./auth_users.js').isValid;
let users = require('./auth_users.js').users;
const public_users = express.Router();

public_users.post('/register', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: 'Username and password are required' });
  }

  if (users.find((user) => user.username === username)) {
    return res.status(409).json({ message: 'Username already exists' });
  }

  users.push({ username: username, password: password });
  return res
    .status(200)
    .json({ message: 'User successfully registered. Now you can login' });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  res.json(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.json(JSON.stringify(books[isbn], null, 4));
  } else {
    res.status(404).json({ message: 'Book not found' });
  }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const booksByAuthor = Object.values(books).filter(
    (book) => book.author === author
  );
  if (booksByAuthor.length > 0) {
    res.json(JSON.stringify(booksByAuthor, null, 4));
  } else {
    res.status(404).json({ message: 'No books found for this author' });
  }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const booksByTitle = Object.values(books).filter(
    (book) => book.title === title
  );
  if (booksByTitle.length > 0) {
    res.json(JSON.stringify(booksByTitle, null, 4));
  } else {
    res.status(404).json({ message: 'No books found with this title' });
  }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn] && books[isbn].reviews) {
    res.json(JSON.stringify(books[isbn].reviews, null, 4));
  } else {
    res.status(404).json({ message: 'No reviews found for this book' });
  }
});

module.exports.general = public_users;
