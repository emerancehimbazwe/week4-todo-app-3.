
import './style.css'

const app = document.querySelector('#app')

// Restore saved tasks, filter, and theme.
let tasks = JSON.parse(localStorage.getItem('studyMateTasks') || '[]')
let currentFilter = localStorage.getItem('studyMateFilter') || 'all'
let isDark = localStorage.getItem('studyMateTheme') === 'dark'
let editingId = null

app.className = 'min-h-screen bg-violet-50 text-slate-800'
app.innerHTML = `
  <main id="page" class="mx-auto max-w-3xl px-4 py-10 sm:px-6">
    <header class="mb-8 text-center">
      <p class="mb-2 text-sm font-semibold uppercase tracking-widest text-violet-600">
        Your student planner
      </p>
      <h1 class="text-4xl font-bold tracking-tight text-violet-900">StudyMate</h1>
      <p class="mt-3 text-slate-600">Organize your studies, one task at a time.</p>
      <button id="theme-toggle" type="button"
        class="mt-4 rounded-xl bg-slate-200 px-4 py-2 font-medium text-slate-800 hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-400"
        aria-label="Toggle dark mode">
        🌙 Dark mode
      </button>
    </header>

    <section id="task-card" class="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-violet-100 sm:p-7">
      <form id="task-form" class="flex flex-col gap-3 sm:flex-row">
        <label for="task-input" class="sr-only">New task</label>
        <input id="task-input" type="text" maxlength="100"
          placeholder="What do you need to do?"
          class="min-w-0 flex-1 rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200" />
        <button type="submit"
          class="rounded-xl bg-violet-600 px-6 py-3 font-semibold text-white hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2">
          + Add task
        </button>
      </form>

      <p id="form-error" class="mt-2 text-sm text-red-600" role="alert"></p>

      <div class="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p id="task-count" class="text-sm font-medium text-slate-600">0 tasks left</p>
        <div class="flex flex-wrap gap-2" aria-label="Task filters">
          <button type="button" data-filter="all" class="filter-btn rounded-lg bg-violet-600 px-3 py-2 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-violet-400">All</button>
          <button type="button" data-filter="active" class="filter-btn rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-violet-100 focus:outline-none focus:ring-2 focus:ring-violet-400">Active</button>
          <button type="button" data-filter="completed" class="filter-btn rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-violet-100 focus:outline-none focus:ring-2 focus:ring-violet-400">Completed</button>
        </div>
      </div>

      <div class="mt-4">
        <div id="progress-track"
          class="h-3 w-full overflow-hidden rounded-full bg-slate-200"
          role="progressbar" aria-label="Tasks completed"
          aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
          <div id="progress-bar" class="h-full rounded-full bg-violet-600 transition-all duration-300" style="width: 0%"></div>
        </div>
        <p id="progress-text" class="mt-2 text-sm text-slate-500">0% completed</p>
      </div>

      <ul id="task-list" class="mt-5 space-y-3"></ul>

      <div class="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
        <p id="empty-message" class="text-sm text-slate-500">Your study list is ready. Add your first task!</p>
        <button id="clear-completed" type="button"
          class="text-sm font-medium text-violet-700 underline hover:text-violet-900 focus:outline-none focus:ring-2 focus:ring-violet-400">
          Clear completed
        </button>
      </div>
    </section>

    <footer class="mt-6 text-center text-sm text-slate-500">
      Small steps today, big achievements tomorrow.
    </footer>
  </main>
`

// Save tasks, filter, and theme to localStorage.
function saveData() {
  localStorage.setItem('studyMateTasks', JSON.stringify(tasks))
  localStorage.setItem('studyMateFilter', currentFilter)
  localStorage.setItem('studyMateTheme', isDark ? 'dark' : 'light')
}

