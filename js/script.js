document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    let email = document.getElementById("email").value.trim().toLowerCase();
    let phone = document.getElementById("phone").value.trim();
    let messageBox = document.getElementById("message");
    let verifyButton = document.querySelector("button");

    messageBox.innerHTML = "";
    verifyButton.textContent = "Verifying...";
    verifyButton.disabled = true;

    // 🔴 Clear any previous session data
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");

    // 🛠️ Google Sheets API Details
    const sheetID = "1qf9dzQUAgSateFjpU9fs6JYrjkIo9T1_peEiXSaMg5I";  // Replace with your actual Sheet ID
    const apiKey = "AIzaSyC-vs4GAthKrNahNVJ6qwYZ0BFpAPAnad8";  // Replace with your actual API Key
    const sheetName = "data";  // Change if your sheet name is different
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/${sheetName}?key=${apiKey}`;

    try {
        let response = await fetch(url);
        if (!response.ok) {
            throw new Error("Failed to load data from Google Sheets.");
        }

        let data = await response.json();
        let rows = data.values;

        if (!rows || rows.length < 2) {
            throw new Error("Google Sheet is empty or formatted incorrectly.");
        }

        let headers = rows[0].map(h => h.trim().toLowerCase());
        let emailIndex = headers.indexOf("Email".toLowerCase());
        let phoneIndex = headers.indexOf("Phone".toLowerCase());
        let nameIndex = headers.indexOf("Name".toLowerCase());

        if (emailIndex === -1 || phoneIndex === -1 || nameIndex === -1) {
            throw new Error("Required columns not found in Google Sheet.");
        }

        let isValid = false;
        let userName = "";

        rows.slice(1).forEach(row => {
            let csvEmail = row[emailIndex]?.trim().toLowerCase() || "";
            let csvPhone = row[phoneIndex]?.trim() || "";

            if (csvEmail === email && csvPhone === phone) {
                isValid = true;
                userName = row[nameIndex] || "User"; // Default to "User" if name is missing
            }
        });

        if (isValid) {
            console.log("✅ Login successful for:", email);

            // ✅ Save login session in localStorage
            localStorage.setItem("userEmail", email);
            localStorage.setItem("userName", userName);

            // ✅ Redirect to dashboard after delay
            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 500);
        } else {
            console.log("❌ Invalid login attempt for:", email);
            messageBox.innerHTML = "<p class='error-message'>Invalid Email or Phone Number.</p>";
        }

    } catch (error) {
        messageBox.innerHTML = `<p class='error-message'>${error.message}</p>`;
        console.error("❌ Error:", error);
    } finally {
        verifyButton.textContent = "Verify";
        verifyButton.disabled = false;
    }
});
