let data = [];
let currentSheet = 'dispatch';

const sheetUrls = {
    dispatch: 'https://your-google-sheet-dispatch-url.csv',
    sales: 'https://your-google-sheet-sales-url.csv',
    inventory: 'https://your-google-sheet-inventory-url.csv',
};

const dateColumns = {
    dispatch: 0,   // Assuming Date column is at index 0 for Dispatch
    sales: 1,      // Assuming Date column is at index 1 for Sales
    inventory: 2,  // Assuming Date column is at index 2 for Inventory
};

// Fetch CSV data from Google Sheet
async function fetchCSVData(sheetUrl) {
    const response = await fetch(sheetUrl);
    const data = await response.text();
    return data.split('\n').map(row => row.split(','));
}

// Load data from the selected sheet
async function loadData() {
    const sheet = document.getElementById('sheetSelector').value;
    currentSheet = sheet;
    const sheetUrl = sheetUrls[sheet];
    data = await fetchCSVData(sheetUrl);
    displayData(data); // Display data without any filter first
}

// Display the fetched data in the table
function displayData(data) {
    const table = document.getElementById('dataTable');
    table.innerHTML = ''; // Clear any existing data

    if (data.length === 0) {
        table.innerHTML = '<tr><td colspan="100%">No data available</td></tr>';
        return;
    }

    const headerRow = document.createElement('tr');
    data[0].forEach(col => {
        const th = document.createElement('th');
        th.textContent = col;
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    data.slice(1).forEach(row => {
        const tr = document.createElement('tr');
        row.forEach(cell => {
            const td = document.createElement('td');
            td.textContent = cell;
            tr.appendChild(td);
        });
        table.appendChild(tr);
    });
}

// Apply date filters to the data
function applyFilters() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    // If no date is selected, show nothing
    if (!startDate || !endDate) {
        displayData([]); // Clear the table
        return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const dateColumnIndex = dateColumns[currentSheet];

    // Filter the data based on the selected sheet and date range
    const filteredData = data.filter(row => {
        const rowDate = new Date(row[dateColumnIndex]);
        return rowDate >= start && rowDate <= end;
    });

    displayData(filteredData); // Display the filtered data
}

// Apply search filter to the data
function applySearchFilter() {
    const searchQuery = document.getElementById('searchBar').value.toLowerCase();

    const filteredData = data.filter(row => {
        return row.some(cell => cell.toLowerCase().includes(searchQuery));
    });

    displayData(filteredData); // Display the filtered data
}

// Initialize page with the default "Dispatch" data
window.onload = () => {
    loadData(); // Load default data (Dispatch)
};
