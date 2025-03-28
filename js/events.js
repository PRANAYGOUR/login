const sheetId = "1OLdDjpnRtjJ7zi0q9G9BFJ9CEfI9k-cj9ZEvglCt2jc";
const sheetName = "events";
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
        const eventNameIndex = headers.indexOf("eventname");
        const dateIndex = headers.indexOf("date");
        const timeIndex = headers.indexOf("time");
        const venueIndex = headers.indexOf("venue");
        const descriptionIndex = headers.indexOf("des");
        const contactIndex = headers.indexOf("contact");
        const posterUrlIndex = headers.indexOf("image");

        if ([eventNameIndex, dateIndex, timeIndex, venueIndex, descriptionIndex, contactIndex, posterUrlIndex].includes(-1)) {
            eventsContainer.innerHTML = "<p>Error: Missing required columns in Google Sheets.</p>";
            console.error("❌ Missing required columns. Check column names in Google Sheets.");
            return;
        }

        eventsContainer.innerHTML = ""; // Clear loading message

        // Process and display events
        data.values.slice(1).forEach(row => {
            const eventName = row[eventNameIndex] || "Unknown Event";
            const date = row[dateIndex] || "TBA";
            const time = row[timeIndex] || "TBA";
            const venue = row[venueIndex] || "TBA";
            const description = row[descriptionIndex] || "No description available.";
            const contact = row[contactIndex] || "N/A";
            const posterUrl = getGoogleDriveImage(row[posterUrlIndex]); // Convert Google Drive link

            const whatsappLink = `https://wa.me/${contact.replace(/\D/g, "")}`;
            const phoneLink = `tel:${contact.replace(/\D/g, "")}`;

            const eventCard = document.createElement("div");
            eventCard.classList.add("event-card");

            eventCard.innerHTML = `
                <img src="${posterUrl}" alt="Event Poster" class="event-image" onerror="this.src='./icons/default.png';">
                <div class="event-details">
                    <h3>${eventName}</h3>
                    <p><strong>Date:</strong> ${date}</p>
                    <p><strong>Time:</strong> ${time}</p>
                    <p><strong>Venue:</strong> ${venue}</p>
                    <p><strong>Contact:</strong> ${contact}</p>
                    <div class="contact-icons">
                        <a href="${whatsappLink}" target="_blank" title="Chat on WhatsApp">
                            <img src="icons/whatsapp.png" alt="WhatsApp" class="icon">
                        </a>
                        <a href="${phoneLink}" title="Call Now">
                            <img src="icons/phone.png" alt="Phone" class="icon">
                        </a>
                    </div>
                    <p>${description}</p>
                </div>
            `;

            eventsContainer.appendChild(eventCard);
        });

    } catch (error) {
        eventsContainer.innerHTML = "<p>Error fetching event data.</p>";
        console.error("❌ Error fetching data:", error);
    }
}
