"use client";

import { useEffect, useState } from "react";

type Label = {
  id: number;
  name: string;
  description?: string | null;
  color: string;
};

type TaskItem = {
  id: number;
  title: string;
  isComplete: boolean;
  labelId?: number | null;
  label?: Label | null;
};

const TODOS_API_URL = "http://localhost:5062/api/todos";
const LABELS_API_URL = "http://localhost:5062/api/labels";

export default function HomePage() {
  const [todos, setTodos] = useState<TaskItem[]>([]);
  const [labels, setLabels] = useState<Label[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newLabelId, setNewLabelId] = useState<string>("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingLabelId, setEditingLabelId] = useState<string>("");
  const [loading, setLoading] = useState(true);

  async function fetchTodos() {
    const res = await fetch(TODOS_API_URL, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch todos");
    const data = await res.json();
    setTodos(data);
  }

  async function fetchLabels() {
    const res = await fetch(LABELS_API_URL, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch labels");
    const data = await res.json();
    setLabels(data);
  }

  async function refreshData() {
    try {
      setLoading(true);
      await Promise.all([fetchTodos(), fetchLabels()]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function loadInitialData() {
      try {
        setLoading(true);
        await Promise.all([fetchTodos(), fetchLabels()]);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadInitialData();
  }, []);

  async function handleAddTodo() {
    const title = newTitle.trim();
    if (!title) return;

    try {
      const res = await fetch(TODOS_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          isComplete: false,
          labelId: newLabelId ? Number(newLabelId) : null,
        }),
      });

      if (!res.ok) throw new Error("Failed to add todo");

      setNewTitle("");
      setNewLabelId("");
      refreshData();
    } catch (error) {
      console.error(error);
    }
  }

  async function handleDeleteTodo(id: number) {
    try {
      const res = await fetch(`${TODOS_API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete todo");

      refreshData();
    } catch (error) {
      console.error(error);
    }
  }

  function startEditing(todo: TaskItem) {
    setEditingId(todo.id);
    setEditingTitle(todo.title);
    setEditingLabelId(todo.labelId ? String(todo.labelId) : "");
  }

  function cancelEditing() {
    setEditingId(null);
    setEditingTitle("");
    setEditingLabelId("");
  }

  async function handleUpdateTodo(todo: TaskItem) {
    const title = editingTitle.trim();
    if (!title) return;

    try {
      const res = await fetch(`${TODOS_API_URL}/${todo.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: todo.id,
          title,
          isComplete: todo.isComplete,
          labelId: editingLabelId ? Number(editingLabelId) : null,
        }),
      });

      if (!res.ok) throw new Error("Failed to update todo");

      cancelEditing();
      refreshData();
    } catch (error) {
      console.error(error);
    }
  }

  async function handleToggleComplete(todo: TaskItem) {
    try {
      const res = await fetch(`${TODOS_API_URL}/${todo.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: todo.id,
          title: todo.title,
          isComplete: !todo.isComplete,
          labelId: todo.labelId ?? null,
        }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      refreshData();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Arial, sans-serif",
        padding: "24px",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: "760px",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "48px",
            fontWeight: 700,
            marginBottom: "24px",
          }}
        >
          Todo List
        </h1>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "12px",
            justifyContent: "center",
            marginBottom: "32px",
          }}
        >
          <input
            type="text"
            placeholder="Add a new todo"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            style={{
              width: "320px",
              padding: "12px 16px",
              fontSize: "18px",
              borderRadius: "10px",
              border: "1px solid #ccc",
            }}
          />
          <select
            value={newLabelId}
            onChange={(e) => setNewLabelId(e.target.value)}
            style={{
              padding: "12px 16px",
              fontSize: "18px",
              borderRadius: "10px",
              border: "1px solid #ccc",
              backgroundColor: "#fff",
            }}
          >
            <option value="">No label</option>
            {labels.map((label) => (
              <option key={label.id} value={label.id}>
                {label.name}
              </option>
            ))}
          </select>
          <button
            onClick={handleAddTodo}
            style={{
              padding: "12px 18px",
              fontSize: "18px",
              borderRadius: "10px",
              border: "none",
              cursor: "pointer",
            }}
          >
            Add
          </button>
        </div>

        {loading ? (
          <p style={{ fontSize: "20px" }}>Loading...</p>
        ) : todos.length === 0 ? (
          <p style={{ fontSize: "20px" }}>No todos found.</p>
        ) : (
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
            }}
          >
            {todos.map((todo) => (
              <li
                key={todo.id}
                style={{
                  marginBottom: "20px",
                  padding: "18px 20px",
                  border: "1px solid #e5e5e5",
                  borderRadius: "14px",
                }}
              >
                {editingId === todo.id ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                      alignItems: "center",
                    }}
                  >
                    <input
                      type="text"
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      style={{
                        width: "300px",
                        padding: "10px 14px",
                        fontSize: "18px",
                        borderRadius: "10px",
                        border: "1px solid #ccc",
                      }}
                    />
                    <select
                      value={editingLabelId}
                      onChange={(e) => setEditingLabelId(e.target.value)}
                      style={{
                        width: "300px",
                        padding: "10px 14px",
                        fontSize: "18px",
                        borderRadius: "10px",
                        border: "1px solid #ccc",
                        backgroundColor: "#fff",
                      }}
                    >
                      <option value="">No label</option>
                      {labels.map((label) => (
                        <option key={label.id} value={label.id}>
                          {label.name}
                        </option>
                      ))}
                    </select>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <button onClick={() => handleUpdateTodo(todo)}>Save</button>
                      <button onClick={cancelEditing}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "16px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "12px",
                        textAlign: "left",
                        flex: 1,
                      }}
                    >
                      <button
                        onClick={() => handleToggleComplete(todo)}
                        style={{
                          border: "none",
                          background: "transparent",
                          cursor: "pointer",
                          fontSize: "24px",
                        }}
                        title="Toggle complete"
                      >
                        {todo.isComplete ? "✓" : "✗"}
                      </button>

                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "28px",
                            fontWeight: 700,
                            textDecoration: todo.isComplete ? "line-through" : "none",
                            opacity: todo.isComplete ? 0.7 : 1,
                          }}
                        >
                          {todo.title}
                        </span>

                        {todo.label && (
                          <span
                            style={{
                              alignSelf: "flex-start",
                              padding: "4px 10px",
                              borderRadius: "999px",
                              backgroundColor: todo.label.color,
                              color: "#fff",
                              fontSize: "14px",
                              fontWeight: 600,
                            }}
                          >
                            {todo.label.name}
                          </span>
                        )}
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: "10px" }}>
                      <button onClick={() => startEditing(todo)}>Edit</button>
                      <button onClick={() => handleDeleteTodo(todo.id)}>Delete</button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
