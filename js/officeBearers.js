const sheetId = "1gqwG-NgfdrfeXtfBg78g-W4GE3LR0pW4Mva8m5vAWMo";
const sheetName = "Sheet1";
const apiKey = "AIzaSyC-vs4GAthKrNahNVJ6qwYZ0BFpAPAnad8";
const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}?key=${apiKey}`;

const getGoogleDriveImage = (url) => {
    const match = url.match(/(?:id=|\/d\/|\/file\/d\/)([a-zA-Z0-9_-]{20,})/);
    return match ? `https://lh3.googleusercontent.com/d/${match[1]}=s220` : url;
};

document.addEventListener("DOMContentLoaded", loadOfficeBearers);

async function loadOfficeBearers() {
    const officeBearersDiv = document.getElementById("officeBearersList");
    officeBearersDiv.innerHTML = "<p>Loading office bearers...</p>";

    try {
        console.log(`📡 Fetching data from: ${apiUrl}`);
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        console.log("📜 Raw Data from Google Sheets:", data);

        if (!data.values || data.values.length < 2) {
            officeBearersDiv.innerHTML = "<p>No data available.</p>";
            console.error("❌ No data found or incorrect format");
            return;
        }

        const headers = data.values[0].map(h => h.toLowerCase());
        console.log("📌 Headers found:", headers);

        const nameIndex = headers.indexOf("name");
        const designationIndex = headers.indexOf("designation");
        const phoneIndex = headers.indexOf("phone number");
        const photoIndex = headers.indexOf("photo");
        const emailIndex = headers.indexOf("email");

        if ([nameIndex, designationIndex, phoneIndex, photoIndex, emailIndex].includes(-1)) {
            officeBearersDiv.innerHTML = "<p>Error: Missing required columns in Google Sheets.</p>";
            console.error("❌ Missing required columns in Google Sheets.");
            return;
        }

        officeBearersDiv.innerHTML = ""; // Clear loading message

        data.values.slice(1).forEach(row => {
            const name = row[nameIndex] || "Unknown";
            const designation = row[designationIndex] || "N/A";
            const phone = row[phoneIndex] || "N/A";
            const email = row[emailIndex] || "N/A";
            const photoUrl = getGoogleDriveImage(row[photoIndex]); // Convert Google Drive link
        
            const div = document.createElement("div");
            div.classList.add("office-bearer-item");
            div.innerHTML = `
                <img src="${photoUrl}" class="profile-pic" onerror="this.src='./icons/logo.png';">
                <div class="info">
                    <h3>${name}</h3>
                    <p><strong>${designation}</strong></p>
                    <p>📞 <a href="tel:${phone}">${phone}</a></p>
                    <p>✉ <a href="mailto:${email}">${email}</a></p>
                </div>
            `;
        
            officeBearersDiv.appendChild(div);
        });
        

    } catch (error) {
        officeBearersDiv.innerHTML = "<p>Error fetching data.</p>";
        console.error("❌ Error fetching data:", error);
    }
}
