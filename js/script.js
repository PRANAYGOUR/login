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

    try {
        let response = await fetch("./assets/filtered_members.csv");
        if (!response.ok) {
            throw new Error("Failed to load CSV file. Check the file path.");
        }

        let csvText = await response.text();
        let rows = csvText.trim().split("\n").map(row => row.split(","));

        if (rows.length < 2) {
            throw new Error("CSV file is empty or formatted incorrectly.");
        }

        let headers = rows[0].map(h => h.trim().toLowerCase());
        let emailIndex = headers.indexOf("email of applicant/आवेदक का ईमेल".toLowerCase());
        let phoneIndex = headers.indexOf("phone no. of applicant/आवेदक का फ़ोन नंबर".toLowerCase());

        if (emailIndex === -1 || phoneIndex === -1) {
            throw new Error("CSV must contain 'Email' and 'Phone Number' columns.");
        }

        let isValid = false;
        let userName = "";

        rows.forEach((row, i) => {
            if (i === 0) return;
            let csvEmail = row[emailIndex]?.trim().toLowerCase() || "";
            let csvPhone = row[phoneIndex]?.trim() || "";

            if (csvEmail === email && csvPhone === phone) {
                isValid = true;
                userName = row[0]; // Assuming first column is the user's name
            }
        });

        if (isValid) {
            console.log("✅ Login successful for:", email);

            // ✅ Save login session in localStorage
            localStorage.setItem("userEmail", email);
            localStorage.setItem("userName", userName);

            // ✅ Add a delay before redirecting
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
