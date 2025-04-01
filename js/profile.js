// 🔵 Function to Get Query Parameter from URL
function getQueryParam(param) {
    const params = new URLSearchParams(window.location.search);
    return params.get(param);
}

// 🔵 Function to Fetch Profile Data from Google Sheets
async function fetchProfileData() {
    const sheetID = "1qf9dzQUAgSateFjpU9fs6JYrjkIo9T1_peEiXSaMg5I";  // Replace with your actual Sheet ID
    const apiKey = "AIzaSyC-vs4GAthKrNahNVJ6qwYZ0BFpAPAnad8";  // Replace with your actual API Key
    const sheetName = "data";  // Change if your sheet name is different
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/${sheetName}?key=${apiKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch data from Google Sheets.");

        const data = await response.json();
        const rows = data.values;
        if (!rows || rows.length < 2) throw new Error("No data found in the sheet.");

        // Extract headers and convert to lowercase
        const headers = rows[0].map(header => header.trim().toLowerCase());
        console.log("Headers: ", headers);  // Debugging: Check if columns match your expectations

        const selectedName = getQueryParam("name"); // Get name from URL
        if (!selectedName) {
            console.error("No name provided in the URL.");
            return;
        }

        // Indexes for the required columns (converted to lowercase for consistency)
        const nameIndex = headers.indexOf("name");
        const photoIndex = headers.indexOf("photo");
        const fatherIndex = headers.indexOf("father");
        const dobIndex = headers.indexOf("date of birth");
        const bloodIndex = headers.indexOf("blood group");
        const occupationIndex = headers.indexOf("occupation");
        const buildingIndex = headers.indexOf("building name");
        const colonyIndex = headers.indexOf("colony");
        const streetIndex = headers.indexOf("street name");
        const areaIndex = headers.indexOf("area");
        const pinIndex = headers.indexOf("pin code");
        const stateIndex = headers.indexOf("state");
        const cityIndex = headers.indexOf("city");
        const residencePhoneIndex = headers.indexOf("residence phone number");
        const officePhoneIndex = headers.indexOf("office phone number");
        const phoneIndex = headers.indexOf("phone");
        const emailIndex = headers.indexOf("email");

        // Debugging: Log the indices
        console.log("Indices: ", {
            nameIndex,
            photoIndex,
            fatherIndex,
            dobIndex,
            bloodIndex,
            occupationIndex,
            buildingIndex,
            colonyIndex,
            streetIndex,
            areaIndex,
            pinIndex,
            stateIndex,
            cityIndex,
            residencePhoneIndex,
            officePhoneIndex,
            phoneIndex,
            emailIndex
        });

        if (nameIndex === -1) throw new Error("Name column not found in the sheet.");

        // Find user data based on the name
        const userData = rows.find(row => row[nameIndex]?.trim().toLowerCase() === selectedName.toLowerCase());
        if (!userData) throw new Error("User not found in the database.");

        // Display fetched data
        document.getElementById("Photo").src = userData[photoIndex] || "default.jpg";
        document.getElementById("Name").textContent = userData[nameIndex] || "N/A";
        document.getElementById("Father").textContent = `Father: ${userData[fatherIndex] || "N/A"}`;
        document.getElementById("Date of birth").textContent = `Date of Birth: ${userData[dobIndex] || "N/A"}`;
        document.getElementById("blood").textContent = `Blood Group: ${userData[bloodIndex] || "N/A"}`;
        document.getElementById("occupation").textContent = `Occupation: ${userData[occupationIndex] || "N/A"}`;
        document.getElementById("phone").textContent = `Phone: ${userData[phoneIndex] || "N/A"}`;
        document.getElementById("email").textContent = `Email: ${userData[emailIndex] || "N/A"}`;

        // 🔵 Set the contact links dynamically:
        const phoneNumber = userData[phoneIndex] || "";
        const email = userData[emailIndex] || "";

        // Set WhatsApp link dynamically
        const whatsappLink = document.getElementById("whatsapp-link");
        if (phoneNumber) {
            whatsappLink.href = `https://wa.me/${phoneNumber}`;
        } else {
            whatsappLink.href = "#";
            whatsappLink.style.pointerEvents = "none"; // Disable click if no phone number
        }

        // Set Phone link dynamically
        const phoneLink = document.getElementById("phone-link");
        if (phoneNumber) {
            phoneLink.href = `tel:${phoneNumber}`;
        } else {
            phoneLink.href = "#";
            phoneLink.style.pointerEvents = "none"; // Disable click if no phone number
        }

        // Set Email link dynamically
        const emailLink = document.getElementById("email-link");
        if (email) {
            emailLink.href = `mailto:${email}`;
        } else {
            emailLink.href = "#";
            emailLink.style.pointerEvents = "none"; // Disable click if no email
        }

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
