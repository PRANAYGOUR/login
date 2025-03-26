async function loadBirthdays(selectedMonth = "") {
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
        const dobIndex = headers.indexOf("Date of birth/जन्म की तारीख");

        if (nameIndex === -1 || dobIndex === -1) {
            console.error("Required columns not found in CSV.");
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
        console.error("Error loading CSV:", error);
    }
}

function displayBirthdays(birthdays, todayMonthDay, selectedMonth) {
    const todayDiv = document.getElementById("todayBirthdays");
    const birthdayListDiv = document.getElementById("birthdayList");

    todayDiv.innerHTML = "";
    birthdayListDiv.innerHTML = "";

    let hasBirthdays = false;

    birthdays.forEach(member => {
        const isToday = member.dob === todayMonthDay;
        const isMatchingMonth = !selectedMonth || member.monthOnly === selectedMonth;

        // Always show today's birthdays at the top
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
            } else {
                birthdayListDiv.appendChild(div);
            }

            hasBirthdays = true;
        }
    });

    if (!hasBirthdays) {
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
