import { useState, useEffect } from 'react'
import axios from 'axios'
import { FiPlus, FiX, FiTrash2, FiCalendar, FiCheck } from 'react-icons/fi'
import { BiListCheck } from 'react-icons/bi'
import { MdLightMode, MdDarkMode } from 'react-icons/md'
import './App.css'

function App() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [priority, setPriority] = useState('Medium')

  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark')
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetchTasks()
    localStorage.setItem('theme', theme)
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/tasks/')
      setTasks(response.data)
      setLoading(false)
    } catch (err) {
      console.log('Error:', err)
      setLoading(false)
    }
  }

  const handleCreateTask = async (e) => {
    e.preventDefault()

    if (!title.trim() || !description.trim() || !dueDate.trim()) {
      alert('Please fill in all fields')
      return
    }

    try {
      const newTask = {
        title: title.trim(),
        description: description.trim(),
        due_date: dueDate + 'T00:00:00Z',
        priority: priority,
        is_completed: false
      }

      await axios.post('http://127.0.0.1:8000/api/tasks/create/', newTask)

      setTitle('')
      setDescription('')
      setDueDate('')
      setPriority('Medium')
      setShowForm(false)

      fetchTasks()
    } catch (err) {
      alert('Error creating task')
    }
  }

  const handleDeleteTask = async (id) => {
    if (window.confirm('Delete this task?')) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/tasks/${id}/delete/`)
        fetchTasks()
      } catch (err) {
        alert('Error deleting task')
      }
    }
  }

  const handleToggleComplete = async (task) => {
    try {
      const updated = {
        title: task.title,
        description: task.description,
        due_date: task.due_date,
        priority: task.priority,
        is_completed: !task.is_completed
      }
      await axios.put(`http://127.0.0.1:8000/api/tasks/${task.id}/update/`, updated)
      fetchTasks()
    } catch (err) {
      alert('Error updating task')
    }
  }

  const completedCount = tasks.filter(t => t.is_completed).length
  const activeCount = tasks.filter(t => !t.is_completed).length

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <div className="logo-icon">
              <BiListCheck size={28} />
            </div>
            <div>
              <h1>Task Manager</h1>
              <p>Stay organized</p>
            </div>
          </div>
          <button
            className="theme-btn"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <MdDarkMode size={22} /> : <MdLightMode size={22} />}
          </button>
        </div>
      </header>

      <main className="main">
        {/* Stats */}
        <div className="stats">
          <div className="stat">
            <span className="stat-number">{tasks.length}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat">
            <span className="stat-number">{activeCount}</span>
            <span className="stat-label">Active</span>
          </div>
          <div className="stat">
            <span className="stat-number">{completedCount}</span>
            <span className="stat-label">Done</span>
          </div>
        </div>

        {/* Add Task Section */}
        <section className="add-task-section">
          <div className="section-header">
            <h2>Add New Task</h2>
            <button
              className={`toggle-form ${showForm ? 'active' : ''}`}
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? <FiX size={24} /> : <FiPlus size={24} />}
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleCreateTask} className="form">
              <input
                type="text"
                placeholder="Task title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input"
                autoFocus
              />

              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input textarea"
              />

              <div className="form-row">
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="input"
                />
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="input"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div className="form-buttons">
                <button type="submit" className="btn-submit">Create Task</button>
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </section>

        {/* Tasks Section */}
        <section className="tasks-section">
          <h2>Your Tasks</h2>

          {loading ? (
            <p className="status-message">Loading...</p>
          ) : tasks.length === 0 ? (
            <p className="status-message">No tasks yet. Create one to start!</p>
          ) : (
            <div className="tasks-list">
              {tasks.map(task => (
                <div
                  key={task.id}
                  className={`task-item ${task.is_completed ? 'completed' : ''}`}
                >
                  <label className="checkbox-container">
                    <input
                      type="checkbox"
                      checked={task.is_completed}
                      onChange={() => handleToggleComplete(task)}
                      className="checkbox"
                    />
                    <span className="checkbox-mark">
                      {task.is_completed && <FiCheck size={18} />}
                    </span>
                  </label>

                  <div className="task-info">
                    <h3 className="task-title">{task.title}</h3>
                    <p className="task-description">{task.description}</p>
                    <div className="task-footer">
                      <span className="task-date">
                        <FiCalendar size={14} />
                        {new Date(task.due_date).toLocaleDateString()}
                      </span>
                      <span className={`priority-badge priority-${task.priority.toLowerCase()}`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>

                  <button
                    className="btn-delete"
                    onClick={() => handleDeleteTask(task.id)}
                    title="Delete task"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default App
