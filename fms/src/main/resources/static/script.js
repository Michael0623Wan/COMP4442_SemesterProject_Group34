// ===== Register =====
function register() {
    console.log("register() called");
    const username = document.getElementById("registerUsername").value;
    const password = document.getElementById("registerPassword").value;

    fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    })
    .then(res => res.text())
    .then(msg => {
        alert(msg);
        usernameInput.value = "";
        passwordInput.value = "";
    })
    .catch(() => alert("Registration error"));

}

function login() {
    const username = document.getElementById("loginUsername").value;
    const password = document.getElementById("loginPassword").value;

    const authHeader = "Basic " + btoa(username + ":" + password);

    fetch("/api/auth/check", {
        method: "GET",
        headers: {
            "Authorization": authHeader
        }
    })
    .then(res => {
        if (res.ok) {
            localStorage.setItem("auth", authHeader);
            usernameInput.value = "";
            passwordInput.value = "";
            window.location.href = "/dashboard.html";
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

