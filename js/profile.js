// 🔵 Function to Get Query Parameter from URL
function getQueryParam(param) {
    const params = new URLSearchParams(window.location.search);
    return params.get(param);
}

// 🔵 Function to Fetch Profile Data from Google Sheets
async function fetchProfileData() {
    const sheetID = "1qf9dzQUAgSateFjpU9fs6JYrjkIo9T1_peEiXSaMg5I";  
    const apiKey = "AIzaSyC-vs4GAthKrNahNVJ6qwYZ0BFpAPAnad8";  
    const sheetName = "data";  
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/${sheetName}?key=${apiKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch data from Google Sheets.");

        const data = await response.json();
        const rows = data.values;
        if (!rows || rows.length < 2) throw new Error("No data found in the sheet.");

        const headers = rows[0].map(header => header.trim().toLowerCase());
        console.log("Headers: ", headers);  

        const phoneFromURL = getQueryParam("phone"); // Get phone number from URL
        const emailFromLocalStorage = localStorage.getItem("userEmail"); // Email from dashboard.js

        let selectedUserData = null;

        // 🔹 Check if phone is in URL (from members.js) or email is in localStorage (from dashboard.js)
        if (phoneFromURL) {
            const phoneIndex = headers.indexOf("phone");
            if (phoneIndex === -1) throw new Error("Phone column not found in the sheet.");

            selectedUserData = rows.find(row => row[phoneIndex]?.trim() === phoneFromURL);
        } else if (emailFromLocalStorage) {
            const emailIndex = headers.indexOf("email");
            if (emailIndex === -1) throw new Error("Email column not found in the sheet.");

            selectedUserData = rows.find(row => row[emailIndex]?.trim().toLowerCase() === emailFromLocalStorage.toLowerCase());
        }

        if (!selectedUserData) throw new Error("User not found in the database.");

        // 🔹 Extract Data
        const nameIndex = headers.indexOf("name");
        const photoIndex = headers.indexOf("photo");
        const fatherIndex = headers.indexOf("father");
        const dobIndex = headers.indexOf("date of birth");
        const bloodIndex = headers.indexOf("blood group");
        const occupationIndex = headers.indexOf("occupation");
        const phoneIndex = headers.indexOf("phone");
        const emailIndex = headers.indexOf("email");

        // 🔹 Update Profile Page
        document.getElementById("Photo").src = selectedUserData[photoIndex] || "default.jpg";
        document.getElementById("Name").textContent = selectedUserData[nameIndex] || "N/A";
        document.getElementById("Father").textContent = `Father: ${selectedUserData[fatherIndex] || "N/A"}`;
        document.getElementById("Date of birth").textContent = `Date of Birth: ${selectedUserData[dobIndex] || "N/A"}`;
        document.getElementById("blood").textContent = `Blood Group: ${selectedUserData[bloodIndex] || "N/A"}`;
        document.getElementById("occupation").textContent = `Occupation: ${selectedUserData[occupationIndex] || "N/A"}`;
        document.getElementById("phone").textContent = `Phone: ${selectedUserData[phoneIndex] || "N/A"}`;
        document.getElementById("email").textContent = `Email: ${selectedUserData[emailIndex] || "N/A"}`;

        // 🔹 Set Contact Links
        const phoneNumber = selectedUserData[phoneIndex] || "";
        const email = selectedUserData[emailIndex] || "";

        document.getElementById("whatsapp-link").href = phoneNumber ? `https://wa.me/${phoneNumber}` : "#";
        document.getElementById("phone-link").href = phoneNumber ? `tel:${phoneNumber}` : "#";
        document.getElementById("email-link").href = email ? `mailto:${email}` : "#";

    } catch (error) {
        console.error("Error fetching profile data:", error);
        document.getElementById("profile-info").innerHTML = `<p class='error-message'>${error.message}</p>`;
    }

    document.getElementById("backButton").addEventListener("click", function() {
        window.history.back();
    });
}

// 🔵 Load Profile Data on Page Load
document.addEventListener("DOMContentLoaded", fetchProfileData);
