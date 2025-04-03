async function loadBirthdays(selectedMonth = "") {
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
        const dobIndex = headers.indexOf("Date of birth");

        if (nameIndex === -1 || dobIndex === -1) {
            console.error("❌ Required columns not found: 'Name' or 'Date of birth' missing.");
            return;
        }

        console.log(`📌 Name Index: ${nameIndex}, Phone Index: ${phoneIndex}, DOB Index: ${dobIndex}`);

        const today = new Date();
        const todayDay = String(today.getDate()).padStart(2, "0");
        const todayMonth = String(today.getMonth() + 1).padStart(2, "0");
        const todayMonthDay = `${todayDay}.${todayMonth}`;

        const birthdays = rows.slice(1).map(row => {
            if (!row[dobIndex]) {
                console.warn("⚠️ Skipping row with missing Date of Birth:", row);
                return null;
            }

            const dobParts = row[dobIndex].split("-");
            if (dobParts.length !== 3) {
                console.warn("⚠️ Invalid date format found:", row[dobIndex]);
                return null;
            }

            const day = parseInt(dobParts[0], 10);
            const month = parseInt(dobParts[1], 10);

            return {
                name: row[nameIndex] || "Unknown",
                phone: row[phoneIndex] || "",
                dob: `${String(day).padStart(2, "0")}.${String(month).padStart(2, "0")}`, // Format as DD.MM
                day: day,
                month: month,
                monthOnly: String(month).padStart(2, "0") // Used for filtering
            };
        }).filter(member => member !== null)
          .sort((a, b) => a.month === b.month ? a.day - b.day : a.month - b.month); // Sort by month first, then by day

        console.log("🎉 Sorted Birthdays:", birthdays);
        displayBirthdays(birthdays, todayMonthDay, selectedMonth);
    } catch (error) {
        console.error("❌ Error loading data from Google Sheets:", error);
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
function goBack() {
    window.history.back();
}

document.addEventListener("DOMContentLoaded", () => loadBirthdays());
