import { useEffect, useState } from "react";

function Books() {
  const [books, setBooks] = useState([]);

  const [form, setForm] = useState({
    title: "",
    author: "",
    category: "",
  });

  const [editingId, setEditingId] = useState(null);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  const [message, setMessage] = useState("");

  // =========================
  // LOAD BOOKS
  // =========================

  const fetchBooks = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/books"
      );

      const data = await response.json();

      setBooks(data);
    } catch (error) {
      console.error("Books loading error:", error);
      setMessage("Unable to load books");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);


  // =========================
  // FORM CHANGE
  // =========================

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };


  // =========================
  // ADD / UPDATE BOOK
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.title.trim() ||
      !form.author.trim() ||
      !form.category.trim()
    ) {
      setMessage("Please fill all fields");
      return;
    }

    try {
      let response;

      if (editingId) {
        response = await fetch(
          `http://localhost:5000/api/books/${editingId}`,
          {
            method: "PUT",

            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify({
              ...form,
              status: "Available",
            }),
          }
        );
      } else {
        response = await fetch(
          "http://localhost:5000/api/books",
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify(form),
          }
        );
      }

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Something went wrong");
        return;
      }

      setMessage(
        editingId
          ? "Book updated successfully"
          : "Book added successfully"
      );

      setForm({
        title: "",
        author: "",
        category: "",
      });

      setEditingId(null);

      fetchBooks();
    } catch (error) {
      console.error(error);

      setMessage("Server connection failed");
    }
  };


  // =========================
  // EDIT
  // =========================

  const handleEdit = (book) => {
    setEditingId(book.id);

    setForm({
      title: book.title || "",
      author: book.author || "",
      category: book.category || "",
    });

    setMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  // =========================
  // CANCEL EDIT
  // =========================

  const handleCancel = () => {
    setEditingId(null);

    setForm({
      title: "",
      author: "",
      category: "",
    });

    setMessage("");
  };


  // =========================
  // DELETE
  // =========================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this book?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/books/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Delete failed");
        return;
      }

      setMessage("Book deleted successfully");

      fetchBooks();
    } catch (error) {
      console.error(error);

      setMessage("Server connection failed");
    }
  };


  // =========================
  // SEARCH
  // =========================

  const filteredBooks = books.filter((book) => {
    const value = search.toLowerCase();

    return (
      book.title?.toLowerCase().includes(value) ||
      book.author?.toLowerCase().includes(value) ||
      book.category?.toLowerCase().includes(value)
    );
  });


  // =========================
  // PAGE
  // =========================

  return (
    <div className="modern-books-page">

      {/* =========================
          PAGE HEADER
      ========================= */}

      <div className="modern-page-header">

        <div>
          <span className="page-kicker">
            LIBRARY COLLECTION
          </span>

          <h1>
            Books
          </h1>

          <p>
            Manage and organize your library books.
          </p>
        </div>

        <div className="page-header-icon">
          📚
        </div>

      </div>


      {/* =========================
          MESSAGE
      ========================= */}

      {message && (
        <div className="books-message">
          {message}
        </div>
      )}


      {/* =========================
          ADD / EDIT BOOK
      ========================= */}

      <div className="book-editor-card">

        <div className="editor-title">

          <div className="editor-icon">
            {editingId ? "✏️" : "➕"}
          </div>

          <div>

            <h2>
              {editingId
                ? "Edit Book"
                : "Add New Book"}
            </h2>

            <p>
              {editingId
                ? "Update the selected book details."
                : "Enter the details to add a new book."}
            </p>

          </div>

        </div>


        <form
          className="modern-book-form"
          onSubmit={handleSubmit}
        >

          {/* TITLE */}

          <div className="modern-input-group">

            <label>
              Book Title
            </label>

            <div className="input-wrapper">

              <span>📖</span>

              <input
                type="text"
                name="title"
                placeholder="Enter book title"
                value={form.title}
                onChange={handleChange}
              />

            </div>

          </div>


          {/* AUTHOR */}

          <div className="modern-input-group">

            <label>
              Author
            </label>

            <div className="input-wrapper">

              <span>✍️</span>

              <input
                type="text"
                name="author"
                placeholder="Enter author name"
                value={form.author}
                onChange={handleChange}
              />

            </div>

          </div>


          {/* CATEGORY */}

          <div className="modern-input-group">

            <label>
              Category
            </label>

            <div className="input-wrapper">

              <span>🏷️</span>

              <input
                type="text"
                name="category"
                placeholder="e.g. Science"
                value={form.category}
                onChange={handleChange}
              />

            </div>

          </div>


          {/* BUTTONS */}

          <div className="book-form-actions">

            <button
              type="submit"
              className="primary-book-btn"
            >
              {editingId
                ? "Update Book"
                : "Add Book"}
            </button>


            {editingId && (
              <button
                type="button"
                className="cancel-book-btn"
                onClick={handleCancel}
              >
                Cancel
              </button>
            )}

          </div>

        </form>

      </div>


      {/* =========================
          BOOK COLLECTION
      ========================= */}

      <div className="modern-collection-card">

        <div className="collection-header">

          <div>

            <span className="section-kicker">
              COLLECTION
            </span>

            <h2>
              All Books
            </h2>

            <p>
              {books.length} books in your library
            </p>

          </div>


          {/* SEARCH */}

          <div className="modern-search">

            <span>
              🔎
            </span>

            <input
              type="text"
              placeholder="Search books..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

        </div>


        {/* =========================
            LOADING
        ========================= */}

        {loading ? (

          <div className="modern-loading">

            <div className="loading-spinner"></div>

            <p>
              Loading books...
            </p>

          </div>

        ) : filteredBooks.length === 0 ? (

          /* =========================
             EMPTY
          ========================= */

          <div className="modern-empty-state">

            <div className="empty-icon">
              📚
            </div>

            <h3>
              No books found
            </h3>

            <p>
              Add a book or try another search.
            </p>

          </div>

        ) : (

          /* =========================
             BOOK GRID
          ========================= */

          <div className="books-grid">

            {filteredBooks.map((book) => (

              <div
                className="book-card"
                key={book.id}
              >

                <div className="book-card-top">

                  <div className="book-cover">
                    📖
                  </div>


                  <span
                    className={
                      book.status === "Issued"
                        ? "book-status issued"
                        : "book-status available"
                    }
                  >
                    {book.status || "Available"}
                  </span>

                </div>


                <div className="book-info">

                  <span className="book-category">
                    {book.category}
                  </span>

                  <h3>
                    {book.title}
                  </h3>

                  <p>
                    by {book.author}
                  </p>

                </div>


                <div className="book-actions">

                  <button
                    className="book-edit-btn"
                    onClick={() =>
                      handleEdit(book)
                    }
                  >
                    ✏️ Edit
                  </button>


                  <button
                    className="book-delete-btn"
                    onClick={() =>
                      handleDelete(book.id)
                    }
                  >
                    🗑️ Delete
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}

export default Books;