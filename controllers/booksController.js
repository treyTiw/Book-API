function booksController(Book) {
  function post(req, res) {
    const book = new Book(req.body);
    // Custom check for title remains for consistency with existing logic.
    if (!req.body.title) {
      res.status(400);
      return res.send('Title is required');
    }
    book.save((err) => {
      if (err) {
        if (err.name === 'ValidationError') {
          // Handle Mongoose validation errors, e.g., for genre maxlength
          return res.status(400).send(err.message);
        }
        return res.status(500).send(err);
      }
      res.status(201);
      return res.json(book);
    });
  }

  function get(req, res) {
    const query = {};
    if (req.query.genre) {
      query.genre = req.query.genre;
    }
    Book.find(query, (err, books) => {
      if (err) return res.send(err);
      const returnBooks = books.map((book) => {
        const newBook = book.toJSON();
        newBook.links = {};
        newBook.links.self = `http://${req.headers.host}/api/books/${book._id}`;
        return newBook;
      });
      return res.json(returnBooks);
    });
  }

  function put(req, res) {
    const { bookId } = req.params; // Assuming bookId is passed in URL params
    Book.findById(bookId, (err, book) => {
      if (err) {
        return res.status(500).send(err);
      }
      if (!book) {
        return res.status(404).send('Book not found');
      }

      // Update fields from request body, allowing genre to be optional or cleared
      // For PUT, typically all fields are expected, but here we allow partial update capability for convenience.
      book.title = req.body.title !== undefined ? req.body.title : book.title;
      book.author = req.body.author !== undefined ? req.body.author : book.author;
      book.genre = req.body.genre !== undefined ? req.body.genre : book.genre;
      book.read = req.body.read !== undefined ? req.body.read : book.read;

      book.save((saveErr) => {
        if (saveErr) {
          if (saveErr.name === 'ValidationError') {
            // Handle Mongoose validation errors, e.g., for genre maxlength
            return res.status(400).send(saveErr.message);
          }
          return res.status(500).send(saveErr);
        }
        return res.json(book);
      });
    });
  }

  return { post, get, put }; // Export the new put function
}

module.exports = booksController;