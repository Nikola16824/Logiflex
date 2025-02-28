// Supabase API URL
const API_URL = "https://mrfrpiwrrcfdigedzjln.supabase.co/rest/v1/containers";
const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1yZnJwaXdycmNmZGlnZWR6amxuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMzM4OTAzMCwiZXhwIjoyMDQ4OTY1MDMwfQ.aqWuKuL1W_PfRKeuqN5QrY-eoQXAO7xUm5Z3O_TYE9Y";

// Make containerExists function available globally
window.containerExists = async function(containerId) {
    const response = await fetch(`${API_URL}?container_id=eq.${containerId}`, {
        method: "GET",
        headers: {
            "apikey": API_KEY,
            "Authorization": `Bearer ${API_KEY}`
        }
    });

    const data = await response.json();
    return data.length > 0;
}

// Make deleteContainer function available globally
window.deleteContainer = async function(containerId) {
    try {
        const exists = await containerExists(containerId);

        if (!exists) {
            console.log(`Container ${containerId} does not exist. Skipping deletion.`);
            return false;
        }

        const response = await fetch(`${API_URL}?container_id=eq.${containerId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "apikey": API_KEY,
                "Authorization": `Bearer ${API_KEY}`,
                "Prefer": "return=representation"
            }
        });

        if (!response.ok) {
            throw new Error(await response.text());
        }

        console.log(`Container ${containerId} deleted successfully!`);
        return true;
    } catch (error) {
        console.error("Error deleting container:", error);
        throw error;
    }
}

// Example: Try deleting container #1848
deleteContainer(1848);
