async function loadBloodGroups() {
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
        const bloodGroupIndex = headers.indexOf("Blood Group");
        const phoneIndex = headers.indexOf("Phone");

        if (nameIndex === -1 || bloodGroupIndex === -1) {
            console.error("Required columns not found in the sheet.");
            return;
        }

        const members = rows.slice(1).map(row => ({
            name: row[nameIndex] || "Unknown",
            bloodGroup: row[bloodGroupIndex] || "",
            phone: row[phoneIndex] || ""
        }));

        const bloodGroups = [...new Set(members.map(member => member.bloodGroup))]; // Get unique blood groups
        displayBloodGroups(bloodGroups, members);
    } catch (error) {
        console.error("Error loading data from Google Sheets:", error);
    }
}

function displayBloodGroups(bloodGroups, members) {
    const bloodGroupListDiv = document.getElementById("bloodGroupList");
    bloodGroupListDiv.innerHTML = "";

    bloodGroups.forEach(group => {
        const groupDiv = document.createElement("div");
        groupDiv.classList.add("blood-group-item");
        groupDiv.innerHTML = `
            <span class="blood-group-name">${group}</span>
        `;

        groupDiv.addEventListener("click", function() {
            displayMembersByBloodGroup(group, members);
        });

        bloodGroupListDiv.appendChild(groupDiv);
    });
}

function displayMembersByBloodGroup(bloodGroup, members) {
    const bloodGroupDetailsDiv = document.getElementById("bloodGroupDetails");
    bloodGroupDetailsDiv.innerHTML = `<h3>Members with Blood Group ${bloodGroup}</h3>`;

    const membersOfGroup = members.filter(member => member.bloodGroup === bloodGroup);

    if (membersOfGroup.length > 0) {
        membersOfGroup.forEach(member => {
            const memberDiv = document.createElement("div");
            memberDiv.classList.add("member-item");
            memberDiv.innerHTML = `
                <span>${member.name}</span>
                <a href="https://wa.me/91${member.phone}" target="_blank">
                    <img src="./icons/whatsapp.png" alt="WhatsApp" class="whatsapp-icon">
                </a>
            `;
            bloodGroupDetailsDiv.appendChild(memberDiv);
        });
    } else {
        bloodGroupDetailsDiv.innerHTML = "<p>No members found with this blood group.</p>";
    }
}

document.addEventListener("DOMContentLoaded", () => loadBloodGroups());
