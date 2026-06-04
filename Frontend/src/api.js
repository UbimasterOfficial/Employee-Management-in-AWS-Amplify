const DEFAULT_DEV_API = "http://localhost:5001/api/users";
const DEFAULT_PROD_API = "http://100.29.211.141:5001/api/users";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? DEFAULT_DEV_API : DEFAULT_PROD_API);

async function handleResponse(response) {
  if (!response.ok) {
    let message = "Something went wrong";
    try {
      const data = await response.json();
      message = data.message || message;
    } catch (error) {
      message = "Failed to parse server response";
    }
    throw new Error(message);
  }
  return response.json();
}

function normalizeEmployeeList(data) {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.users)) return data.users;
  if (data && Array.isArray(data.data)) return data.data;
  const hint =
    data && typeof data.message === "string"
      ? ` Server replied: "${data.message}".`
      : "";
  throw new Error(
    `Expected a list of employees from the API.${hint} Check that VITE_API_URL ends with /api/users (current: ${API_BASE_URL}).`
  );
}

export function getEmployees() {
  return fetch(API_BASE_URL)
    .then(handleResponse)
    .then(normalizeEmployeeList);
}

export function getEmployeeById(id) {
  return fetch(`${API_BASE_URL}/${id}`).then(handleResponse);
}

export function createEmployee(payload) {
  return fetch(API_BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).then(handleResponse);
}

export function updateEmployee(id, payload) {
  return fetch(`${API_BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).then(handleResponse);
}

export function deleteEmployee(id) {
  return fetch(`${API_BASE_URL}/${id}`, {
    method: "DELETE",
  }).then(handleResponse);
}
