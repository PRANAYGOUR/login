const apiUrl = "https://script.google.com/macros/s/AKfycbwWtCiP3Ex2GrqXR58rLg7wOuc5xC0KkBDLrxGUVeuJGpqsetQEZz_7yvccgmUb9Hdo/exec"; // Replace with your Web App URL

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
        const events = await response.json();

        if (!events.length) {
            eventsContainer.innerHTML = "<p>No event data available.</p>";
            console.error("❌ No data found");
            return;
        }

        eventsContainer.innerHTML = ""; // Clear loading message

        // Display events
        events.forEach(event => {
            const eventCard = document.createElement("div");
            eventCard.classList.add("event-card");

            eventCard.innerHTML = `
                <img src="${event.image}" alt="Event Poster" class="event-image" onerror="this.src='./icons/default.png';">
                <div class="event-details">
                    <h3>${event.eventname || "Unknown Event"}</h3>
                    <p><strong>Date:</strong> ${event.date || "TBA"}</p>
                    <p><strong>Time:</strong> ${event.time || "TBA"}</p>
                    <p><strong>Venue:</strong> ${event.venue || "TBA"}</p>
                    <p><strong>Contact:</strong> ${event.contact || "N/A"}</p>
                    <div class="contact-icons">
                        <a href="https://wa.me/${event.contact}" target="_blank" title="Chat on WhatsApp">
                            <img src="icons/whatsapp.png" alt="WhatsApp" class="icon">
                        </a>
                        <a href="tel:${event.contact}" title="Call Now">
                            <img src="icons/phone.png" alt="Phone" class="icon">
                        </a>
                    </div>
                    <p>${event.des || "No description available."}</p>
                </div>
            `;

            eventsContainer.appendChild(eventCard);
        });

    } catch (error) {
        eventsContainer.innerHTML = "<p>Error fetching event data.</p>";
        console.error("❌ Error fetching data:", error);
    }
}
