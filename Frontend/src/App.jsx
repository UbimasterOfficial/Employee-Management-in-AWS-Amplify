import { useEffect, useMemo, useState } from "react";
import {
  createEmployee,
  deleteEmployee,
  getEmployeeById,
  getEmployees,
  updateEmployee,
} from "./api";

const emptyForm = { name: "", email: "", age: "" };

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

function getAvatarHue(name = "") {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % 360;
}

function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function App() {
  const [employees, setEmployees] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const selectedEmployee = useMemo(
    () => employees.find((employee) => employee._id === selectedId),
    [employees, selectedId]
  );

  const filteredEmployees = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return employees;
    return employees.filter(
      (employee) =>
        employee.name?.toLowerCase().includes(query) ||
        employee.email?.toLowerCase().includes(query)
    );
  }, [employees, search]);

  const averageAge = useMemo(() => {
    const withAge = employees.filter((e) => typeof e.age === "number");
    if (!withAge.length) return null;
    const total = withAge.reduce((sum, e) => sum + e.age, 0);
    return Math.round(total / withAge.length);
  }, [employees]);

  async function fetchEmployees() {
    setLoading(true);
    setError("");
    try {
      const data = await getEmployees();
      setEmployees(data);
      if (data.length && !selectedId) {
        setSelectedId(data[0]._id);
      } else if (!data.length) {
        setSelectedId("");
      } else if (selectedId && !data.some((item) => item._id === selectedId)) {
        setSelectedId(data[0]?._id || "");
      }
    } catch (fetchError) {
      setError(fetchError.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(timer);
  }, [toast]);

  function showToast(message, type = "success") {
    setToast({ message, type });
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId("");
  }

  function onFormChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function validateForm() {
    if (!form.name.trim()) return "Name is required";
    if (!form.email.trim()) return "Email is required";
    if (form.age !== "" && Number(form.age) < 0) return "Age cannot be negative";
    return "";
  }

  async function onSubmit(event) {
    event.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      age: form.age === "" ? undefined : Number(form.age),
    };

    setSaving(true);
    setError("");

    try {
      if (editingId) {
        const updated = await updateEmployee(editingId, payload);
        setEmployees((prev) => prev.map((emp) => (emp._id === editingId ? updated : emp)));
        setSelectedId(updated._id);
        showToast(`${updated.name} has been updated.`);
      } else {
        const created = await createEmployee(payload);
        setEmployees((prev) => [created, ...prev]);
        setSelectedId(created._id);
        showToast(`${created.name} has been added to the team.`);
      }
      resetForm();
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  }

  async function onEdit(id) {
    setError("");
    try {
      const employee = await getEmployeeById(id);
      setEditingId(employee._id);
      setSelectedId(employee._id);
      setForm({
        name: employee.name || "",
        email: employee.email || "",
        age: employee.age ?? "",
      });
      document.getElementById("employee-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (getError) {
      setError(getError.message);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setError("");
    try {
      await deleteEmployee(deleteTarget.id);
      const nextEmployees = employees.filter((employee) => employee._id !== deleteTarget.id);
      setEmployees(nextEmployees);
      if (selectedId === deleteTarget.id) {
        setSelectedId(nextEmployees[0]?._id || "");
      }
      if (editingId === deleteTarget.id) {
        resetForm();
      }
      showToast(`${deleteTarget.name} has been removed.`, "info");
      setDeleteTarget(null);
    } catch (deleteError) {
      setError(deleteError.message);
      setDeleteTarget(null);
    }
  }

  return (
    <div className="app">
      <div className="bg-glow bg-glow--1" aria-hidden="true" />
      <div className="bg-glow bg-glow--2" aria-hidden="true" />

      {toast ? (
        <div className={`toast toast--${toast.type}`} role="status">
          <span className="toast__icon">{toast.type === "success" ? "✓" : "ℹ"}</span>
          {toast.message}
        </div>
      ) : null}

      {deleteTarget ? (
        <div className="modal-backdrop" onClick={() => setDeleteTarget(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <div className="modal__icon">⚠</div>
            <h3>Delete employee?</h3>
            <p>
              You are about to remove <strong>{deleteTarget.name}</strong>. This action cannot be
              undone.
            </p>
            <div className="modal__actions">
              <button className="btn btn--ghost" type="button" onClick={() => setDeleteTarget(null)}>
                Cancel
              </button>
              <button className="btn btn--danger" type="button" onClick={confirmDelete}>
                Delete Employee
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <header className="topbar">
        <div className="brand">
          <div className="brand__logo">EO</div>
          <div>
            <p className="brand__eyebrow">Workforce Management</p>
            <h1 className="brand__title">EmployeeOne</h1>
          </div>
        </div>
        <button className="btn btn--outline" onClick={fetchEmployees} disabled={loading} type="button">
          <span className={`refresh-icon${loading ? " refresh-icon--spin" : ""}`}>↻</span>
          {loading ? "Syncing…" : "Refresh Data"}
        </button>
      </header>

      <section className="stats">
        <article className="stat-card stat-card--primary">
          <span className="stat-card__label">Total Employees</span>
          <strong className="stat-card__value">{employees.length}</strong>
        </article>
        <article className="stat-card stat-card--accent">
          <span className="stat-card__label">Average Age</span>
          <strong className="stat-card__value">{averageAge ?? "—"}</strong>
        </article>
        <article className="stat-card stat-card--violet">
          <span className="stat-card__label">Search Results</span>
          <strong className="stat-card__value">{filteredEmployees.length}</strong>
        </article>
      </section>

      {error ? (
        <div className="alert alert--error" role="alert">
          <span>!</span> {error}
        </div>
      ) : null}

      <div className="layout">
        <aside className="panel panel--form" id="employee-form">
          <div className="panel__header">
            <h2>{editingId ? "Edit Employee" : "Add New Employee"}</h2>
            <p>{editingId ? "Update the selected record below." : "Fill in the details to onboard a team member."}</p>
          </div>

          <form onSubmit={onSubmit} className="form">
            <div className="field">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                name="name"
                value={form.name}
                onChange={onFormChange}
                placeholder="e.g. Alex Johnson"
                autoComplete="name"
              />
            </div>

            <div className="field">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                name="email"
                value={form.email}
                onChange={onFormChange}
                placeholder="e.g. alex@company.com"
                autoComplete="email"
              />
            </div>

            <div className="field">
              <label htmlFor="age">Age</label>
              <input
                id="age"
                type="number"
                name="age"
                min="0"
                value={form.age}
                onChange={onFormChange}
                placeholder="Optional"
              />
            </div>

            <div className="form__actions">
              <button className="btn btn--primary" type="submit" disabled={saving}>
                {saving ? "Saving…" : editingId ? "Save Changes" : "Add Employee"}
              </button>
              {editingId ? (
                <button className="btn btn--ghost" type="button" onClick={resetForm}>
                  Cancel
                </button>
              ) : null}
            </div>
          </form>

          <div className="detail-card">
            <h3>Selected Profile</h3>
            {selectedEmployee ? (
              <div className="profile">
                <div
                  className="avatar avatar--lg"
                  style={{ "--hue": getAvatarHue(selectedEmployee.name) }}
                >
                  {getInitials(selectedEmployee.name)}
                </div>
                <div className="profile__info">
                  <p className="profile__name">{selectedEmployee.name}</p>
                  <p className="profile__email">{selectedEmployee.email}</p>
                  <div className="profile__meta">
                    <span>Age: {selectedEmployee.age ?? "N/A"}</span>
                    <span>Joined: {formatDate(selectedEmployee.createdAt)}</span>
                    <span>Updated: {formatDate(selectedEmployee.updatedAt)}</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="empty-hint">Select an employee from the directory to view their profile.</p>
            )}
          </div>
        </aside>

        <main className="panel panel--list">
          <div className="panel__header panel__header--row">
            <div>
              <h2>Employee Directory</h2>
              <p>Search, view, edit, or remove team members.</p>
            </div>
            <div className="search">
              <span className="search__icon">⌕</span>
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or email…"
                aria-label="Search employees"
              />
            </div>
          </div>

          {loading && !employees.length ? (
            <div className="skeleton-list">
              {[1, 2, 3].map((item) => (
                <div key={item} className="skeleton-row" />
              ))}
            </div>
          ) : !filteredEmployees.length ? (
            <div className="empty-state">
              <div className="empty-state__icon">👥</div>
              <h3>{search ? "No matches found" : "No employees yet"}</h3>
              <p>
                {search
                  ? "Try a different search term."
                  : "Add your first employee using the form on the left."}
              </p>
            </div>
          ) : (
            <div className="table-wrap">
              <table className="employee-table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Email</th>
                    <th>Age</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map((employee) => {
                    const isSelected = selectedId === employee._id;
                    const isEditing = editingId === employee._id;
                    return (
                      <tr
                        key={employee._id}
                        className={[
                          isSelected ? "is-selected" : "",
                          isEditing ? "is-editing" : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                        onClick={() => setSelectedId(employee._id)}
                      >
                        <td>
                          <div className="employee-cell">
                            <div
                              className="avatar"
                              style={{ "--hue": getAvatarHue(employee.name) }}
                            >
                              {getInitials(employee.name)}
                            </div>
                            <div>
                              <span className="employee-cell__name">{employee.name}</span>
                              {isEditing ? <span className="badge">Editing</span> : null}
                            </div>
                          </div>
                        </td>
                        <td className="email-cell">{employee.email}</td>
                        <td>{employee.age ?? "—"}</td>
                        <td>
                          <div className="row-actions" onClick={(e) => e.stopPropagation()}>
                            <button
                              className="icon-btn icon-btn--edit"
                              type="button"
                              title="Edit"
                              onClick={() => onEdit(employee._id)}
                            >
                              ✎
                            </button>
                            <button
                              className="icon-btn icon-btn--delete"
                              type="button"
                              title="Delete"
                              onClick={() =>
                                setDeleteTarget({ id: employee._id, name: employee.name })
                              }
                            >
                              ✕
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>

      <footer className="footer">
        Built with React + Node.js + MongoDB · Full-stack CRUD Employee Management
      </footer>
    </div>
  );
}
