async function loadAnniversaries(selectedMonth = "") {
    try {
        const sheetID = "1qf9dzQUAgSateFjpU9fs6JYrjkIo9T1_peEiXSaMg5I";  // Replace with your actual Sheet ID
        const apiKey = "AIzaSyC-vs4GAthKrNahNVJ6qwYZ0BFpAPAnad8";  // Replace with your actual API Key
        const sheetName = "data";  // Change if your sheet name is different
        const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/${sheetName}?key=${apiKey}`;

        console.log("📡 Fetching data from:", apiUrl);

        const response = await fetch(apiUrl);
        const json = await response.json();

        if (!json.values || json.values.length < 2) {
            console.error("❌ No data found in the Google Sheet.");
            return;
        }

        const rows = json.values;
        const headers = rows[0];

        console.log("✅ Headers found:", headers);

        const nameIndex = headers.indexOf("Name");
        const phoneIndex = headers.indexOf("Phone");
        const anniversaryIndex = headers.indexOf("Anniversary date");

        if (nameIndex === -1 || anniversaryIndex === -1) {
            console.error("❌ Required columns not found: 'Name' or 'Anniversary date' missing.");
            return;
        }

        console.log(`📌 Name Index: ${nameIndex}, Phone Index: ${phoneIndex}, Anniversary Index: ${anniversaryIndex}`);

        const today = new Date();
        const todayDay = String(today.getDate()).padStart(2, "0");
        const todayMonth = String(today.getMonth() + 1).padStart(2, "0");
        const todayMonthDay = `${todayDay}.${todayMonth}`;

        const anniversaries = rows.slice(1)
            .map(row => {
                if (!row[anniversaryIndex]) {
                    console.warn("⚠️ Skipping row with missing Anniversary Date:", row);
                    return null;
                }

                const anniversaryParts = row[anniversaryIndex].split("-");
                if (anniversaryParts.length !== 3) {
                    console.warn("⚠️ Invalid date format found:", row[anniversaryIndex]);
                    return null;
                }

                const day = parseInt(anniversaryParts[0], 10);
                const month = parseInt(anniversaryParts[1], 10);

                return {
                    name: row[nameIndex] || "Unknown",
                    phone: row[phoneIndex] || "",
                    anniversary: `${String(day).padStart(2, "0")}.${String(month).padStart(2, "0")}`, // Format as DD.MM
                    day: day,
                    month: month,
                    monthOnly: String(month).padStart(2, "0") // Used for filtering
                };
            })
            .filter(member => member !== null)
            .sort((a, b) => a.month === b.month ? a.day - b.day : a.month - b.month); // Sort by month, then by day

        console.log("🎉 Sorted Anniversaries:", anniversaries);
        displayAnniversaries(anniversaries, todayMonthDay, selectedMonth);
    } catch (error) {
        console.error("❌ Error loading data from Google Sheets:", error);
    }
}

function displayAnniversaries(anniversaries, todayMonthDay, selectedMonth) {
    const todayDiv = document.getElementById("todayAnniversaries");
    const anniversaryListDiv = document.getElementById("anniversaryList");

    todayDiv.innerHTML = "";
    anniversaryListDiv.innerHTML = "";

    let hasTodayAnniversaries = false;
    let hasMonthAnniversaries = false;

    anniversaries.forEach(member => {
        const isToday = member.anniversary === todayMonthDay;
        const isMatchingMonth = !selectedMonth || member.monthOnly === selectedMonth;

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
                hasTodayAnniversaries = true;
            } else {
                anniversaryListDiv.appendChild(div);
                hasMonthAnniversaries = true;
            }
        }
    });

    if (!hasTodayAnniversaries) {
        todayDiv.innerHTML = "<p>No anniversaries today.</p>";
    }

    if (!hasMonthAnniversaries) {
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
