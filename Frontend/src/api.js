const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/users";

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

export function getEmployees() {
  return fetch(API_BASE_URL).then(handleResponse);
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
