const SUPABASE_URL = 'https://kmhqitfsrgcxdpnmtyte.supabase.co';
const SUPABASE_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImttaHFpdGZzcmdjeGRwbm10eXRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg0NDYwNTMsImV4cCI6MjA0NDAyMjA1M30.YR7TGg8XD0cremBaeRzozSjQ9QkAWJd2KF7abEDBE1A';
const db = supabase.createClient(SUPABASE_URL, SUPABASE_API_KEY);
function getUserId() {
    let userId = localStorage.getItem('user_id');
    if (!userId) {
        userId = 'user_' + Date.now(); // Generate a unique ID
        localStorage.setItem('user_id', userId);
    }
    return userId;
}


// document.getElementById('expense-form').addEventListener('submit', async (event) => {
//     event.preventDefault();
//     const name = document.getElementById('expense-name').value;
//     const amount = document.getElementById('expense-amount').value;
//     const date = document.getElementById('expense-date').value;
//     const category = document.getElementById('expense-category').value;
//     const { data, error } = await db
//         .from('users_1')
//         .insert([{ name, amount, date, category }]);
// });
// document.getElementById('expense-form').addEventListener('submit', async function (event) {
//     event.preventDefault();
//     const expenseName = document.getElementById('expense-name').value;
//     const expenseAmount = parseFloat(document.getElementById('expense-amount').value);
//     const expenseDate = document.getElementById('expense-date').value;
//     const expenseCategory = document.getElementById('expense-category').value;

//     if (expenseName && !isNaN(expenseAmount) && expenseDate && expenseCategory) {
//         const { data, error } = await db
//             .from('users_1')
//             .insert([{ name: expenseName, amount: expenseAmount, date: expenseDate, category: expenseCategory }])
//             .single();

//         if (error) {
//             console.error('Error adding expense to Supabase:', error);
//             showAlert('Error adding expense. Please try again.', true);
//             return;
//         }
//         expenses.push({ ...data, amount: expenseAmount }); 
//         localStorage.setItem('expenses', JSON.stringify(expenses));
//         updateTotal();
//         displayExpenses();
//         displaySummary();
//         updateChart();
//         this.reset();
//         showToast('Expense added successfully!');
//     }
// });

//second code that works
// document.getElementById('expense-form').addEventListener('submit', async function (event) {
//     event.preventDefault();
//     const expenseName = document.getElementById('expense-name').value;
//     const expenseAmount = parseFloat(document.getElementById('expense-amount').value);
//     const expenseDate = document.getElementById('expense-date').value;
//     const expenseCategory = document.getElementById('expense-category').value;

//     if (expenseName && !isNaN(expenseAmount) && expenseDate && expenseCategory) {
//         const { data, error } = await db
//             .from('users_1')
//             .insert([{ name: expenseName, amount: expenseAmount, date: expenseDate, category: expenseCategory }])
//             .single(); // Use .single() to get the inserted row

//         if (error) {
//             console.error('Error adding expense to Supabase:', error);
//             showAlert('Error adding expense. Please try again.', true);
//             return;
//         }

//         // Ensure the new expense includes all necessary properties
//         const newExpense = {
//             id: data.id, // Assuming `data` includes the new ID
//             name: data.name,
//             amount: expenseAmount, // Use the local value for amount
//             date: expenseDate,
//             category: expenseCategory
//         };

//         // Add the new expense to the local array
//         expenses.push(newExpense);
//         localStorage.setItem('expenses', JSON.stringify(expenses));
//         updateTotal();
//         displayExpenses();
//         displaySummary();
//         updateChart();
//         this.reset();
//         showToast('Expense added successfully!');
//     }
// });

// document.getElementById('expense-form').addEventListener('submit', async function (event) {
//     event.preventDefault();
//     const userId = getUserId(); // Get the user ID
//     const expenseName = document.getElementById('expense-name').value;
//     const expenseAmount = parseFloat(document.getElementById('expense-amount').value);
//     const expenseDate = document.getElementById('expense-date').value;
//     const expenseCategory = document.getElementById('expense-category').value;

