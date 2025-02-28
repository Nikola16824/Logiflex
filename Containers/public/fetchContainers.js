let currentPage = 1;
const itemsPerPage = 10;
let containers = [];

async function fetchContainers() {
    try {
        // First get all containers
        const containersResponse = await fetch("https://mrfrpiwrrcfdigedzjln.supabase.co/rest/v1/containers", {
            headers: {
                "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1yZnJwaXdycmNmZGlnZWR6amxuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMzM4OTAzMCwiZXhwIjoyMDQ4OTY1MDMwfQ.aqWuKuL1W_PfRKeuqN5QrY-eoQXAO7xUm5Z3O_TYE9Y",
                "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1yZnJwaXdycmNmZGlnZWR6amxuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMzM4OTAzMCwiZXhwIjoyMDQ4OTY1MDMwfQ.aqWuKuL1W_PfRKeuqN5QrY-eoQXAO7xUm5Z3O_TYE9Y`,
                "Content-Type": "application/json"
            }
        });

        // Get order statuses
        const orderStatusResponse = await fetch("https://mrfrpiwrrcfdigedzjln.supabase.co/rest/v1/order_status", {
            headers: {
                "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1yZnJwaXdycmNmZGlnZWR6amxuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMzM4OTAzMCwiZXhwIjoyMDQ4OTY1MDMwfQ.aqWuKuL1W_PfRKeuqN5QrY-eoQXAO7xUm5Z3O_TYE9Y",
                "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1yZnJwaXdycmNmZGlnZWR6amxuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMzM4OTAzMCwiZXhwIjoyMDQ4OTY1MDMwfQ.aqWuKuL1W_PfRKeuqN5QrY-eoQXAO7xUm5Z3O_TYE9Y`,
                "Content-Type": "application/json"
            }
        });

        // Get orders to link containers to statuses
        const ordersResponse = await fetch("https://mrfrpiwrrcfdigedzjln.supabase.co/rest/v1/orders", {
            headers: {
                "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1yZnJwaXdycmNmZGlnZWR6amxuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMzM4OTAzMCwiZXhwIjoyMDQ4OTY1MDMwfQ.aqWuKuL1W_PfRKeuqN5QrY-eoQXAO7xUm5Z3O_TYE9Y",
                "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1yZnJwaXdycmNmZGlnZWR6amxuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMzM4OTAzMCwiZXhwIjoyMDQ4OTY1MDMwfQ.aqWuKuL1W_PfRKeuqN5QrY-eoQXAO7xUm5Z3O_TYE9Y`,
                "Content-Type": "application/json"
            }
        });

        if (!containersResponse.ok || !orderStatusResponse.ok || !ordersResponse.ok) {
            throw new Error("Failed to fetch data");
        }

        const [containersData, orderStatusData, ordersData] = await Promise.all([
            containersResponse.json(),
            orderStatusResponse.json(),
            ordersResponse.json()
        ]);

        // Create a map of id to status name
        const statusMap = new Map(orderStatusData.map(status => [status.id, status.name]));

        // Create a map of order_id to status_id
        const orderMap = new Map(ordersData.map(order => [order.order_id, order.status_id]));

        // Add status to containers
        containers = containersData.map(container => {
            const statusId = orderMap.get(container.order_id);
            const statusName = statusId ? statusMap.get(statusId) : "Pending";
            return {
                ...container,
                orderStatus: statusName
            };
        });

        console.log('Containers with status:', containers);
        populateTable(containers);
    } catch (error) {
        console.error("Error fetching data:", error);
        document.getElementById("container-table-body").innerHTML = 
            `<tr><td colspan="10">Error loading containers: ${error.message}</td></tr>`;
    }
}

function populateTable(containers) {
    const tableBody = document.getElementById("container-table-body");
    tableBody.innerHTML = ""; // Clear table

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
            <td>${container.number || "N/A"}</td>
            <td>${container.order_id || "N/A"}</td>
            <td>${container.orderStatus}</td>
            <td>${container.size || "Unknown"}</td>
            <td>${container.type || "Unknown"}</td>
            <td>${container.pickup || "Not Assigned"}</td>
            <td class="center-column">-</td>
            <td class="center-column">-</td>
        `;
        tableBody.appendChild(row);
    });

    // Update total records count
    document.getElementById("recordsCount").textContent = `${containers.length} records`;

    // Update pagination buttons visibility
    const prevButton = document.getElementById("prevPage");
    const nextButton = document.getElementById("nextPage");
    
    prevButton.style.display = currentPage <= 1 ? "none" : "block";
    nextButton.style.display = currentPage >= Math.ceil(containers.length / itemsPerPage) ? "none" : "block";
}

// Add event listeners for pagination
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