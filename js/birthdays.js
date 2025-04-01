async function loadBirthdays(selectedMonth = "") {
    try {
        const sheetID = "1qf9dzQUAgSateFjpU9fs6JYrjkIo9T1_peEiXSaMg5I";  // Replace with your actual Sheet ID
        const apiKey = "AIzaSyC-vs4GAthKrNahNVJ6qwYZ0BFpAPAnad8";  // Replace with your actual API Key
        const sheetName = "data";  // Change if your sheet name is different
        const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/${sheetName}?key=${apiKey}`;

        const response = await fetch(apiUrl);
        const json = await response.json();

        if (!json.values || json.values.length < 2) {
            console.error("No data found in the Google Sheet.");
            return;
        }

        const rows = json.values;
        const headers = rows[0];

        const nameIndex = headers.indexOf("Name");
        const phoneIndex = headers.indexOf("Phone");
        const dobIndex = headers.indexOf("Date of birth");

        if (nameIndex === -1 || dobIndex === -1) {
            console.error("Required columns not found in the sheet.");
            return;
        }

        const today = new Date();
        const todayDay = String(today.getDate()).padStart(2, "0");
        const todayMonth = String(today.getMonth() + 1).padStart(2, "0");
        const todayMonthDay = `${todayDay}.${todayMonth}`;

        const birthdays = rows.slice(1)
            .map(row => {
                if (!row[dobIndex]) return null;

                const dobParts = row[dobIndex].split("-"); // Handling DD-MM-YYYY format
                if (dobParts.length !== 3) return null;

                const day = dobParts[0].padStart(2, "0");
                const month = dobParts[1].padStart(2, "0");

                return {
                    name: row[nameIndex] || "Unknown",
                    phone: row[phoneIndex] || "",
                    dob: `${day}.${month}`, // Format as DD.MM for comparison
                    monthOnly: month // Used for filtering
                };
            })
            .filter(member => member !== null);

        displayBirthdays(birthdays, todayMonthDay, selectedMonth);
    } catch (error) {
        console.error("Error loading data from Google Sheets:", error);
    }
}

function displayBirthdays(birthdays, todayMonthDay, selectedMonth) {
    const todayDiv = document.getElementById("todayBirthdays");
    const birthdayListDiv = document.getElementById("birthdayList");

    todayDiv.innerHTML = "";
    birthdayListDiv.innerHTML = "";

    let hasTodayBirthdays = false;
    let hasMonthBirthdays = false;

    birthdays.forEach(member => {
        const isToday = member.dob === todayMonthDay;
        const isMatchingMonth = !selectedMonth || member.monthOnly === selectedMonth;

        if (isToday || isMatchingMonth) {
            const div = document.createElement("div");
            div.classList.add("birthday-item");
            div.innerHTML = `
                <span>${member.dob} - ${member.name}</span>
                <a href="https://wa.me/91${member.phone}" target="_blank">
                    <img src="./icons/whatsapp.png" alt="WhatsApp" class="whatsapp-icon">
                </a>
            `;

            if (isToday) {
                todayDiv.appendChild(div);
                hasTodayBirthdays = true;
            } else {
                birthdayListDiv.appendChild(div);
                hasMonthBirthdays = true;
            }
        }
    });

    if (!hasTodayBirthdays) {
        todayDiv.innerHTML = "<p>No birthdays today.</p>";
    }

    if (!hasMonthBirthdays) {
        birthdayListDiv.innerHTML = "<p>No birthdays found for this month.</p>";
    }
}

function filterByMonth() {
    const selectedMonth = document.getElementById("monthSelect").value;
    loadBirthdays(selectedMonth);
}

document.addEventListener("DOMContentLoaded", () => loadBirthdays());