//     if (expenseName && !isNaN(expenseAmount) && expenseDate && expenseCategory) {
//         const { data, error } = await db
//     .from('users_1')
//     .insert([{ 
//         name: expenseName, 
//         amount: expenseAmount, 
//         date: expenseDate, 
//         category: expenseCategory, 
//         user_id: userId
//     }])
//     .single();


//         if (error) {
//             console.error('Error adding expense to Supabase:', error);
//         } else {
//             console.log('Inserted Expense:', data);
//         }


//         // Add the new expense to the local array
//         expenses.push({ ...data, amount: expenseAmount });
//         localStorage.setItem('expenses', JSON.stringify(expenses));
//         updateTotal();
//         displayExpenses(userId); // Pass user ID to display function
//         displaySummary();
//         updateChart();
//         this.reset();
//         showToast('Expense added successfully!');
//     }
// });

document.getElementById('expense-form').addEventListener('submit', async function (event) {
    event.preventDefault();
    
    const expenseName = document.getElementById('expense-name').value;
    const expenseAmount = parseFloat(document.getElementById('expense-amount').value);
    const expenseDate = document.getElementById('expense-date').value;
    const expenseCategory = document.getElementById('expense-category').value;

    if (expenseName && !isNaN(expenseAmount) && expenseDate && expenseCategory) {
        const userId = getUserId(); // Ensure you have a way to get the user ID

        // Add expense to Supabase
        const { data, error } = await db
            .from('users_1')
            .insert([{ 
                user_id: userId, 
                name: expenseName, 
                amount: expenseAmount, 
                date: expenseDate, 
                category: expenseCategory 
            }]);

        if (error) {
            console.error('Error adding expense:', error);
            showAlert('Error adding expense. Please try again.');
        } else {
            console.log('Expense added:', data);
            await fetchExpenses(); // Fetch the latest expenses after adding
            this.reset(); // Reset the form fields
        }
    }
});



async function fetchExpenses() {
    const userId = getUserId();
    console.log("Fetching expenses for User ID:", userId);

    const { data, error } = await db
        .from('users_1')
        .select('*')
        .eq('user_id', userId);

    if (error) {
        console.error('Error fetching expenses:', error);
        showAlert('Error fetching expenses. Please try again.');
        return;
    }

    console.log('Raw data fetched from the database:', data);

    // Reset expenses array before processing
    expenses = [];

    // Process the fetched expenses and filter out invalid entries
    expenses = data
        .map(exp => ({
            ...exp,
            amount: parseFloat(exp.amount) || 0
        }))
        .filter(exp => exp.name && !isNaN(exp.amount) && exp.date && exp.category);

    console.log('Processed expenses after filtering:', expenses);

    // Store expenses in local storage and display them
    localStorage.setItem('expenses', JSON.stringify(expenses));
    displayExpenses(); // Show the expenses
    updateTotal(); // Update the total expenses
    updateChart(); // Update the chart if necessary
    displaySummary(); // Update the summary display
}







//second code that works
// async function fetchExpenses() {
//     const { data, error } = await db.from('users_1').select('*');
//     if (error) {
//         console.error('Error fetching expenses:', error);
//         showAlert('Error fetching expenses. Please try again.');
//     } else {
//         expenses = data.map(exp => ({
//             ...exp,
//             amount: parseFloat(exp.amount) || 0
//         }));
//         localStorage.setItem('expenses', JSON.stringify(expenses));
//         displayExpenses();
//         updateTotal();
//         updateChart();
//         displaySummary();
//     }
// }
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
let expenseChart;
const toggleButton = document.getElementById('toggle-dark-mode');
const body = document.body;
const container = document.querySelector('.container');

toggleButton.addEventListener('change', () => {
    const isDarkMode = body.classList.toggle('dark-mode');
    container.classList.toggle('dark-mode');
    updateChart();
});

