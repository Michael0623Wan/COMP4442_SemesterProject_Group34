const API_BASE = "http://localhost:8080";

// ===== Register =====
function register() {
    const username = document.getElementById("registerUsername").value;
    const password = document.getElementById("registerPassword").value;

    fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    })
    .then(res => res.text())
    .then(msg => alert(msg))
    .catch(() => alert("Registration error"));
}

// ===== Login (HTTP Basic Auth) =====
function login() {
    const username = document.getElementById("loginUsername").value;
    const password = document.getElementById("loginPassword").value;

    const authHeader = "Basic " + btoa(username + ":" + password);

    // Call ANY protected API to validate login
    fetch(`${API_BASE}/api/files`, {
        method: "GET",
        headers: {
            "Authorization": authHeader
        }
    })
    .then(res => {
        if (res.status === 200) {
            localStorage.setItem("auth", authHeader);
            window.location.href = "dashboard.html";
        } else {
            alert("Invalid username or password");
        }
    })
    .catch(() => alert("Login failed"));
}

// ===== Auth header helper =====
function getAuthHeader() {
    return localStorage.getItem("auth");
}

// ===== Logout =====
function logout() {
    localStorage.removeItem("auth");
    window.location.href = "index.html";
}
``
