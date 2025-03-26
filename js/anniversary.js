async function loadAnniversaries(selectedMonth = "") {
    try {
        const response = await fetch("./assets/filtered_members.csv");
        const data = await response.text();
        const rows = data.trim().split("\n").map(row => row.split(",").map(cell => cell.trim()));

        if (rows.length < 2) {
            console.error("No data found in CSV.");
            return;
        }

        const headers = rows[0];
        const nameIndex = headers.indexOf("Name/नाम");
        const phoneIndex = headers.indexOf("Phone No. of Applicant/आवेदक का फ़ोन नंबर");
        const anniversaryIndex = headers.indexOf("Anniversary date/सालगिरह की तिथि");

        if (nameIndex === -1 || anniversaryIndex === -1) {
            console.error("Required columns not found in CSV.");
            return;
        }

        const today = new Date();
        const todayDay = String(today.getDate()).padStart(2, "0");
        const todayMonth = String(today.getMonth() + 1).padStart(2, "0");
        const todayMonthDay = `${todayDay}.${todayMonth}`;

        const anniversaries = rows.slice(1)
            .map(row => {
                if (!row[anniversaryIndex]) return null;

                const anniversaryParts = row[anniversaryIndex].split("-"); // Handling DD-MM-YYYY format
                if (anniversaryParts.length !== 3) return null;

                const day = anniversaryParts[0].padStart(2, "0");
                const month = anniversaryParts[1].padStart(2, "0");

                return {
                    name: row[nameIndex] || "Unknown",
                    phone: row[phoneIndex] || "",
                    anniversary: `${day}.${month}`, // Format as DD.MM for comparison
                    monthOnly: month // Used for filtering
                };
            })
            .filter(member => member !== null);

        displayAnniversaries(anniversaries, todayMonthDay, selectedMonth);
    } catch (error) {
        console.error("Error loading CSV:", error);
    }
}

function displayAnniversaries(anniversaries, todayMonthDay, selectedMonth) {
    const todayDiv = document.getElementById("todayAnniversaries");
    const anniversaryListDiv = document.getElementById("anniversaryList");

    todayDiv.innerHTML = "";
    anniversaryListDiv.innerHTML = "";

    let hasAnniversaries = false;

    anniversaries.forEach(member => {
        const isToday = member.anniversary === todayMonthDay;
        const isMatchingMonth = !selectedMonth || member.monthOnly === selectedMonth;

        // Always show today's anniversaries at the top
        if (isToday || isMatchingMonth) {
            const div = document.createElement("div");
            div.classList.add("anniversary-item");
            div.innerHTML = `
                <span>${member.anniversary} - ${member.name}</span>
                <a href="https://wa.me/91${member.phone}" target="_blank">
                    <img src="./icons/whatsapp.png" alt="WhatsApp" class="whatsapp-icon">
                </a>
            `;

            if (isToday) {
                todayDiv.appendChild(div);
            } else {
                anniversaryListDiv.appendChild(div);
            }

            hasAnniversaries = true;
        }
    });

    if (!hasAnniversaries) {
        anniversaryListDiv.innerHTML = "<p>No anniversaries found for this month.</p>";
    }
}

function filterByMonth() {
    const selectedMonth = document.getElementById("monthSelect").value;
    loadAnniversaries(selectedMonth);
}

function goBack() {
    window.history.back();
}

document.addEventListener("DOMContentLoaded", () => loadAnniversaries());
