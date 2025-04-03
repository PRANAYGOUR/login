// Function to Fetch User Profile Data from Google Sheets
async function fetchUserProfile() {
    const sheetID = "1qf9dzQUAgSateFjpU9fs6JYrjkIo9T1_peEiXSaMg5I";
    const apiKey = "AIzaSyC-vs4GAthKrNahNVJ6qwYZ0BFpAPAnad8";
    const sheetName = "data";
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/${sheetName}?key=${apiKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch user data.");

        const data = await response.json();
        const rows = data.values;
        if (!rows || rows.length < 2) throw new Error("No user data found.");

        const headers = rows[0].map(header => header.trim().toLowerCase());
        const emailFromLocalStorage = localStorage.getItem("userEmail");

        const emailIndex = headers.indexOf("email");
        const nameIndex = headers.indexOf("name");
        const photoIndex = headers.indexOf("photo");

        if (emailIndex === -1 || nameIndex === -1 || photoIndex === -1) throw new Error("Required columns not found.");

        const userData = rows.find(row => row[emailIndex]?.trim().toLowerCase() === emailFromLocalStorage.toLowerCase());
        if (!userData) throw new Error("User not found.");

        document.getElementById("userName").textContent = userData[nameIndex] || "User";
        document.getElementById("userPhoto").src = userData[photoIndex] || "./assets/default-user.png";
    } catch (error) {
        console.error("Error loading user profile:", error);
    }
}

// Logout Function
function logout() {
    localStorage.removeItem("userEmail");
    window.location.href = "index.html";
}

// Add Event Listeners
document.addEventListener("DOMContentLoaded", fetchUserProfile);
document.getElementById("logoutBtn").addEventListener("click", logout);
