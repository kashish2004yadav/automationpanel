// NAVIGATION LOGIC
function showSection(section) {
  ['dashboard', 'users', 'tasks', 'settings'].forEach(s => {
    document.getElementById(s + '-section').classList.add('hidden');
  });
  document.getElementById(section + '-section').classList.remove('hidden');
  const sidebarLinks = document.querySelectorAll('.sidebar nav ul li');
  sidebarLinks.forEach((li, idx) => li.classList.remove('active'));
  sidebarLinks[
    section === 'dashboard' ? 0 : section === 'users' ? 1 : section === 'tasks' ? 2 : 3
  ].classList.add('active');
}
showSection('dashboard');

// SIDEBAR
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('collapsed');
}

// PROFILE DROPDOWN
function toggleProfileDropdown() {
  const menu = document.getElementById('profile-menu');
  menu.classList.toggle('hidden');
  setTimeout(() => menu.classList.add('hidden'), 1800);
}

// THEME
function toggleTheme() {
  const body = document.body;
  if (body.classList.contains('dark')) {
    body.classList.replace('dark', 'light');
    localStorage.setItem('theme', 'light');
  } else {
    body.classList.replace('light', 'dark');
    localStorage.setItem('theme', 'dark');
  }
}
(function() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.body.classList.add(savedTheme);
})();

// USERS API TABLE
let users = [];
let filteredUsers = [];
let currentPage = 1;
const usersPerPage = 5;

