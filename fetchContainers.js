// Fetch container data from the API
async function fetchContainers() {
    try {
        const response = await fetch("https://mrfrpiwrrcfdigedzjln.supabase.co/rest/v1/containers", {
            method: "GET",
            headers: {
                "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1yZnJwaXdycmNmZGlnZWR6amxuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMzM4OTAzMCwiZXhwIjoyMDQ4OTY1MDMwfQ.aqWuKuL1W_PfRKeuqN5QrY-eoQXAO7xUm5Z3O_TYE9Y",
                "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1yZnJwaXdycmNmZGlnZWR6amxuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMzM4OTAzMCwiZXhwIjoyMDQ4OTY1MDMwfQ.aqWuKuL1W_PfRKeuqN5QrY-eoQXAO7xUm5Z3O_TYE9Y`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error("Failed to fetch containers");
        }

        const containers = await response.json();
        populateTable(containers);
    } catch (error) {
        console.error("Error fetching containers:", error);
    }
}

// Function to populate the table with container data
let containers = [];  // Store API data
let currentPage = 1;
const itemsPerPage = 10; // Change from 5 to 10

// Function to display the current page of containers
function populateTable(containers) {
    const tableBody = document.getElementById("container-table-body");
    tableBody.innerHTML = ""; // Clear table

    // Calculate the start and end index for the current page
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedContainers = containers.slice(startIndex, endIndex);

    paginatedContainers.forEach(container => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td class="checkbox-column">
                <input type="checkbox" class="select-checkbox row-checkbox" 
                       value="${container.container_id}" 
                       onchange="updateDeleteButton()">
            </td>
            <td>${container.container_id}</td>
            <td>${container.order_id || "N/A"}</td>
            <td>${container.order_status ? container.order_status : "Pending"}</td>
            <td>${container.size || "Unknown"}</td>
            <td>${container.type || "Unknown"}</td>
            <td>${container.pickup || "Not Assigned"}</td>
            <td>${container.lfd || "N/A"}</td>
            <td>${container.terminal || "Unknown"}</td>
        `;

        tableBody.appendChild(row);
    });

    // Update total records count
    document.getElementById("recordsCount").textContent = `${containers.length} records`;
}

// Fetch containers and initialize pagination
async function fetchContainers() {
    try {
        const response = await fetch("https://mrfrpiwrrcfdigedzjln.supabase.co/rest/v1/containers", {
            headers: {
                "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1yZnJwaXdycmNmZGlnZWR6amxuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMzM4OTAzMCwiZXhwIjoyMDQ4OTY1MDMwfQ.aqWuKuL1W_PfRKeuqN5QrY-eoQXAO7xUm5Z3O_TYE9Y",  
                "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1yZnJwaXdycmNmZGlnZWR6amxuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMzM4OTAzMCwiZXhwIjoyMDQ4OTY1MDMwfQ.aqWuKuL1W_PfRKeuqN5QrY-eoQXAO7xUm5Z3O_TYE9Y"
            }
        });
        if (!response.ok) throw new Error("Failed to fetch data");

        containers = await response.json();
        currentPage = 1; // Reset to first page
        populateTable(containers);
    } catch (error) {
        console.error("Error fetching containers:", error);
    }
}

// Pagination button event listeners
document.getElementById("prevPage").addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        populateTable(containers);
    }
});

document.getElementById("nextPage").addEventListener("click", () => {
    if (currentPage < Math.ceil(containers.length / itemsPerPage)) {
        currentPage++;
        populateTable(containers);
    }
});

// Load containers when the page loads
document.addEventListener("DOMContentLoaded", fetchContainers);

