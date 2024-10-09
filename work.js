let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
let expenseChart;
const toggleButton = document.getElementById('toggle-dark-mode');
const body = document.body;
const container = document.querySelector('.container');

toggleButton.addEventListener('change', () => {
    const isDarkMode = body.classList.toggle('dark-mode');
    container.classList.toggle('dark-mode');
    updateChart(); // Update the chart with the current data
});

function updateChart() {
    const summaryData = {};

    // Get the spending trends heading element
    const spendingTrendsHeading = document.getElementById('spending-trends-heading');

    // Check if there are expenses
    if (expenses.length === 0) {
        // Hide the chart and the heading
        document.getElementById('expense-chart').style.display = 'none';
        spendingTrendsHeading.style.display = 'none';
        return; // Exit the function
    } else {
        // Show the chart and the heading if there are expenses
        document.getElementById('expense-chart').style.display = 'block';
        spendingTrendsHeading.style.display = 'block';
    }

    expenses.forEach(exp => {
        const date = new Date(exp.date).toLocaleDateString();
        if (!summaryData[date]) {
            summaryData[date] = 0;
        }
        summaryData[date] += exp.amount;
    });

    const summaryLabels = Object.keys(summaryData);
    const summaryValues = Object.values(summaryData);

    if (expenseChart) {
        expenseChart.data.labels = summaryLabels;
        expenseChart.data.datasets[0].data = summaryValues;
        expenseChart.update();
    } else {
        const ctx = document.getElementById('expense-chart').getContext('2d');
        expenseChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: summaryLabels,
                datasets: [{
                    label: 'Expenses',
                    data: summaryValues,
                    borderColor: '#007bff',
                    backgroundColor: 'rgba(0, 123, 255, 0.2)',
                    borderWidth: 2,
                    fill: true,
                }],
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
            },
        });
    }
}

function displayExpenses(filter = '') {
    const expenseList = document.getElementById('expense-list');
    expenseList.innerHTML = '';

    const filteredExpenses = filter ? expenses.filter(exp => exp.category === filter) : expenses;

    filteredExpenses.forEach((expense, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${expense.name} (₹${expense.amount.toFixed(2)}) - ${expense.category} on ${new Date(expense.date).toLocaleDateString()}
            <div >
                <button onclick="editExpense(${index})">Edit</button>
                <button onclick="removeExpense(${index})">Remove</button>
            </div>`;
        expenseList.appendChild(li);
    });
}

function editExpense(index) {
    const expense = expenses[index];
    document.getElementById('expense-name').value = expense.name;
    document.getElementById('expense-amount').value = expense.amount;
    document.getElementById('expense-date').value = expense.date;
    document.getElementById('expense-category').value = expense.category;

    removeExpense(index); // Remove the expense from the array for now
}

document.getElementById('expense-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const expenseName = document.getElementById('expense-name').value;
    const expenseAmount = parseFloat(document.getElementById('expense-amount').value);
    const expenseDate = document.getElementById('expense-date').value;
    const expenseCategory = document.getElementById('expense-category').value;

    if (expenseName && !isNaN(expenseAmount) && expenseDate && expenseCategory) {
        const expense = { name: expenseName, amount: expenseAmount, date: expenseDate, category: expenseCategory };
        expenses.push(expense);
        localStorage.setItem('expenses', JSON.stringify(expenses));
        displayExpenses();
        updateTotal();
        displaySummary();
        updateChart(); // Update the chart with new data
        this.reset();
    }
});

function removeExpense(index) {
    expenses.splice(index, 1);
    localStorage.setItem('expenses', JSON.stringify(expenses));
    displayExpenses();
    updateTotal();
    displaySummary();
    updateChart(); // Update the chart after removal
}

function updateTotal() {
    const totalAmount = expenses.reduce((total, exp) => total + exp.amount, 0);
    document.getElementById('total-amount').innerText = totalAmount.toFixed(2);
}

function displaySummary() {
    const summaryDiv = document.getElementById('expense-summary');
    const summary = {};
    expenses.forEach(exp => {
        if (!summary[exp.category]) {
            summary[exp.category] = 0;
        }
        summary[exp.category] += exp.amount;
    });

    summaryDiv.innerHTML = '';
    for (const category in summary) {
        const p = document.createElement('p');
        p.innerText = `${category}: ₹${summary[category].toFixed(2)}`;
        summaryDiv.appendChild(p);
    }
}

// Dark mode functionality

// Initial display
displayExpenses();
updateTotal();
updateChart();
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerText = message;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.classList.add('fade-out');
    }, 3000);
    setTimeout(() => {
        document.body.removeChild(toast);
    }, 4000);
}

// Call showToast in your event handlers
document.getElementById('expense-form').addEventListener('submit', function(event) {
    // ... existing code ...
    showToast('Expense added successfully!');
});



// const supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY);
const SUPABASE_URL = 'https://kmhqitfsrgcxdpnmtyte.supabase.co';
const SUPABASE_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImttaHFpdGZzcmdjeGRwbm10eXRlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyODQ0NjA1MywiZXhwIjoyMDQ0MDIyMDUzfQ.bOrVrJtT10KF3tARnokjfYQipDCW1FH3vGR2SyRGJR4';
const database = supabase.createClient(SUPABASE_URL, SUPABASE_API_KEY);

// Fetch expenses from Supabase
async function fetchExpenses() {
    const { data, error } = await database
        .from('expenses') // Replace with your actual table name
        .select('*');

    if (error) {
        console.error('Error fetching expenses:', error);
    } else {
        expenses = data;
        localStorage.setItem('expenses', JSON.stringify(expenses));
        displayExpenses();
        updateTotal();
        updateChart();
        displaySummary();
    }
}

// Add expense to Supabase
async function addExpense(expense) {
    const { data, error } = await database
        .from('expenses') // Replace with your actual table name
        .insert([expense]);

    if (error) {
        console.error('Error adding expense:', error);
    }
}

// Remove expense from Supabase
async function removeExpenseFromDB(id) {
    const { data, error } = await database
        .from('expenses') // Replace with your actual table name
        .delete()
        .eq('id', id); // Assuming your table has an 'id' column

    if (error) {
        console.error('Error removing expense:', error);
    }
}

// Event listener for form submission
document.getElementById('expense-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    const expenseName = document.getElementById('expense-name').value;
    const expenseAmount = parseFloat(document.getElementById('expense-amount').value);
    const expenseDate = document.getElementById('expense-date').value;
    const expenseCategory = document.getElementById('expense-category').value;

    if (expenseName && !isNaN(expenseAmount) && expenseDate && expenseCategory) {
        const expense = { name: expenseName, amount: expenseAmount, date: expenseDate, category: expenseCategory };
        await addExpense(expense); // Add to Supabase
        expenses.push(expense); // Also update local expenses
        localStorage.setItem('expenses', JSON.stringify(expenses));
        displayExpenses();
        updateTotal();
        displaySummary();
        updateChart();
        this.reset();
        showToast('Expense added successfully!');
    }
});

// Remove expense function
async function removeExpensed(index) {
    const expense = expenses[index];
    await removeExpenseFromDB(expense.id); // Remove from Supabase
    expenses.splice(index, 1);
    localStorage.setItem('expenses', JSON.stringify(expenses));
    displayExpenses();
    updateTotal();
    displaySummary();
    updateChart(); // Update the chart after removal
}

// Initial fetch of expenses
fetchExpenses();

// Additional existing code...