async function fetchUsers() {
  try {
    const res = await fetch('https://jsonplaceholder.typicode.com/users');
    users = await res.json();
    filteredUsers = [...users];
    document.getElementById('total-users').innerText = users.length;
    renderUserTable();
  } catch {
    showToast('Error loading API users');
  }
}
function renderUserTable() {
  const tbody = document.getElementById('user-table').querySelector('tbody');
  tbody.innerHTML = '';
  let pageUsers = filteredUsers.slice((currentPage-1)*usersPerPage, currentPage*usersPerPage);
  pageUsers.forEach(user => {
    let row = document.createElement('tr');
    row.innerHTML = `<td>${user.name}</td><td>${user.email}</td><td>${user.company.name}</td>`;
    tbody.appendChild(row);
  });
  renderUserPagination();
}
function renderUserPagination() {
  const total = Math.ceil(filteredUsers.length / usersPerPage);
  const pagination = document.getElementById('pagination');
  pagination.innerHTML = '';
  for (let i=1; i<=total; i++) {
    let btn = document.createElement('button');
    btn.innerText = i;
    btn.className = i === currentPage ? 'active' : '';
    btn.onclick = ()=>{currentPage=i;renderUserTable();};
    pagination.appendChild(btn);
  }
}
document.getElementById('user-search').addEventListener('input', function() {
  const q = this.value.toLowerCase();
  filteredUsers = users.filter(u=>u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
  currentPage = 1; renderUserTable();
});
function sortUsers(dir) {
  filteredUsers.sort((a,b)=> dir==='asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));
  renderUserTable();
}
fetchUsers();

// TASK PANEL
let tasks = [];
function loadTasks() {
  const ts = localStorage.getItem('tasks');
  if (ts) {
    tasks = JSON.parse(ts);
  } else {
    tasks = [
      {
        title: "Demo: Finish Assignment",
        description: "Complete code and submit before midnight.",
        priority: "high",
        deadline: new Date(Date.now()+2*24*60*60*1000).toISOString().slice(0,10),
        status: "pending"
      },
      {
        title: "Demo: Record Video",
        description: "Create dashboard walkthrough.",
        priority: "medium",
        deadline: new Date(Date.now()+3*24*60*60*1000).toISOString().slice(0,10),
        status: "inprogress"
      }
    ];
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }
}
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks();
  updateStatsCards();
}
function renderTasks(fTasks) {
  loadTasks();
  const displayTasks = fTasks || tasks;
  const list = document.getElementById('task-list');
  list.innerHTML = '';
  if (!displayTasks.length) {
    list.innerHTML = "<div class='task-item'>No tasks found.</div>";
    return;
  }
  displayTasks.forEach((t, idx) => {
    let item = document.createElement('div');
    item.className = 'task-item';
    item.innerHTML = `
      <div>
        <strong>${t.title}</strong> <br />
        ${t.description} <br/>
        Priority: <b>${t.priority}</b> | Deadline: <b>${t.deadline}</b> | Status: <b>${t.status}</b>
      </div>
      <div class="task-actions">
        <button onclick="editTask(${idx})">Edit</button>
        <button class="delete" onclick="deleteTask(${idx})">Delete</button>
      </div>`;
    list.appendChild(item);
  });
}
window.openTaskModal = function() {
  document.getElementById('task-id').value = '';
  document.getElementById('task-title').value = '';
  document.getElementById('task-desc').value = '';
  document.getElementById('task-priority').value = 'medium';
  document.getElementById('task-deadline').value = '';
  document.getElementById('task-status').value = 'pending';
  document.getElementById('modal-title').innerText = 'Add Task';
  document.getElementById('task-modal').classList.remove('hidden');
}
window.closeTaskModal = function() {
  document.getElementById('task-modal').classList.add('hidden');
}
window.editTask = function(idx) {
  loadTasks();
  const t = tasks[idx];
  document.getElementById('task-id').value = idx;
  document.getElementById('task-title').value = t.title;
  document.getElementById('task-desc').value = t.description;
  document.getElementById('task-priority').value = t.priority;
  document.getElementById('task-deadline').value = t.deadline;
  document.getElementById('task-status').value = t.status;
  document.getElementById('modal-title').innerText = 'Edit Task';
  document.getElementById('task-modal').classList.remove('hidden');
};
window.deleteTask = function(idx) {
  loadTasks();
  tasks.splice(idx, 1);
  saveTasks();
  showToast('Task deleted');
};
window.saveTask = function(event) {
  event.preventDefault();
  const title = document.getElementById('task-title').value.trim();
  const desc = document.getElementById('task-desc').value.trim();
  const pri = document.getElementById('task-priority').value;
  const deadline = document.getElementById('task-deadline').value;
  const status = document.getElementById('task-status').value;
  if (!title || title.length < 3) return showToast('Title required (min 3 chars)');
  if (!desc) return showToast('Description required');
  if (!pri) return showToast('Select priority');
  if (!deadline) return showToast('Select a deadline');
  if (!status) return showToast('Select status');
  const id = document.getElementById('task-id').value;
  if (id !== '') {
    tasks[id] = { title, description: desc, priority: pri, deadline, status };
    showToast('Task updated');
  } else {
    tasks.push({ title, description: desc, priority: pri, deadline, status });
    showToast('Task added');
  }
  saveTasks();
  closeTaskModal();
  return false;
};
function updateStatsCards() {
  loadTasks();
  document.getElementById('active-tasks').innerText = tasks.filter(t=>t.status!=='completed').length;
  document.getElementById('completed-tasks').innerText = tasks.filter(t=>t.status==='completed').length;
}
function filterTasks() {
  loadTasks();
  const pri = document.getElementById('priority-filter').value;
  const status = document.getElementById('status-filter').value;
  let f = tasks;
  if (pri) f = f.filter(t=>t.priority===pri);
  if (status) f = f.filter(t=>t.status===status);
  renderTasks(f);
}
function filterUpcoming() {
  loadTasks();
  const now = new Date();
  const weekMs = 7*24*60*60*1000;
  const upcoming = tasks.filter(t=> (new Date(t.deadline) - now) <= weekMs && (new Date(t.deadline) - now) > 0 );
  renderTasks(upcoming);
}

// TOAST
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.remove('hidden');
  setTimeout(()=>toast.classList.add('hidden'), 1600);
}

// INITIAL STATE
window.onload = function() {
  loadTasks();
  renderTasks();
  updateStatsCards();
};

// MODAL DISMISS
window.onclick = function(e) {
  let modal = document.getElementById('task-modal');
  if (e.target === modal) closeTaskModal();
};
