let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

// Dark mode toggle functionality
const toggleButton = document.getElementById('toggle-dark-mode');
const body = document.body;
const container = document.querySelector('.container');
const buttons = document.querySelectorAll('button');

// Function to set button colors based on the mode
function setButtonColors() {
    if (body.classList.contains('dark-mode')) {
        buttons.forEach(button => {
            button.style.backgroundColor = '#e84c3d'; // Orange for dark mode
        });
    } else {
        buttons.forEach(button => {
            button.style.backgroundColor = '#007bff'; // Blue for light mode
        });
    }
}

// Event listener for dark mode toggle
toggleButton.addEventListener('change', () => {
    const isDarkMode = body.classList.toggle('dark-mode');
    container.classList.toggle('dark-mode');
    setButtonColors(); // Update button colors

    // Toggle dark mode on inputs
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
        addExpense(expense);
        showAlert(`Added expense: ${expenseName} - ₹${expenseAmount}`);
        updateTotal();
        displaySummary();
        this.reset();
    }
});

function showAlert(message) {
    const alertMessage = document.getElementById('alert-message');
    alertMessage.innerText = message;
    alertMessage.style.display = 'block';

    setTimeout(() => {
        alertMessage.style.opacity = '0'; // Start fading out
        setTimeout(() => {
            alertMessage.style.display = 'none'; // Hide after fade out
            alertMessage.style.opacity = '1'; // Reset opacity for next alert
        }, 500); // Match this duration to the CSS transition duration
    }, 3000); // Show alert for 3 seconds
}

document.getElementById('filter-button').addEventListener('click', function() {
    const selectedCategory = document.getElementById('filter-category').value;
    displayExpenses(selectedCategory);
});

function addExpense(expense) {
    expenses.push(expense);
    localStorage.setItem('expenses', JSON.stringify(expenses));
    displayExpenses();
}

function displayExpenses(filter = '') {
    const expenseList = document.getElementById('expense-list');
    expenseList.innerHTML = '';

    const filteredExpenses = filter ? expenses.filter(exp => exp.category === filter) : expenses;

    filteredExpenses.forEach((expense, index) => {
        const li = document.createElement('li');
        li.innerHTML = `${expense.name} (₹${expense.amount.toFixed(2)}) - ${expense.category} on ${new Date(expense.date).toLocaleDateString()}
                        <button onclick="removeExpense(${index})">Remove</button>`;
        expenseList.appendChild(li);
    });
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

    for (const category in summary) {
        const p = document.createElement('p');
        p.innerText = `${category}: ₹${summary[category].toFixed(2)}`;
        summaryDiv.appendChild(p);
    }
}

// Initial display
displayExpenses();
updateTotal();
displaySummary();
