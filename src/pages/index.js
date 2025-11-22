import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [activeTab, setActiveTab] = useState('todo');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  // Load todos from localStorage on component mount
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // Create a new todo
  const createTodo = () => {
    if (title.trim() === '') return;
    
    const newTodo = {
      id: Date.now(),
      title: title.trim(),
      description: description.trim(),
      completed: false,
      createdAt: new Date().toISOString()
    };

    setTodos([...todos, newTodo]);
    setTitle('');
    setDescription('');
  };

  // Update a todo
  const updateTodo = (id) => {
    if (editTitle.trim() === '') return;
    
    setTodos(todos.map(todo => 
      todo.id === id 
        ? { ...todo, title: editTitle.trim(), description: editDescription.trim() }
        : todo
    ));
    setEditingId(null);
    setEditTitle('');
    setEditDescription('');
  };

  // Delete a todo
  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // Mark todo as complete/incomplete
  const toggleComplete = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id 
        ? { ...todo, completed: !todo.completed }
        : todo
    ));
  };

  // Start editing a todo
  const startEditing = (todo) => {
    setEditingId(todo.id);
    setEditTitle(todo.title);
    setEditDescription(todo.description);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingId(null);
    setEditTitle('');
    setEditDescription('');
  };

  // Filter todos based on active tab
  const filteredTodos = todos.filter(todo => {
    const matchesTab = activeTab === 'todo' ? !todo.completed : todo.completed;
    const matchesSearch = todo.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         todo.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="container">
      <Head>
        <title>Simple To-Do App</title>
        <meta name="description" content="A simple to-do application" />
      </Head>

      <header>
        <h1>Simple To-Do App</h1>
        <p className="subtitle">Stay organized and productive</p>
      </header>

      <div className="app-content">
        {/* Input Section */}
        <div className="input-section">
          <input
            type="text"
            placeholder="Task title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && createTodo()}
          />
          <textarea
            placeholder="Task description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
          />
          <button onClick={createTodo} className="btn-primary">
            Add Task
          </button>
        </div>

        {/* Search and Tabs */}
        <div className="filter-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'todo' ? 'active' : ''}`}
              onClick={() => setActiveTab('todo')}
            >
              To Do ({todos.filter(t => !t.completed).length})
            </button>
            <button 
              className={`tab ${activeTab === 'completed' ? 'active' : ''}`}
              onClick={() => setActiveTab('completed')}
            >
              Completed ({todos.filter(t => t.completed).length})
            </button>
          </div>
        </div>

        {/* Todo List */}
        <div className="todo-list">
          {filteredTodos.length === 0 ? (
            <div className="empty-state">
              <p>No {activeTab === 'todo' ? 'to-do' : 'completed'} tasks found.</p>
            </div>
          ) : (
            filteredTodos.map(todo => (
              <div key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                {editingId === todo.id ? (
                  // Edit Mode
                  <div className="edit-mode">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="edit-input"
                    />
                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className="edit-textarea"
                      rows="3"
                    />
                    <div className="edit-actions">
                      <button 
                        onClick={() => updateTodo(todo.id)}
                        className="btn-save"
                      >
                        Save
                      </button>
                      <button 
                        onClick={cancelEditing}
                        className="btn-cancel"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <>
                    <div className="todo-content">
                      <h3>{todo.title}</h3>
                      <p>{todo.description}</p>
                    </div>
                    <div className="todo-actions">
                      <button 
                        onClick={() => toggleComplete(todo.id)}
                        className={`btn-complete ${todo.completed ? 'completed' : ''}`}
                      >
                        {todo.completed ? 'Undo' : 'Complete'}
                      </button>
                      <button 
                        onClick={() => startEditing(todo)}
                        className="btn-edit"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => deleteTodo(todo.id)}
                        className="btn-delete"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <style jsx>{`
        .container {
          max-width: 800px;
          margin: 0 auto;
          background-color: white;
          border-radius: 10px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        header {
          background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
          color: white;
          padding: 30px 20px;
          text-align: center;
        }

        h1 {
          font-size: 2.5rem;
          margin-bottom: 10px;
        }

        .subtitle {
          font-size: 1.1rem;
          opacity: 0.9;
        }

        .app-content {
          padding: 20px;
        }

        .input-section {
          display: flex;
          flex-direction: column;
          gap: 15px;
          margin-bottom: 25px;
          padding-bottom: 20px;
          border-bottom: 1px solid #000000ff;
        }

        input, textarea {
          padding: 12px 15px;
          border: 1px solid #c71a1aff;
          border-radius: 8px;
          font-size: 16px;
          transition: border-color 0.3s;
        }

        input:focus, textarea:focus {
          outline: none;
          border-color: #2575fc;
        }

        textarea {
          resize: vertical;
          min-height: 80px;
        }

        .btn-primary {
          background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
          color: white;
          border: none;
          padding: 12px 20px;
          border-radius: 8px;
          font-size: 16px;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
        }

        .filter-section {
          margin-bottom: 20px;
        }

        .search-box {
          margin-bottom: 15px;
        }

        .search-box input {
          width: 100%;
        }

        .tabs {
          display: flex;
          border-bottom: 1px solid #eee;
        }

        .tab {
          flex: 1;
          padding: 12px;
          background: none;
          border: none;
          cursor: pointer;
          transition: all 0.3s;
          border-bottom: 3px solid transparent;
        }

        .tab.active {
          border-bottom-color: #2575fc;
          color: #2575fc;
          font-weight: bold;
        }

        .todo-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .todo-item {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 20px;
          border: 1px solid #eee;
          border-radius: 8px;
          transition: all 0.3s;
        }

        .todo-item:hover {
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
        }

        .todo-item.completed {
          opacity: 0.7;
          background-color: #f9f9f9;
        }

        .todo-content {
          flex: 1;
        }

        .todo-content h3 {
          margin-bottom: 8px;
          color: #333;
        }

        .todo-content p {
          color: #000000ff;
          margin-bottom: 0;
        }

        .todo-actions {
          display: flex;
          gap: 10px;
          margin-left: 15px;
        }

        button {
          padding: 8px 12px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s;
        }

        .btn-complete {
          background-color: #28a745;
          color: white;
        }

        .btn-complete.completed {
          background-color: #6c757d;
        }

        .btn-edit {
          background-color: #ffc107;
          color: black;
        }

        .btn-delete {
          background-color: #dc3545;
          color: white;
        }

        .btn-save {
          background-color: #007bff;
          color: white;
        }

        .btn-cancel {
          background-color: #6c757d;
          color: white;
        }

        button:hover {
          opacity: 0.9;
          transform: translateY(-1px);
        }

        .edit-mode {
          width: 100%;
        }

        .edit-input, .edit-textarea {
          width: 100%;
          margin-bottom: 10px;
        }

        .edit-actions {
          display: flex;
          gap: 10px;
        }

        .empty-state {
          text-align: center;
          padding: 40px;
          color: #666;
        }

        @media (max-width: 600px) {
          .todo-item {
            flex-direction: column;
          }
          
          .todo-actions {
            margin-left: 0;
            margin-top: 15px;
            width: 100%;
            justify-content: space-between;
          }
          
          button {
            flex: 1;
          }
        }
      `}</style>
    </div>
  );
}