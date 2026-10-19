import { useEffect, useState } from "react";

function Members() {
  const [members, setMembers] = useState([]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // LOAD MEMBERS
  const fetchMembers = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/members"
      );

      const data = await response.json();

      setMembers(data);
    } catch (error) {
      console.error("Members loading error:", error);
      setMessage("Unable to load members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // FORM CHANGE
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ADD / UPDATE MEMBER
  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = form.name.trim();
    const email = form.email.trim();
    const phone = form.phone.trim();

    if (!name || !email || !phone) {
      setMessage("Please fill all fields");
      return;
    }

    // EMAIL VALIDATION
    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      setMessage("Please enter a valid email address");
      return;
    }

    // PHONE VALIDATION
    const phonePattern = /^[0-9]{10}$/;

    if (!phonePattern.test(phone)) {
      setMessage("Phone number must contain 10 digits");
      return;
    }

    try {
      let response;

      if (editingId) {
        response = await fetch(
          `http://localhost:5000/api/members/${editingId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name,
              email,
              phone,
            }),
          }
        );
      } else {
        response = await fetch(
          "http://localhost:5000/api/members",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name,
              email,
              phone,
            }),
          }
        );
      }

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.error || "Something went wrong"
        );
        return;
      }

      setMessage(
        editingId
          ? "Member updated successfully"
          : "Member added successfully"
      );

      setForm({
        name: "",
        email: "",
        phone: "",
      });

      setEditingId(null);

      fetchMembers();
    } catch (error) {
      console.error(error);
      setMessage("Server connection failed");
    }
  };

  // EDIT
  const handleEdit = (member) => {
    setEditingId(member.id);

    setForm({
      name: member.name || "",
      email: member.email || "",
      phone: member.phone || "",
    });

    setMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // CANCEL EDIT
  const handleCancel = () => {
    setEditingId(null);

    setForm({
      name: "",
      email: "",
      phone: "",
    });

    setMessage("");
  };

  // DELETE
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this member?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/members/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.error || "Delete failed"
        );
        return;
      }

      setMessage("Member deleted successfully");

      fetchMembers();
    } catch (error) {
      console.error(error);
      setMessage("Server connection failed");
    }
  };

  // SEARCH
  const filteredMembers = members.filter(
    (member) => {
      const value = search.toLowerCase();

      return (
        member.name
          ?.toLowerCase()
          .includes(value) ||
        member.email
          ?.toLowerCase()
          .includes(value) ||
        member.phone
          ?.toLowerCase()
          .includes(value)
      );
    }
  );

  return (
    <div className="modern-members-page">

      {/* HEADER */}
      <div className="modern-page-header">
        <div>
          <span className="page-kicker">
            LIBRARY MEMBERS
          </span>

          <h1>Members</h1>

          <p>
            Manage your library members and
            contact details.
          </p>
        </div>

        <div className="page-header-icon">
          👥
        </div>
      </div>

      {/* MESSAGE */}
      {message && (
        <div className="members-message">
          {message}
        </div>
      )}

      {/* MEMBER FORM */}
      <div className="member-editor-card">

        <div className="editor-title">

          <div className="editor-icon">
            {editingId ? "✏️" : "👤"}
          </div>

          <div>
            <h2>
              {editingId
                ? "Edit Member"
                : "Add New Member"}
            </h2>

            <p>
              {editingId
                ? "Update the selected member details."
                : "Enter the details to register a new member."}
            </p>
          </div>

        </div>

        <form
          className="modern-member-form"
          onSubmit={handleSubmit}
        >

          {/* NAME */}
          <div className="modern-input-group">
            <label>Member Name</label>

            <div className="input-wrapper">
              <span>👤</span>

              <input
                type="text"
                name="name"
                placeholder="Enter member name"
                value={form.name}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* EMAIL */}
          <div className="modern-input-group">
            <label>Email Address</label>

            <div className="input-wrapper">
              <span>✉️</span>

              <input
                type="email"
                name="email"
                placeholder="Enter email address"
                value={form.email}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* PHONE */}
          <div className="modern-input-group">
            <label>Phone Number</label>

            <div className="input-wrapper">
              <span>📱</span>

              <input
                type="tel"
                name="phone"
                placeholder="Enter 10 digit phone number"
                value={form.phone}
                onChange={handleChange}
                maxLength="10"
              />
            </div>
          </div>

          {/* BUTTONS */}
          <div className="member-form-actions">

            <button
              type="submit"
              className="primary-member-btn"
            >
              {editingId
                ? "Update Member"
                : "Add Member"}
            </button>

            {editingId && (
              <button
                type="button"
                className="cancel-member-btn"
                onClick={handleCancel}
              >
                Cancel
              </button>
            )}

          </div>

        </form>
      </div>

      {/* MEMBERS COLLECTION */}
      <div className="modern-members-card">

        <div className="members-collection-header">

          <div>
            <span className="section-kicker">
              MEMBER DIRECTORY
            </span>

            <h2>All Members</h2>

            <p>
              {members.length} members registered
            </p>
          </div>

          <div className="modern-search">
            <span>🔎</span>

            <input
              type="text"
              placeholder="Search members..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />
          </div>

        </div>

        {/* LOADING */}
        {loading ? (
          <div className="modern-loading">
            <div className="loading-spinner"></div>

            <p>
              Loading members...
            </p>
          </div>
        ) : filteredMembers.length === 0 ? (
          /* EMPTY */
          <div className="modern-empty-state">
            <div className="empty-icon">
              👥
            </div>

            <h3>
              No members found
            </h3>

            <p>
              Add a member or try another search.
            </p>
          </div>
        ) : (
          /* MEMBER GRID */
          <div className="members-grid">

            {filteredMembers.map(
              (member) => (
                <div
                  className="member-card"
                  key={member.id}
                >

                  <div className="member-card-top">

                    <div className="member-avatar">
                      {member.name
                        ?.charAt(0)
                        .toUpperCase()}
                    </div>

                    <span className="member-id">
                      ID #{member.id}
                    </span>

                  </div>

                  <div className="member-info">

                    <h3>
                      {member.name}
                    </h3>

                    <div className="member-detail">
                      <span>✉️</span>
                      <p>
                        {member.email}
                      </p>
                    </div>

                    <div className="member-detail">
                      <span>📱</span>
                      <p>
                        {member.phone}
                      </p>
                    </div>

                  </div>

                  <div className="member-actions">

                    <button
                      className="member-edit-btn"
                      onClick={() =>
                        handleEdit(member)
                      }
                    >
                      ✏️ Edit
                    </button>

                    <button
                      className="member-delete-btn"
                      onClick={() =>
                        handleDelete(member.id)
                      }
                    >
                      🗑️ Delete
                    </button>

                  </div>

                </div>
              )
            )}

          </div>
        )}

      </div>

    </div>
  );
}

export default Members;