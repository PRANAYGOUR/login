document.addEventListener("DOMContentLoaded", async function () {
    const userEmail = localStorage.getItem("userEmail"); // Correct key from login.js

    console.log("Logged-in user email:", userEmail); // Debugging

    if (!userEmail) {
        console.error("No logged-in user found.");
        window.location.href = "login.html"; // Redirect to login page
        return;
    }

    try {
        const response = await fetch("./assets/filtered_members.csv");
        if (!response.ok) throw new Error("Failed to load CSV file.");

        const csvText = await response.text();
        console.log("Fetched CSV data:", csvText); // Debugging

        const rows = csvText.trim().split("\n").map(row => row.split(","));
        if (rows.length < 2) throw new Error("CSV is empty or incorrectly formatted.");

        // 🔹 Normalize headers (trim spaces)
        const headers = rows[0].map(h => h.trim().toLowerCase());
        console.log("Headers:", headers); // Debugging

        // 🔹 Get correct column indices
        const emailIndex = headers.indexOf("email of applicant/आवेदक का ईमेल".toLowerCase());
        const nameIndex = headers.indexOf("Name/नाम".toLowerCase());

        if (emailIndex === -1 || nameIndex === -1) {
            throw new Error("CSV must contain 'Email' and 'Name' columns.");
        }

        // 🔹 Find user by email
        let userName = "User"; // Default name
        for (let i = 1; i < rows.length; i++) {
            let row = rows[i].map(cell => cell.trim()); // Trim spaces
            if (row[emailIndex].toLowerCase() === userEmail) {
                userName = row[nameIndex];
                break;
            }
        }

        console.log("Found user:", userName); // Debugging

        document.getElementById("userName").textContent = userName; // Update dashboard

    } catch (error) {
        console.error("Error:", error.message);
    }
});
