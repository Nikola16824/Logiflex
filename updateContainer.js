import fetch from 'node-fetch';

// Supabase API URL
const API_URL = "https://mrfrpiwrrcfdigedzjln.supabase.co/rest/v1/containers";

// Supabase API Key (replace with your actual key)
const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1yZnJwaXdycmNmZGlnZWR6amxuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMzM4OTAzMCwiZXhwIjoyMDQ4OTY1MDMwfQ.aqWuKuL1W_PfRKeuqN5QrY-eoQXAO7xUm5Z3O_TYE9Y";

// Function to update a container
async function updateContainer(containerId, updates) {
    const response = await fetch(`${API_URL}?container_id=eq.${containerId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "apikey": API_KEY,
            "Authorization": `Bearer ${API_KEY}`,
            "Prefer": "return=representation" // Returns updated data
        },
        body: JSON.stringify(updates)
    });

    if (!response.ok) {
        console.error("Error updating container:", await response.text());
        return;
    }

    const updatedContainer = await response.json();
    console.log("Updated Container:", updatedContainer);
}

// Example: Update container #1847
updateContainer(1848, {
    status: "Dispatched",
    order_id: 1030
});
