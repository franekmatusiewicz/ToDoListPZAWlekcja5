import { useState } from 'react'
import './App.css'

type TaskFilter = 'all' | 'completed' | 'incomplete'
type TaskSort = 'original' | 'alphabetical' | 'status'

function App() {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Zrobić zakupy', completed: false },
    { id: 2, title: 'Odrabiać pracę domową', completed: false },
    { id: 3, title: 'Posprzątać pokój', completed: false },
  ])
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [filter, setFilter] = useState<TaskFilter>('all')
  const [sort, setSort] = useState<TaskSort>('original')

  const addTask = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const title = newTaskTitle.trim()

    if (!title) return

    setTasks((currentTasks) => {
      const nextId = currentTasks.reduce((highestId, task) => Math.max(highestId, task.id), 0) + 1
      return [...currentTasks, { id: nextId, title, completed: false }]
    })
    setNewTaskTitle('')
  }

  const toggleTaskStatus = (taskId: number) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task,
      ),
    )
  }

  const incompleteTasksCount = tasks.filter((task) => !task.completed).length
  const visibleTasks = tasks
    .filter((task) => {
      if (filter === 'completed') return task.completed
      if (filter === 'incomplete') return !task.completed
      return true
    })
    .sort((firstTask, secondTask) => {
      if (sort === 'alphabetical') {
        return firstTask.title.localeCompare(secondTask.title, 'pl')
      }
      if (sort === 'status') {
        return Number(firstTask.completed) - Number(secondTask.completed)
      }
      return 0
    })

  return (
    <main className="todo-app">
      <h1>Lista zadań</h1>
      <p className="task-count">Niewykonane zadania: {incompleteTasksCount}</p>
      <form className="add-task-form" onSubmit={addTask}>
        <input
          aria-label="Nazwa nowego zadania"
          type="text"
          placeholder="Wpisz nowe zadanie"
          required
          value={newTaskTitle}
          onChange={(event) => setNewTaskTitle(event.target.value)}
        />
        <button type="submit" disabled={!newTaskTitle.trim()}>
          Dodaj zadanie
        </button>
      </form>
      <div className="task-controls">
        <label>
          Filtruj:
          <select value={filter} onChange={(event) => setFilter(event.target.value as TaskFilter)}>
            <option value="all">Wszystkie</option>
            <option value="completed">Wykonane</option>
            <option value="incomplete">Niewykonane</option>
          </select>
        </label>
        <label>
          Sortuj:
          <select value={sort} onChange={(event) => setSort(event.target.value as TaskSort)}>
            <option value="original">Oryginalny porządek</option>
            <option value="alphabetical">Alfabetycznie</option>
            <option value="status">Według stanu</option>
          </select>
        </label>
      </div>
      <ul className="task-list">
        {visibleTasks.map((task) => (
          <li className="task-item" key={task.id}>
            <span className={task.completed ? 'task-title completed' : 'task-title'}>
              {task.title}
            </span>
            <span className="task-status">
              {task.completed ? 'Wykonane' : 'Niewykonane'}
            </span>
            <button
              className="task-toggle"
              type="button"
              onClick={() => toggleTaskStatus(task.id)}
            >
              Oznacz jako {task.completed ? 'niewykonane' : 'wykonane'}
            </button>
          </li>
        ))}
      </ul>
      {visibleTasks.length === 0 && <p>Brak zadań w tej kategorii.</p>}
    </main>
  )
}

export default App
