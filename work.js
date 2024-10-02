let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
let editingIndex = null;


const toggleButton = document.getElementById('toggle-dark-mode');
const body = document.body;
const container = document.querySelector('.container');
const buttons = document.querySelectorAll('button');

function setButtonColors() {
    if (body.classList.contains('dark-mode')) {
        buttons.forEach(button => {
            button.style.backgroundColor = '#e84c3d'; 
        });
    } else {
        buttons.forEach(button => {
            button.style.backgroundColor = '#007bff'; 
        });
    }
}


toggleButton.addEventListener('change', () => {
    const isDarkMode = body.classList.toggle('dark-mode');
    container.classList.toggle('dark-mode');
    setButtonColors();
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => input.classList.toggle('dark-mode'));
});

// Set initial button colors on page load
setButtonColors();

document.getElementById('expense-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const expenseName = document.getElementById('expense-name').value;
    const expenseAmount = parseFloat(document.getElementById('expense-amount').value);
    const expenseDate = document.getElementById('expense-date').value;
    const expenseCategory = document.getElementById('expense-category').value;

    if (expenseName && !isNaN(expenseAmount) && expenseDate && expenseCategory) {
        const expense = { name: expenseName, amount: expenseAmount, date: expenseDate, category: expenseCategory };
        
        if (editingIndex !== null) {
            // Update existing expense
            expenses[editingIndex] = expense;
            editingIndex = null; // Reset index after editing
            showAlert(`Edited expense: ${expenseName} - ₹${expenseAmount}`);
        } else {
            // Add new expense
            expenses.push(expense);
            showAlert(`Added expense: ${expenseName} - ₹${expenseAmount}`);
        }

        localStorage.setItem('expenses', JSON.stringify(expenses));
        displayExpenses();
        updateTotal();
        displaySummary();
        this.reset();
    }
});

// Alert functionality
function showAlert(message) {
    const alertMessage = document.getElementById('alert-message');
    alertMessage.innerText = message;
    alertMessage.style.display = 'block';
    setTimeout(() => {
        alertMessage.style.opacity = '0'; 
        setTimeout(() => {
            alertMessage.style.display = 'none'; 
            alertMessage.style.opacity = '1'; 
        }, 500); 
    }, 3000);
}

document.getElementById('filter-button').addEventListener('click', function() {
    const selectedCategory = document.getElementById('filter-category').value;
    displayExpenses(selectedCategory);
});

function displayExpenses(filter = '') {
    const expenseList = document.getElementById('expense-list');
    expenseList.innerHTML = '';

    const filteredExpenses = filter ? expenses.filter(exp => exp.category === filter) : expenses;

    filteredExpenses.forEach((expense, index) => {
        const li = document.createElement('li');
        li.innerHTML = `${expense.name} (₹${expense.amount.toFixed(2)}) - ${expense.category} on ${new Date(expense.date).toLocaleDateString()}
                        <button onclick="editExpense(${index})">Edit</button>
                        <button onclick="removeExpense(${index})">Remove</button>`;
        expenseList.appendChild(li);
    });
}

function editExpense(index) {
    const expense = expenses[index];
    document.getElementById('expense-name').value = expense.name;
    document.getElementById('expense-amount').value = expense.amount;
    document.getElementById('expense-date').value = expense.date;
    document.getElementById('expense-category').value = expense.category;

    editingIndex = index; // Set the editing index
}

function removeExpense(index) {
    expenses.splice(index, 1);
    localStorage.setItem('expenses', JSON.stringify(expenses));
    displayExpenses();
    updateTotal();
    displaySummary();
}

function updateTotal() {
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    document.getElementById('total-amount').innerText = total.toFixed(2);
}

function displaySummary() {
    const summaryDiv = document.getElementById('expense-summary');
    summaryDiv.innerHTML = '';

    const summary = expenses.reduce((acc, expense) => {
        if (!acc[expense.category]) {
            acc[expense.category] = 0;
        }
        acc[expense.category] += expense.amount;
        return acc;
    }, {});

    const isDarkMode = document.body.classList.contains('dark-mode');

    for (const category in summary) {
        const p = document.createElement('p');
        p.innerText = `${category}: ₹${summary[category].toFixed(2)}`;
        p.style.color = isDarkMode ? '#000000' : '#f8c94c';
        summaryDiv.appendChild(p);
    }
}

displayExpenses();
updateTotal();
displaySummary();