// Apply the selected light or dark theme.
function applyTheme() {
  const page = document.querySelector('#page')
  const card = document.querySelector('#task-card')
  const button = document.querySelector('#theme-toggle')

  page.classList.toggle('bg-slate-900', isDark)
  page.classList.toggle('text-white', isDark)
  page.classList.toggle('bg-violet-50', !isDark)
  page.classList.toggle('text-slate-800', !isDark)
  card.classList.toggle('bg-slate-800', isDark)
  card.classList.toggle('bg-white', !isDark)
  card.classList.toggle('ring-slate-700', isDark)
  card.classList.toggle('ring-violet-100', !isDark)

  document.querySelector('h1').className = isDark
    ? 'text-4xl font-bold tracking-tight text-white'
    : 'text-4xl font-bold tracking-tight text-violet-900'

  document.querySelector('header p:last-of-type').className = isDark
    ? 'mt-3 text-slate-300'
    : 'mt-3 text-slate-600'

  button.textContent = isDark ? '☀️ Light mode' : '🌙 Dark mode'

  document.querySelectorAll('#task-count, #progress-text, #empty-message, footer')
    .forEach(element => {
      element.classList.toggle('text-slate-300', isDark)
      element.classList.toggle('text-slate-500', !isDark)
      element.classList.toggle('text-slate-600', !isDark)
    })

  document.querySelectorAll('#task-list li').forEach(item => {
    item.classList.toggle('border-slate-600', isDark)
    item.classList.toggle('border-slate-200', !isDark)
  })

  document.querySelectorAll('#task-list li span').forEach(text => {
    if (!text.classList.contains('line-through')) {
      text.classList.toggle('text-white', isDark)
      text.classList.toggle('text-slate-800', !isDark)
    }
  })
}

// Add a task after checking its text.
function addTask(text) {
  const cleanText = text.trim()
  const error = document.querySelector('#form-error')

  if (!cleanText || cleanText.length > 100) {
    error.textContent = 'Enter a task between 1 and 100 characters.'
    return
  }

  error.textContent = ''
  tasks.push({ id: crypto.randomUUID(), text: cleanText, done: false })
  saveData()
  render()
}

// Display tasks, filters, counter, and progress.
function render() {
  const list = document.querySelector('#task-list')
  const count = document.querySelector('#task-count')
  const empty = document.querySelector('#empty-message')

  list.replaceChildren()

  const remaining = tasks.filter(task => !task.done).length
  const completed = tasks.length - remaining
  const percentage = tasks.length === 0
    ? 0
    : Math.round((completed / tasks.length) * 100)

  count.textContent = `${remaining} ${remaining === 1 ? 'task' : 'tasks'} left`

  document.querySelector('#progress-bar').style.width = `${percentage}%`
  document.querySelector('#progress-track').setAttribute('aria-valuenow', String(percentage))
  document.querySelector('#progress-text').textContent =
    `${percentage}% completed (${completed} of ${tasks.length})`

  const visibleTasks = tasks.filter(task => {
    if (currentFilter === 'active') return !task.done
    if (currentFilter === 'completed') return task.done
    return true
  })

  document.querySelectorAll('.filter-btn').forEach(button => {
    const selected = button.dataset.filter === currentFilter
    button.classList.toggle('bg-violet-600', selected)
    button.classList.toggle('text-white', selected)
    button.classList.toggle('bg-slate-100', !selected)
    button.classList.toggle('text-slate-700', !selected)
    button.setAttribute('aria-pressed', String(selected))
  })

  empty.textContent = visibleTasks.length === 0
    ? tasks.length === 0
      ? 'Your study list is ready. Add your first task!'
      : 'No tasks in this filter. Try another filter!'
    : ''

  visibleTasks.forEach(task => {
    const item = document.createElement('li')
    item.className = 'flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 p-4'

    const checkbox = document.createElement('input')
    checkbox.type = 'checkbox'
    checkbox.checked = task.done
    checkbox.dataset.id = task.id
    checkbox.setAttribute('aria-label', `Complete ${task.text}`)
    checkbox.className = 'h-5 w-5 accent-violet-600'

    if (editingId === task.id) {
      const editInput = document.createElement('input')
      editInput.type = 'text'
      editInput.maxLength = 100
      editInput.value = task.text
      editInput.setAttribute('aria-label', 'Edit task text')
      editInput.className = 'min-w-0 flex-1 rounded-lg border border-violet-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-300'

      editInput.addEventListener('keydown', event => {
        if (event.key === 'Enter') saveEdit(task.id, editInput.value)
        if (event.key === 'Escape') {
          editingId = null
          render()
        }
      })

      item.append(checkbox, editInput)
      list.append(item)
      editInput.focus()
      editInput.select()
      return
    }

    const text = document.createElement('span')
    text.textContent = task.text
    text.className = 'min-w-0 flex-1 break-words'
    if (task.done) text.classList.add('text-slate-400', 'line-through')

    const editButton = document.createElement('button')
    editButton.type = 'button'
    editButton.textContent = 'Edit'
    editButton.dataset.action = 'edit'
    editButton.dataset.id = task.id
    editButton.className = 'rounded-lg px-3 py-2 text-sm text-violet-700 hover:bg-violet-50 focus:outline-none focus:ring-2 focus:ring-violet-400'

    const deleteButton = document.createElement('button')
    deleteButton.type = 'button'
    deleteButton.textContent = 'Delete'
    deleteButton.dataset.action = 'delete'
    deleteButton.dataset.id = task.id
    deleteButton.className = 'rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-400'
    deleteButton.setAttribute('aria-label', `Delete ${task.text}`)

    item.append(checkbox, text, editButton, deleteButton)
    list.append(item)
  })

  applyTheme()
}

