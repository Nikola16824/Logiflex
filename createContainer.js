import fetch from "node-fetch";

// Replace with your actual Supabase URL & API Key
const SUPABASE_URL = "https://mrfrpiwrrcfdigedzjln.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1yZnJwaXdycmNmZGlnZWR6amxuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMzM4OTAzMCwiZXhwIjoyMDQ4OTY1MDMwfQ.aqWuKuL1W_PfRKeuqN5QrY-eoQXAO7xUm5Z3O_TYE9Y";

async function createContainer() {
  const url = `${SUPABASE_URL}/rest/v1/containers`;

  const newContainer = {
    number: "ZMOU2222333", // Example container number
    order_id: 4821,
    status: "new",
    size: 40,
    type: "HC",
    is_empty: false,
    is_hazmat: false,
    is_overweight: false,
    pickup: "2025-03-01",
    return: "2025-03-10",
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      Prefer: "return=representation", // This ensures we get the created record back
    },
    body: JSON.stringify(newContainer),
  });

  const data = await response.json();
  console.log("Created Container:", data);
}

createContainer();
