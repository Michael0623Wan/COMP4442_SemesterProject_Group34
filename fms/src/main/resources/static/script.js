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
            localStorage.setItem("username", username);
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

function getCurrentUsername() {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
        return storedUsername;
    }

    const authHeader = getAuthHeader();
    if (!authHeader || !authHeader.startsWith("Basic ")) {
        return null;
    }

    try {
        const decoded = atob(authHeader.substring(6));
        return decoded.split(":")[0] || null;
    } catch {
        return null;
    }
}

function requireAuth() {
    const authHeader = getAuthHeader();
    const username = getCurrentUsername();

    if (!authHeader || !username) {
        window.location.href = "/index.html";
        return null;
    }

    return { authHeader, username };
}

function showMessage(text) {
    const message = document.getElementById("message");
    if (message) {
        message.innerText = text;
        return;
    }

    alert(text);
}

// ===== Logout =====
function logout() {
    localStorage.removeItem("auth");
    localStorage.removeItem("username");
    window.location.href = "index.html";
}

// ===== File upload =====
function uploadFile() {
    const session = requireAuth();
    if (!session) {
        return;
    }

    const fileInput = document.getElementById("fileUpload");
    const file = fileInput.files[0];

    if (!file) {
        showMessage("Please choose a file first.");
        return;
    }

    const formData = new FormData();
    formData.append("file", file);

    fetch(`/api/files/upload?username=${encodeURIComponent(session.username)}`, {
        method: "POST",
        headers: {
            "Authorization": session.authHeader
        },
        body: formData
    })
    .then(async res => {
        const text = await res.text();
        if (!res.ok) {
            throw new Error(text || "Upload failed.");
        }

        return text;
    })
    .then(msg => {
        showMessage(msg || "Upload successful.");
        fileInput.value = "";
        loadFiles();
    })
    .catch(err => {
        showMessage(err.message || "Upload failed.");
    });
}

// ===== Load files =====
function loadFiles() {
    const session = requireAuth();
    if (!session) {
        return;
    }

    const tableBody = document.getElementById("fileTableBody");
    
    fetch(`/api/files?username=${encodeURIComponent(session.username)}`, {
        headers: {
            "Authorization": session.authHeader
        }
    })
    .then(async res => {
        if (!res.ok) {
            throw new Error("Error loading files.");
        }

        return res.json();
    })
    .then(files => {
        tableBody.innerHTML = files.map(file => `
            <tr>
                <td>${file.id}</td>
                <td>${file.originalFilename || "Unnamed file"}</td>
                <td>
                    <button onclick="downloadFile(${file.id})">Download</button>
                    <button onclick="deleteFile(${file.id})">Delete</button>
                </td>
            </tr>
        `).join("");
    })
    .catch(() => {
        tableBody.innerHTML = "<tr><td colspan='3'>Error loading files.</td></tr>";
    });
}

// ===== Download file =====
function downloadFile(id) {
    const session = requireAuth();
    if (!session) {
        return;
    }

    fetch(`/api/files/${id}/download?username=${encodeURIComponent(session.username)}`, {
        headers: {
            "Authorization": session.authHeader
        }
    })
    .then(async res => {
        if (!res.ok) {
            throw new Error("Download failed.");
        }

        return {
            blob: await res.blob(),
            disposition: res.headers.get("Content-Disposition")
        };
    })
    .then(({ blob, disposition }) => {
        const filenameMatch = disposition && disposition.match(/filename="?([^\"]+)"?/);
        const filename = filenameMatch ? filenameMatch[1] : `file-${id}`;
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
    })
    .catch(err => {
        showMessage(err.message || "Download failed.");
    });
}

function deleteFile(id) {
    const session = requireAuth();
    if (!session) {
        return;
    }

    fetch(`/api/files/${id}?username=${encodeURIComponent(session.username)}`, {
        method: "DELETE",
        headers: {
            "Authorization": session.authHeader
        }
    })
    .then(async res => {
        const text = await res.text();
        if (!res.ok) {
            throw new Error(text || "Delete failed.");
        }

        return text;
    })
    .then(msg => {
        showMessage(msg || "File deleted successfully.");
        loadFiles();
    })
    .catch(err => {
        showMessage(err.message || "Delete failed.");
    });
}
