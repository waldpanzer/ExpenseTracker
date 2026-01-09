const API_BASE = 'http://localhost:5000/api';

let authToken = null;

const authSection = document.getElementById('authSection');
const appSection = document.getElementById('appSection');
const logoutBtn = document.getElementById('logoutBtn');
const messageEl = document.getElementById('message');

const txCategorySelect = document.getElementById('txCategory');
const txTableBody = document.getElementById('txTableBody');
const sumIncomeEl = document.getElementById('sumIncome');
const sumExpensesEl = document.getElementById('sumExpenses');
const sumBalanceEl = document.getElementById('sumBalance');

function showMessage(text, type = 'info') {
  messageEl.textContent = text;
  messageEl.className = `alert alert-${type}`;
}

async function api(path, options = {}) {
  const headers = options.headers || {};
  headers['Content-Type'] = 'application/json';
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Error' }));
    throw new Error(err.message || 'Request failed');
  }
  return res.json();
}

async function loadCategories() {
  try {
    const categories = await api('/categories', { method: 'GET' });
    txCategorySelect.innerHTML = '';
    categories.forEach(cat => {
      const opt = document.createElement('option');
      opt.value = cat._id;
      opt.textContent = `${cat.name} (${cat.type})`;
      txCategorySelect.appendChild(opt);
    });
  } catch (err) {
    console.error(err);
    showMessage('Failed to load categories. Please seed them in the database.', 'warning');
  }
}

async function loadTransactionsAndSummary() {
  try {
    const now = new Date();
    const monthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    const [txs, summary] = await Promise.all([
      api(`/transactions?month=${monthStr}`, { method: 'GET' }),
      api(`/summary?month=${monthStr}`, { method: 'GET' })
    ]);

    txTableBody.innerHTML = '';
    txs.forEach(tx => {
      const tr = document.createElement('tr');
      const date = new Date(tx.date);
      tr.innerHTML = `
        <td>${date.toISOString().slice(0, 10)}</td>
        <td>${tx.type}</td>
        <td>${tx.categoryId ? tx.categoryId.name : ''}</td>
        <td>${tx.description || ''}</td>
        <td class="text-end">${tx.amount.toFixed(2)}</td>
      `;
      txTableBody.appendChild(tr);
    });

    sumIncomeEl.textContent = summary.totalIncome.toFixed(2);
    sumExpensesEl.textContent = summary.totalExpenses.toFixed(2);
    sumBalanceEl.textContent = summary.balance.toFixed(2);
  } catch (err) {
    console.error(err);
    showMessage('Could not load transactions/summary', 'danger');
  }
}

document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    await api('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    });
    showMessage('Registration successful. You can now log in.', 'success');
  } catch (err) {
    showMessage(err.message, 'danger');
  }
});

document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const data = await api('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    authToken = data.token;
    authSection.classList.add('d-none');
    appSection.classList.remove('d-none');
    logoutBtn.classList.remove('d-none');
    showMessage('Logged in successfully', 'success');
    await loadCategories();
    await loadTransactionsAndSummary();
  } catch (err) {
    showMessage(err.message, 'danger');
  }
});

document.getElementById('txForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    const amount = parseFloat(document.getElementById('txAmount').value);
    const type = document.getElementById('txType').value;
    const categoryId = document.getElementById('txCategory').value;
    const date = document.getElementById('txDate').value;
    const description = document.getElementById('txDesc').value;

    await api('/transactions', {
      method: 'POST',
      body: JSON.stringify({ amount, type, categoryId, date, description })
    });
    showMessage('Transaction saved', 'success');
    e.target.reset();
    await loadTransactionsAndSummary();
  } catch (err) {
    showMessage(err.message, 'danger');
  }
});

logoutBtn.addEventListener('click', () => {
  authToken = null;
  authSection.classList.remove('d-none');
  appSection.classList.add('d-none');
  logoutBtn.classList.add('d-none');
  txTableBody.innerHTML = '';
  sumIncomeEl.textContent = '0';
  sumExpensesEl.textContent = '0';
  sumBalanceEl.textContent = '0';
  showMessage('Logged out', 'info');
});
