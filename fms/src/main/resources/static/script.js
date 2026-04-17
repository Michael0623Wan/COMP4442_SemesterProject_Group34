function register(event) {
    event.preventDefault();

    const usernameInput = document.getElementById("registerUsername");
    const passwordInput = document.getElementById("registerPassword");

    const username = usernameInput.value;
    const password = passwordInput.value;

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
    .catch(err => {
        console.error(err);
        alert("Registration error");
    });
}

function login(event) {
    event.preventDefault();

    const usernameInput = document.getElementById("loginUsername");
    const passwordInput = document.getElementById("loginPassword");

    const username = usernameInput.value;
    const password = passwordInput.value;

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
    .catch(err => {
        console.error(err);
        alert("Login failed");
    });
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

// ===== File upload =====
function uploadFile() {
    const fileInput = document.getElementById("fileUpload");
    const file = fileInput.files[0];

    const formData = new FormData();
    formData.append("file", file);

    fetch("/api/files/upload", {
        method: "POST",
        headers: {
            "Authorization": getAuthHeader()
        },
        body: formData
    })
    .then(res => res.text())
    .then(msg => {
        message.innerText = msg || "Upload successful.";
        fileInput.value = "";
        loadFiles();
    })
    .catch(() => {
        message.innerText = "Upload failed.";
    });
}

// ===== Load files =====
function loadFiles() {
    const tableBody = document.getElementById("fileTableBody");
    
    fetch("/api/files", {
        headers: {
            "Authorization": getAuthHeader()
        }
    })
    .then(res => res.json())
    .then(files => {

        tableBody.innerHTML = files.map(file => `
            <tr>
                <td>${file.id}</td>
                <td>${file.filename || file.originalName || "Unnamed file"}</td>
                <td><button onclick="downloadFile(${file.id})">Download</button></td>
            </tr>
        `).join("");
    })
    .catch(() => {
        tableBody.innerHTML = "<tr><td colspan='3'>Error loading files.</td></tr>";
    });
}

// ===== Download file =====
function downloadFile(id) {
    window.open(`/api/files/download/${id}`, "_blank");
}
