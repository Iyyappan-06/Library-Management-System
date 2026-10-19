import { useEffect, useState } from "react";

function IssueReturn() {
  const [records, setRecords] = useState([]);
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);

  const [form, setForm] = useState({
    book: "",
    member: "",
    issueDate: "",
    dueDate: "",
  });

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // LOAD ALL DATA
  const loadData = async () => {
    try {
      setLoading(true);

      const [issueResponse, bookResponse, memberResponse] =
        await Promise.all([
          fetch("http://localhost:5000/api/issues"),
          fetch("http://localhost:5000/api/books"),
          fetch("http://localhost:5000/api/members"),
        ]);

      const issueData = await issueResponse.json();
      const bookData = await bookResponse.json();
      const memberData = await memberResponse.json();

      setRecords(issueData);
      setBooks(bookData);
      setMembers(memberData);
    } catch (error) {
      console.error("Issue data loading error:", error);
      setMessage("Unable to load issue records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // FORM CHANGE
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ISSUE BOOK
  const handleIssue = async (e) => {
    e.preventDefault();

    if (
      !form.book ||
      !form.member ||
      !form.issueDate ||
      !form.dueDate
    ) {
      setMessage("Please fill all fields");
      return;
    }

    if (form.dueDate < form.issueDate) {
      setMessage(
        "Due date cannot be before issue date"
      );
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/issues",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.error || "Unable to issue book"
        );
        return;
      }

      setMessage("Book issued successfully");

      setForm({
        book: "",
        member: "",
        issueDate: "",
        dueDate: "",
      });

      loadData();
    } catch (error) {
      console.error(error);
      setMessage("Server connection failed");
    }
  };

  // RETURN BOOK
  const handleReturn = async (id) => {
    const confirmReturn = window.confirm(
      "Are you sure you want to return this book?"
    );

    if (!confirmReturn) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/issues/${id}/return`,
        {
          method: "PUT",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.error || "Unable to return book"
        );
        return;
      }

      setMessage("Book returned successfully");

      loadData();
    } catch (error) {
      console.error(error);
      setMessage("Server connection failed");
    }
  };

  // SEARCH
  const filteredRecords = records.filter((record) => {
    const value = search.toLowerCase();

    return (
      record.book?.toLowerCase().includes(value) ||
      record.member?.toLowerCase().includes(value) ||
      record.status?.toLowerCase().includes(value)
    );
  });

  // OVERDUE CHECK
  const isOverdue = (record) => {
    if (record.status !== "Issued") {
      return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dueDate = new Date(record.due_date);
    dueDate.setHours(0, 0, 0, 0);

    return dueDate < today;
  };

  return (
    <div className="modern-issue-page">

      {/* HEADER */}
      <div className="modern-page-header">

        <div>
          <span className="page-kicker">
            LIBRARY TRANSACTIONS
          </span>

          <h1>Issue & Return</h1>

          <p>
            Manage book lending and return
            transactions.
          </p>
        </div>

        <div className="page-header-icon">
          🔄
        </div>

      </div>

      {/* MESSAGE */}
      {message && (
        <div className="issue-message">
          {message}
        </div>
      )}

      {/* ISSUE FORM */}
      <div className="issue-editor-card">

        <div className="editor-title">

          <div className="editor-icon">
            📚
          </div>

          <div>
            <h2>Issue a Book</h2>

            <p>
              Select a book and member to create
              a lending record.
            </p>
          </div>

        </div>

        <form
          className="modern-issue-form"
          onSubmit={handleIssue}
        >

          {/* BOOK */}
          <div className="modern-input-group">

            <label>Book</label>

            <div className="input-wrapper">
              <span>📖</span>

              <select
                name="book"
                value={form.book}
                onChange={handleChange}
              >
                <option value="">
                  Select a book
                </option>

                {books
                  .filter(
                    (book) =>
                      book.status !== "Issued"
                  )
                  .map((book) => (
                    <option
                      key={book.id}
                      value={book.title}
                    >
                      {book.title}
                    </option>
                  ))}
              </select>
            </div>

          </div>

          {/* MEMBER */}
          <div className="modern-input-group">

            <label>Member</label>

            <div className="input-wrapper">
              <span>👤</span>

              <select
                name="member"
                value={form.member}
                onChange={handleChange}
              >
                <option value="">
                  Select a member
                </option>

                {members.map((member) => (
                  <option
                    key={member.id}
                    value={member.name}
                  >
                    {member.name}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* ISSUE DATE */}
          <div className="modern-input-group">

            <label>Issue Date</label>

            <div className="input-wrapper">
              <span>📅</span>

              <input
                type="date"
                name="issueDate"
                value={form.issueDate}
                onChange={handleChange}
              />
            </div>

          </div>

          {/* DUE DATE */}
          <div className="modern-input-group">

            <label>Due Date</label>

            <div className="input-wrapper">
              <span>📅</span>

              <input
                type="date"
                name="dueDate"
                value={form.dueDate}
                onChange={handleChange}
              />
            </div>

          </div>

          <div className="issue-form-actions">

            <button
              type="submit"
              className="primary-issue-btn"
            >
              Issue Book
            </button>

          </div>

        </form>
      </div>

      {/* TRANSACTION LIST */}
      <div className="modern-transactions-card">

        <div className="transactions-header">

          <div>
            <span className="section-kicker">
              TRANSACTION HISTORY
            </span>

            <h2>Issue Records</h2>

            <p>
              {records.length} transaction
              {records.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="modern-search">
            <span>🔎</span>

            <input
              type="text"
              placeholder="Search transactions..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />
          </div>

        </div>

        {loading ? (
          <div className="modern-loading">

            <div className="loading-spinner"></div>

            <p>
              Loading transactions...
            </p>

          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="modern-empty-state">

            <div className="empty-icon">
              📋
            </div>

            <h3>
              No transactions found
            </h3>

            <p>
              Issue a book to create a transaction.
            </p>

          </div>
        ) : (
          <div className="transactions-list">

            {filteredRecords.map((record) => {

              const overdue = isOverdue(record);

              return (
                <div
                  className="transaction-card"
                  key={record.id}
                >

                  {/* LEFT */}
                  <div className="transaction-book">

                    <div className="transaction-icon">
                      📖
                    </div>

                    <div>
                      <h3>
                        {record.book}
                      </h3>

                      <p>
                        Borrowed by{" "}
                        <strong>
                          {record.member}
                        </strong>
                      </p>
                    </div>

                  </div>

                  {/* DATES */}
                  <div className="transaction-dates">

                    <div>
                      <span>
                        Issue Date
                      </span>

                      <strong>
                        {record.issue_date}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Due Date
                      </span>

                      <strong
                        className={
                          overdue
                            ? "overdue-date"
                            : ""
                        }
                      >
                        {record.due_date}
                      </strong>
                    </div>

                  </div>

                  {/* STATUS */}
                  <div className="transaction-status">

                    {overdue ? (
                      <span className="transaction-badge overdue">
                        Overdue
                      </span>
                    ) : (
                      <span
                        className={`transaction-badge ${
                          record.status === "Returned"
                            ? "returned"
                            : "issued"
                        }`}
                      >
                        {record.status}
                      </span>
                    )}

                  </div>

                  {/* ACTION */}
                  <div className="transaction-action">

                    {record.status === "Issued" && (
                      <button
                        className="return-book-btn"
                        onClick={() =>
                          handleReturn(record.id)
                        }
                      >
                        ↩ Return
                      </button>
                    )}

                    {record.status === "Returned" && (
                      <span className="returned-text">
                        ✓ Completed
                      </span>
                    )}

                  </div>

                </div>
              );
            })}

          </div>
        )}

      </div>

    </div>
  );
}

export default IssueReturn;