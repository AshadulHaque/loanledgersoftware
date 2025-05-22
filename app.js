// app.js - Handles dynamic UI and API calls
const apiUrl = 'http://localhost:3000/api/loans';

async function fetchLoans() {
  const res = await fetch(apiUrl);
  const loans = await res.json();
  renderLoans(loans);
}

function renderLoans(loans) {
  const tbody = document.getElementById('loanTableBody');
  tbody.innerHTML = '';
  loans.forEach(loan => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="px-4 py-2">${loan.borrower}</td>
      <td class="px-4 py-2">${loan.amount}</td>
      <td class="px-4 py-2">${loan.interest}%</td>
      <td class="px-4 py-2">${loan.dueDate}</td>
      <td class="px-4 py-2">${loan.status}</td>
      <td class="px-4 py-2">
        <button onclick="editLoan('${loan._id}')" class="text-yellow-500 mr-2">Edit</button>
        <button onclick="deleteLoan('${loan._id}')" class="text-red-500">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

let editingLoanId = null;

function populateForm(loan) {
  document.getElementById('borrower').value = loan.borrower;
  document.getElementById('amount').value = loan.amount;
  document.getElementById('interest').value = loan.interest;
  document.getElementById('dueDate').value = loan.dueDate;
  document.getElementById('status').value = loan.status;
}

function setFormMode(isEdit) {
  const btn = document.querySelector('#loanForm button[type="submit"]');
  btn.textContent = isEdit ? 'Update Loan' : 'Add Loan';
}

document.getElementById('loanForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const loan = {
    borrower: document.getElementById('borrower').value,
    amount: document.getElementById('amount').value,
    interest: document.getElementById('interest').value,
    dueDate: document.getElementById('dueDate').value,
    status: document.getElementById('status').value,
  };
  if (editingLoanId) {
    await fetch(`${apiUrl}/${editingLoanId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loan),
    });
    editingLoanId = null;
    setFormMode(false);
  } else {
    await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loan),
    });
  }
  this.reset();
  fetchLoans();
});

window.deleteLoan = async function(id) {
  await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
  fetchLoans();
};

window.editLoan = async function(id) {
  // Fetch the specific loan by id for accuracy
  const res = await fetch(`${apiUrl}/${id}`);
  const loan = await res.json();
  if (loan) {
    populateForm(loan);
    editingLoanId = id;
    setFormMode(true);
    // Scroll to form for better UX
    document.getElementById('loanForm').scrollIntoView({ behavior: 'smooth' });
  }
};

// Initial load
fetchLoans();
