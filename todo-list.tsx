"use client"

import type React from "react"

import { useState, useEffect } from "react"
import "./todo-list.css"

interface Todo {
  id: number
  text: string
  completed: boolean
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState("")

  // Load todos from localStorage on initial render
  useEffect(() => {
    const storedTodos = localStorage.getItem("todos")
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos))
    }
  }, [])

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos))
  }, [todos])

  // Add a new todo
  const addTodo = (e: React.FormEvent) => {
    e.preventDefault()
    if (newTodo.trim() === "") return

    const todo: Todo = {
      id: Date.now(),
      text: newTodo,
      completed: false,
    }

    setTodos([...todos, todo])
    setNewTodo("")
  }

  // Toggle todo completion status
  const toggleTodo = (id: number) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)))
  }

  // Delete a todo
  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  // Count remaining todos
  const remainingTodos = todos.filter((todo) => !todo.completed).length

  return (
    <div className="todo-container">
      <div className="todo-app">
        <header className="todo-header">
          <h1>Todo List</h1>
        </header>

        <div className="todo-content">
          <form onSubmit={addTodo} className="todo-form">
            <input
              type="text"
              placeholder="Add a new task..."
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              className="todo-input"
            />
            <button type="submit" className="todo-add-btn">
              Add
            </button>
          </form>

          <div className="todo-list">
            {todos.length === 0 ? (
              <p className="todo-empty-message">No tasks yet. Add one above!</p>
            ) : (
              <>
                {todos.map((todo) => (
                  <div key={todo.id} className="todo-item">
                    <div className="todo-item-left">
                      <label className="todo-checkbox-container">
                        <input
                          type="checkbox"
                          checked={todo.completed}
                          onChange={() => toggleTodo(todo.id)}
                          className="todo-checkbox"
                        />
                        <span className="todo-checkmark"></span>
                      </label>
                      <span className={`todo-text ${todo.completed ? "todo-completed" : ""}`}>{todo.text}</span>
                    </div>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="todo-delete-btn"
                      aria-label="Delete task"
                    >
                      <svg viewBox="0 0 24 24" width="16" height="16">
                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                      </svg>
                    </button>
                  </div>
                ))}
                <div className="todo-footer">
                  <p className="todo-count">
                    {remainingTodos} {remainingTodos === 1 ? "task" : "tasks"} remaining
                  </p>
                  {todos.length > 0 && remainingTodos !== todos.length && (
                    <button onClick={() => setTodos(todos.filter((todo) => !todo.completed))} className="todo-clear-btn">
                      Clear completed
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
