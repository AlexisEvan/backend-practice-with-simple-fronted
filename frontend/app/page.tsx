"use client";

import { useEffect, useState } from "react";

type TaskItem = {
  id: number;
  title: string;
  isComplete: boolean;
};

const API_URL = "http://localhost:5062/api/todos";

export default function HomePage() {
  const [todos, setTodos] = useState<TaskItem[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [loading, setLoading] = useState(true);

  async function fetchTodos() {
    try {
      setLoading(true);
      const res = await fetch(API_URL, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch todos");
      const data = await res.json();
      setTodos(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTodos();
  }, []);

  async function handleAddTodo() {
    const title = newTitle.trim();
    if (!title) return;

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          isComplete: false,
        }),
      });

      if (!res.ok) throw new Error("Failed to add todo");

      setNewTitle("");
      fetchTodos();
    } catch (error) {
      console.error(error);
    }
  }

  async function handleDeleteTodo(id: number) {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete todo");

      fetchTodos();
    } catch (error) {
      console.error(error);
    }
  }

  function startEditing(todo: TaskItem) {
    setEditingId(todo.id);
    setEditingTitle(todo.title);
  }

  function cancelEditing() {
    setEditingId(null);
    setEditingTitle("");
  }

  async function handleUpdateTodo(todo: TaskItem) {
    const title = editingTitle.trim();
    if (!title) return;

    try {
      const res = await fetch(`${API_URL}/${todo.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: todo.id,
          title,
          isComplete: todo.isComplete,
        }),
      });

      if (!res.ok) throw new Error("Failed to update todo");

      cancelEditing();
      fetchTodos();
    } catch (error) {
      console.error(error);
    }
  }

  async function handleToggleComplete(todo: TaskItem) {
    try {
      const res = await fetch(`${API_URL}/${todo.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: todo.id,
          title: todo.title,
          isComplete: !todo.isComplete,
        }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      fetchTodos();
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
                        alignItems: "center",
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