function updateChart() {
    const summaryData = {};
    const spendingTrendsHeading = document.getElementById('spending-trends-heading');
    if (expenses.length === 0) {
        document.getElementById('expense-chart').style.display = 'none';
        spendingTrendsHeading.style.display = 'none';
        return;
    } else {
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

function displayExpenses() {
    const expenseList = document.getElementById('expense-list');
    expenseList.innerHTML = ''; // Clear previous list

    expenses.forEach((expense, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${expense.name} (₹${expense.amount.toFixed(2)}) - ${expense.category} on ${new Date(expense.date).toLocaleDateString()}
            <div>
                <button onclick="editExpense(${index})">Edit</button>
                <button onclick="removeExpense(${index})">Remove</button>
            </div>`;
        expenseList.appendChild(li);
    });
}



//second code that worked
// function displayExpenses(filter = '') {
//     const expenseList = document.getElementById('expense-list');
//     expenseList.innerHTML = '';

//     const filteredExpenses = filter ? expenses.filter(exp => exp.category === filter) : expenses;

//     filteredExpenses.forEach((expense, index) => {
//         const li = document.createElement('li');
//         li.innerHTML = `
//     ${expense.name} (₹${typeof expense.amount === 'number' ? expense.amount.toFixed(2) : 'Invalid Amount'}) - ${expense.category} on ${new Date(expense.date).toLocaleDateString()}
//     <div >
//         <button onclick="editExpense(${index})">Edit</button>
//         <button onclick="removeExpense(${index})">Remove</button>
//     </div>`;
//         expenseList.appendChild(li);
//     });
// }

function editExpense(index) {
    const expense = expenses[index];
    document.getElementById('expense-name').value = expense.name;
    document.getElementById('expense-amount').value = expense.amount;
    document.getElementById('expense-date').value = expense.date;
    document.getElementById('expense-category').value = expense.category;

    removeExpense(index);
}

document.getElementById('expense-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const expenseName = document.getElementById('expense-name').value;
    const expenseAmount = parseFloat(document.getElementById('expense-amount').value);
    const expenseDate = document.getElementById('expense-date').value;
    const expenseCategory = document.getElementById('expense-category').value;

    if (expenseName && !isNaN(expenseAmount) && expenseDate && expenseCategory) {
        const expense = { name: expenseName, amount: expenseAmount, date: expenseDate, category: expenseCategory };
        expenses.push(expense);
        localStorage.setItem('expenses', JSON.stringify(expenses));
        updateTotal();
        displayExpenses();
        displaySummary();
        updateChart();
        this.reset();
    }
});

// function removeExpense(index) {
//     expenses.splice(index, 1);
//     localStorage.setItem('expenses', JSON.stringify(expenses));
//     displayExpenses();
//     updateTotal();
//     displaySummary();
//     updateChart();
// }
async function removeExpense(index) {
    const expense = expenses[index];


    const { data, error } = await db
        .from('users_1')
        .delete()
        .eq('id', expense.id);

    if (error) {
        console.error('Error removing expense from Supabase:', error);
        showAlert('Error removing expense. Please try again.', true);
        return;
    }
    expenses.splice(index, 1);
    localStorage.setItem('expenses', JSON.stringify(expenses));
    displayExpenses();
    updateTotal();
    displaySummary();
    updateChart();
}


function updateTotal() {
    const totalAmount = expenses.reduce((total, exp) => {
        const amount = parseFloat(exp.amount);
        return total + (isNaN(amount) ? 0 : amount);
    }, 0);
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

document.getElementById('expense-form').addEventListener('submit', function (event) {
    showToast('Expense added successfully!');
});

function showAlert(message, isError = true) {
    const alertMessage = document.getElementById('alert-message');
    alertMessage.innerHTML = message;
    alertMessage.style.display = 'block';
    alertMessage.className = isError ? 'alert alert-error' : 'alert alert-success';

    setTimeout(() => {
        alertMessage.style.display = 'none';
    }, 3000);
}

fetchExpenses();