// Save an edited task if the text is valid.
function saveEdit(id, text) {
  const cleanText = text.trim()
  const error = document.querySelector('#form-error')

  if (!cleanText || cleanText.length > 100) {
    error.textContent = 'A task cannot be empty. Use 1–100 characters.'
    return
  }

  const task = tasks.find(item => item.id === id)
  if (!task) return

  task.text = cleanText
  editingId = null
  error.textContent = ''
  saveData()
  render()
}

// Handle adding tasks through the form.
document.querySelector('#task-form').addEventListener('submit', event => {
  event.preventDefault()
  const input = document.querySelector('#task-input')
  const text = input.value
  addTask(text)

  if (text.trim().length > 0 && text.trim().length <= 100) {
    input.value = ''
    input.focus()
  }
})

// Handle completion changes through event delegation.
document.querySelector('#task-list').addEventListener('change', event => {
  if (event.target.type !== 'checkbox') return

  const task = tasks.find(item => item.id === event.target.dataset.id)
  if (!task) return

  task.done = event.target.checked
  saveData()
  render()
})

// Handle editing and deletion through event delegation.
document.querySelector('#task-list').addEventListener('click', event => {
  const button = event.target.closest('button')
  if (!button) return

  const task = tasks.find(item => item.id === button.dataset.id)
  if (!task) return

  if (button.dataset.action === 'edit') {
    editingId = task.id
    document.querySelector('#form-error').textContent = ''
    render()
    return
  }

  if (button.dataset.action === 'delete' && window.confirm(`Delete "${task.text}"?`)) {
    tasks = tasks.filter(item => item.id !== task.id)
    saveData()
    render()
  }
})

// Handle changes to the selected filter.
document.querySelectorAll('.filter-btn').forEach(button => {
  button.addEventListener('click', () => {
    currentFilter = button.dataset.filter
    saveData()
    render()
  })
})

// Toggle the theme and remember the user's choice.
document.querySelector('#theme-toggle').addEventListener('click', () => {
  isDark = !isDark
  saveData()
  applyTheme()
})

// Remove completed tasks and save the updated list.
document.querySelector('#clear-completed').addEventListener('click', () => {
  tasks = tasks.filter(task => !task.done)
  saveData()
  render()
})

// Draw the initial page with saved tasks.
render()
