document.addEventListener("DOMContentLoaded", async function () {
    const userEmail = localStorage.getItem("userEmail"); // Retrieve email from local storage

    console.log("Logged-in user email:", userEmail); // Debugging

    if (!userEmail) {
        console.error("No logged-in user found.");
        window.location.href = "index.html"; // Redirect to login page
        return;
    }

    try {
        // 🔹 Google Sheets API Details
        const sheetID = "1qf9dzQUAgSateFjpU9fs6JYrjkIo9T1_peEiXSaMg5I";  // Your Sheet ID
        const apiKey = "AIzaSyC-vs4GAthKrNahNVJ6qwYZ0BFpAPAnad8";  // Your API Key
        const sheetName = "data";  // Change this if your sheet name is different
        const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/${sheetName}?key=${apiKey}`;

        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Failed to load data from Google Sheets.");

        const json = await response.json();
        if (!json.values || json.values.length < 2) throw new Error("Sheet is empty or incorrectly formatted.");

        const rows = json.values;
        const headers = rows[0].map(h => h.trim().toLowerCase());

        console.log("Headers:", headers); // Debugging

        // 🔹 Get correct column indices
        const emailIndex = headers.indexOf("Email".toLowerCase());
        const nameIndex = headers.indexOf("Name".toLowerCase());

        if (emailIndex === -1 || nameIndex === -1) {
            throw new Error("Google Sheet must contain 'Email' and 'Name' columns.");
        }

        // 🔹 Find user by email
        let userName = "User"; // Default name
        for (let i = 1; i < rows.length; i++) {
            let row = rows[i].map(cell => cell.trim()); // Trim spaces
            if (row[emailIndex].toLowerCase() === userEmail.toLowerCase()) {
                userName = row[nameIndex];
                break;
            }
        }

        console.log("Found user:", userName); // Debugging

        document.getElementById("userName").textContent = userName; // Update dashboard

    } catch (error) {
        console.error("Error:", error.message);
    }

    // ✅ Logout Functionality
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            console.log("Logging out..."); // Debugging
            localStorage.removeItem("userEmail"); // Remove login session
            window.location.href = "index.html"; // Redirect to login
        });
    } else {
        console.error("Logout button not found in the document.");
    }
});
