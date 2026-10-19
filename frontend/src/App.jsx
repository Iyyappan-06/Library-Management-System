import { useEffect, useState } from "react";
import "./App.css";

import Books from "./pages/Books";
import Members from "./pages/Members";
import IssueReturn from "./pages/IssueReturn";

function App() {
  const [page, setPage] = useState("dashboard");

  const [stats, setStats] = useState({
    totalBooks: 0,
    totalMembers: 0,
    issuedBooks: 0,
    overdueBooks: 0,
  });

  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/dashboard"
      );

      const data = await response.json();

      if (response.ok) {
        setStats({
          totalBooks: Number(data.totalBooks) || 0,
          totalMembers: Number(data.totalMembers) || 0,
          issuedBooks: Number(data.issuedBooks) || 0,
          overdueBooks: Number(data.overdueBooks) || 0,
        });
      }
    } catch (error) {
      console.error(
        "Dashboard loading error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const openPage = (pageName) => {
    setPage(pageName);
  };

  return (
    <div className="library-app">

      {/* SIDEBAR */}
      <aside className="sidebar">

        <div className="sidebar-brand">

          <div className="brand-icon">
            📚
          </div>

          <div>
            <h2>My Library</h2>
            <span>Management System</span>
          </div>

        </div>

        <div className="sidebar-section">
          <span>MAIN MENU</span>
        </div>

        <nav className="sidebar-nav">

          <button
            className={
              page === "dashboard"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() =>
              setPage("dashboard")
            }
          >
            <span>⌂</span>
            <label>Dashboard</label>
          </button>

          <button
            className={
              page === "books"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() =>
              setPage("books")
            }
          >
            <span>📚</span>
            <label>Books</label>
          </button>

          <button
            className={
              page === "members"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() =>
              setPage("members")
            }
          >
            <span>👥</span>
            <label>Members</label>
          </button>

          <button
            className={
              page === "issue"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() =>
              setPage("issue")
            }
          >
            <span>🔄</span>
            <label>Issue / Return</label>
          </button>

        </nav>

        <div className="sidebar-footer">

          <div className="sidebar-footer-icon">
            ✓
          </div>

          <div>
            <strong>Library System</strong>
            <span>Ready to manage</span>
          </div>

        </div>

      </aside>


      {/* MAIN AREA */}
      <main className="main-content">

        {page === "dashboard" && (

          <div className="dashboard-page">

            {/* HERO */}
            <section className="dashboard-hero">

              <div className="hero-content">

                <span className="hero-kicker">
                  LIBRARY MANAGEMENT
                </span>

                <h1>
                  Manage Your Library
                  <br />
                  <span>Smarter & Faster.</span>
                </h1>

                <p>
                  Keep your books, members and
                  lending activities organized
                  in one simple place.
                </p>

                <div className="hero-actions">

                  <button
                    className="hero-primary-btn"
                    onClick={() =>
                      openPage("books")
                    }
                  >
                    Manage Books
                  </button>

                  <button
                    className="hero-secondary-btn"
                    onClick={() =>
                      openPage("issue")
                    }
                  >
                    Issue a Book
                  </button>

                </div>

              </div>

              <div className="hero-visual">

                <div className="hero-book-card">
                  <div>📖</div>
                  <span>LIBRARY</span>
                </div>

                <div className="floating-book book-one">
                  📚
                </div>

                <div className="floating-book book-two">
                  📘
                </div>

                <div className="floating-book book-three">
                  📕
                </div>

              </div>

            </section>


            {/* STATS */}
            <section className="dashboard-stats">

              <div className="stat-card">

                <div className="stat-icon blue">
                  📚
                </div>

                <div className="stat-info">
                  <span>Total Books</span>

                  <strong>
                    {loading
                      ? "..."
                      : stats.totalBooks}
                  </strong>

                  <small>
                    Books in library
                  </small>
                </div>

              </div>


              <div className="stat-card">

                <div className="stat-icon green">
                  👥
                </div>

                <div className="stat-info">
                  <span>Total Members</span>

                  <strong>
                    {loading
                      ? "..."
                      : stats.totalMembers}
                  </strong>

                  <small>
                    Registered members
                  </small>
                </div>

              </div>


              <div className="stat-card">

                <div className="stat-icon orange">
                  🔄
                </div>

                <div className="stat-info">
                  <span>Issued Books</span>

                  <strong>
                    {loading
                      ? "..."
                      : stats.issuedBooks}
                  </strong>

                  <small>
                    Currently issued
                  </small>
                </div>

              </div>


              <div className="stat-card">

                <div className="stat-icon red">
                  ⚠️
                </div>

                <div className="stat-info">
                  <span>Overdue Books</span>

                  <strong>
                    {loading
                      ? "..."
                      : stats.overdueBooks}
                  </strong>

                  <small>
                    Need attention
                  </small>
                </div>

              </div>

            </section>


            {/* QUICK ACTIONS */}
            <section className="dashboard-section">

              <div className="section-heading">

                <div>
                  <span>
                    QUICK ACCESS
                  </span>

                  <h2>
                    What would you like to do?
                  </h2>
                </div>

              </div>


              <div className="quick-actions">

                <button
                  className="quick-action-card"
                  onClick={() =>
                    openPage("books")
                  }
                >

                  <div className="quick-icon blue">
                    📚
                  </div>

                  <div>
                    <h3>
                      Manage Books
                    </h3>

                    <p>
                      Add, edit, search and
                      remove books.
                    </p>
                  </div>

                  <span className="arrow">
                    →
                  </span>

                </button>


                <button
                  className="quick-action-card"
                  onClick={() =>
                    openPage("members")
                  }
                >

                  <div className="quick-icon green">
                    👥
                  </div>

                  <div>
                    <h3>
                      Manage Members
                    </h3>

                    <p>
                      Register and manage
                      library members.
                    </p>
                  </div>

                  <span className="arrow">
                    →
                  </span>

                </button>


                <button
                  className="quick-action-card"
                  onClick={() =>
                    openPage("issue")
                  }
                >

                  <div className="quick-icon orange">
                    🔄
                  </div>

                  <div>
                    <h3>
                      Issue / Return
                    </h3>

                    <p>
                      Manage book lending
                      and returns.
                    </p>
                  </div>

                  <span className="arrow">
                    →
                  </span>

                </button>

              </div>

            </section>


            {/* OVERVIEW */}
            <section className="dashboard-overview">

              <div className="overview-card">

                <div className="overview-icon">
                  📊
                </div>

                <div>
                  <span>
                    LIBRARY OVERVIEW
                  </span>

                  <h2>
                    Everything in one place
                  </h2>

                  <p>
                    Monitor your collection,
                    members and transactions
                    from a single dashboard.
                  </p>
                </div>

              </div>


              <div className="overview-status">

                <div className="status-dot"></div>

                <div>
                  <strong>
                    System Connected
                  </strong>

                  <span>
                    MySQL database is active
                  </span>
                </div>

              </div>

            </section>

          </div>
        )}


        {page === "books" && (
          <div className="page-transition">
            <Books />
          </div>
        )}


        {page === "members" && (
          <div className="page-transition">
            <Members />
          </div>
        )}


        {page === "issue" && (
          <div className="page-transition">
            <IssueReturn />
          </div>
        )}

      </main>

    </div>
  );
}

export default App;