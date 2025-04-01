const sheetId = "1DdcionqFMK3kUvC6MnoDXev3CCVAxlJ6Uyy5jt5Gdd4";
const sheetName = "gallery";
const apiKey = "AIzaSyC-vs4GAthKrNahNVJ6qwYZ0BFpAPAnad8";
const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}?key=${apiKey}`;

// Function to convert Google Drive link to direct image link
const getGoogleDriveImage = (url) => {
    const match = url.match(/(?:id=|\/d\/|\/file\/d\/)([a-zA-Z0-9_-]{20,})/);
    return match ? `https://lh3.googleusercontent.com/d/${match[1]}=s220` : url;
};

document.addEventListener("DOMContentLoaded", loadEvents);

async function loadEvents() {
    const eventsContainer = document.getElementById("eventsContainer");

    if (!eventsContainer) {
        console.error("❌ Error: Element with ID 'eventsContainer' not found.");
        return;
    }

    eventsContainer.innerHTML = "<p>Loading events...</p>";

    try {
        console.log(`📡 Fetching data from: ${apiUrl}`);
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        console.log("📜 Raw Data from Google Sheets:", data);

        if (!data.values || data.values.length < 2) {
            eventsContainer.innerHTML = "<p>No event data available.</p>";
            console.error("❌ No data found or incorrect format");
            return;
        }

        const headers = data.values[0].map(h => h.toLowerCase());
        console.log("📌 Headers found:", headers);

        // Get column indexes
        const descriptionIndex = headers.indexOf("des");
        const posterUrlIndex = headers.indexOf("image");

        if ([descriptionIndex, posterUrlIndex].includes(-1)) {
            eventsContainer.innerHTML = "<p>Error: Missing required columns in Google Sheets.</p>";
            console.error("❌ Missing required columns. Check column names in Google Sheets.");
            return;
        }

        eventsContainer.innerHTML = ""; // Clear loading message

        // Process and display events
        data.values.slice(1).forEach(row => {
            const description = row[descriptionIndex] || "No description available.";
            const posterUrl = getGoogleDriveImage(row[posterUrlIndex]); // Convert Google Drive link


            const eventCard = document.createElement("div");
            eventCard.classList.add("event-card");

            eventCard.innerHTML = `
                <img src="${posterUrl}" alt="Event Poster" class="event-image" onerror="this.src='./icons/default.png';">
                <div class="event-details">
                    <h3></h3>
                    <p>${description}</p>
                    </div>
                    
                </div>
            `;

            eventsContainer.appendChild(eventCard);
        });

    } catch (error) {
        eventsContainer.innerHTML = "<p>Error fetching event data.</p>";
        console.error("❌ Error fetching data:", error);
    }
}
