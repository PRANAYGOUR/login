document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    let email = document.getElementById("email").value.trim().toLowerCase();
    let phone = document.getElementById("phone").value.trim();
    let messageBox = document.getElementById("message");

    try {
        // Fetch CSV file
        let response = await fetch("./assets/filtered_members.csv");
        if (!response.ok) {
            throw new Error("Failed to load CSV file. Check the file path.");
        }

        let csvText = await response.text();
        console.log("CSV Raw Data:", csvText); // Debug: Show full CSV content

        let rows = csvText.trim().split("\n").map(row => row.split(","));
        console.log("Parsed Rows:", rows); // Debug: Show parsed CSV rows

        if (rows.length < 2) {
            throw new Error("CSV file is empty or has incorrect formatting.");
        }

        // Get column headers
        let headers = rows[0].map(h => h.trim().toLowerCase()); // Normalize column names
        console.log("Headers Found:", headers); // Debug: Check headers

        // New column names
        let emailIndex = headers.indexOf("email of applicant/आवेदक का ईमेल".toLowerCase());
        let phoneIndex = headers.indexOf("phone no. of applicant/आवेदक का फ़ोन नंबर".toLowerCase());

        if (emailIndex === -1 || phoneIndex === -1) {
            throw new Error("CSV headers must include 'Email of Applicant/आवेदक का ईमेल' and 'Phone No. of Applicant/आवेदक का फ़ोन नंबर'.");
        }

        // Validate email and phone against CSV data
        let isValid = rows.some((row, i) => {
            if (i === 0 || row.length <= Math.max(emailIndex, phoneIndex)) return false;

            let csvEmail = row[emailIndex]?.trim().toLowerCase() || "";
            let csvPhone = row[phoneIndex]?.trim() || "";

            console.log(`Checking Row ${i}: Email=${csvEmail}, Phone=${csvPhone}`); // Debug

            return csvEmail === email && csvPhone === phone;
        });

        if (isValid) {
            console.log("Login Successful! Redirecting...");
            window.location.href = "dashboard.html";
        } else {
            console.log("Login Failed: Email or Phone not found.");
            messageBox.innerHTML = "<p style='color: red;'>Invalid Email or Phone Number.</p>";
        }

    } catch (error) {
        messageBox.innerHTML = `<p style='color: red;'>Error: ${error.message}</p>`;
        console.error("Error:", error);
    }
});
