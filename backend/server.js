require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();

app.use(cors());
app.use(express.json());

// DATABASE CONNECTION
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("MySQL connection failed:", err.message);
    return;
  }

  console.log("MySQL database connected successfully!");
});

// HOME
app.get("/", (req, res) => {
  res.json({
    message: "Library Management Backend is running",
  });
});

// ==================== BOOKS ====================

// GET BOOKS
app.get("/api/books", (req, res) => {
  db.query("SELECT * FROM books ORDER BY id DESC", (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json(results);
  });
});

// ADD BOOK
app.post("/api/books", (req, res) => {
  const { title, author, category } = req.body;

  if (!title || !author || !category) {
    return res.status(400).json({
      error: "All fields are required",
    });
  }

  db.query(
    `INSERT INTO books (title, author, category, status)
     VALUES (?, ?, ?, 'Available')`,
    [title, author, category],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.status(201).json({
        message: "Book added successfully",
        id: result.insertId,
      });
    }
  );
});

// UPDATE BOOK
app.put("/api/books/:id", (req, res) => {
  const { id } = req.params;
  const { title, author, category, status } = req.body;

  if (!title || !author || !category) {
    return res.status(400).json({
      error: "All fields are required",
    });
  }

  db.query(
    `UPDATE books
     SET title = ?, author = ?, category = ?, status = ?
     WHERE id = ?`,
    [title, author, category, status || "Available", id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Book not found" });
      }

      res.json({ message: "Book updated successfully" });
    }
  );
});

// DELETE BOOK
app.delete("/api/books/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM books WHERE id = ?", [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.json({ message: "Book deleted successfully" });
  });
});

// ==================== MEMBERS ====================

// GET MEMBERS
app.get("/api/members", (req, res) => {
  db.query("SELECT * FROM members ORDER BY id DESC", (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json(results);
  });
});

// ADD MEMBER
app.post("/api/members", (req, res) => {
  const { name, email, phone } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({
      error: "All fields are required",
    });
  }

  db.query(
    `INSERT INTO members (name, email, phone)
     VALUES (?, ?, ?)`,
    [name, email, phone],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.status(201).json({
        message: "Member added successfully",
        id: result.insertId,
      });
    }
  );
});

// UPDATE MEMBER
app.put("/api/members/:id", (req, res) => {
  const { id } = req.params;
  const { name, email, phone } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({
      error: "All fields are required",
    });
  }

  db.query(
    `UPDATE members
     SET name = ?, email = ?, phone = ?
     WHERE id = ?`,
    [name, email, phone, id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Member not found" });
      }

      res.json({ message: "Member updated successfully" });
    }
  );
});

// DELETE MEMBER
app.delete("/api/members/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM members WHERE id = ?", [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Member not found" });
    }

    res.json({ message: "Member deleted successfully" });
  });
});

// ==================== ISSUE RECORDS ====================

// GET ISSUE RECORDS
app.get("/api/issues", (req, res) => {
  db.query(
    "SELECT * FROM issue_records ORDER BY id DESC",
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.json(results);
    }
  );
});

// ISSUE BOOK
app.post("/api/issues", (req, res) => {
  const { book, member, issueDate, dueDate } = req.body;

  if (!book || !member || !issueDate || !dueDate) {
    return res.status(400).json({
      error: "All fields are required",
    });
  }

  if (dueDate < issueDate) {
    return res.status(400).json({
      error: "Due date cannot be before issue date",
    });
  }

  db.query(
    "SELECT id, status FROM books WHERE title = ?",
    [book],
    (err, bookResult) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (bookResult.length === 0) {
        return res.status(404).json({ error: "Book not found" });
      }

      if (bookResult[0].status === "Issued") {
        return res.status(400).json({
          error: "This book is already issued",
        });
      }

      const bookId = bookResult[0].id;

      db.query(
        `INSERT INTO issue_records
         (book, member, issue_date, due_date, status)
         VALUES (?, ?, ?, ?, 'Issued')`,
        [book, member, issueDate, dueDate],
        (err, result) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }

          db.query(
            "UPDATE books SET status = 'Issued' WHERE id = ?",
            [bookId],
            (err) => {
              if (err) {
                return res.status(500).json({ error: err.message });
              }

              res.status(201).json({
                message: "Book issued successfully",
                id: result.insertId,
              });
            }
          );
        }
      );
    }
  );
});

// RETURN BOOK
app.put("/api/issues/:id/return", (req, res) => {
  const { id } = req.params;

  db.query(
    "SELECT book, status FROM issue_records WHERE id = ?",
    [id],
    (err, issueResult) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (issueResult.length === 0) {
        return res.status(404).json({ error: "Record not found" });
      }

      if (issueResult[0].status === "Returned") {
        return res.status(400).json({
          error: "This book has already been returned",
        });
      }

      const bookTitle = issueResult[0].book;

      db.query(
        "UPDATE issue_records SET status = 'Returned' WHERE id = ?",
        [id],
        (err) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }

          db.query(
            "UPDATE books SET status = 'Available' WHERE title = ?",
            [bookTitle],
            (err) => {
              if (err) {
                return res.status(500).json({ error: err.message });
              }

              res.json({ message: "Book returned successfully" });
            }
          );
        }
      );
    }
  );
});

// ==================== DASHBOARD ====================

app.get("/api/dashboard", (req, res) => {
  const queries = [
    "SELECT COUNT(*) AS count FROM books",
    "SELECT COUNT(*) AS count FROM members",
    "SELECT COUNT(*) AS count FROM issue_records WHERE status = 'Issued'",
    `SELECT COUNT(*) AS count
     FROM issue_records
     WHERE status = 'Issued' AND due_date < CURDATE()`,
  ];

  const results = {};

  db.query(queries[0], (err, booksResult) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    results.totalBooks = booksResult[0].count;

    db.query(queries[1], (err, membersResult) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      results.totalMembers = membersResult[0].count;

      db.query(queries[2], (err, issuedResult) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        results.issuedBooks = issuedResult[0].count;

        db.query(queries[3], (err, overdueResult) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }

          results.overdueBooks = overdueResult[0].count;

          res.json(results);
        });
      });
    });
  });
});

// ==================== START SERVER ====================

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});