// 🛠️ Google Sheets API Details
const sheetID = "1qf9dzQUAgSateFjpU9fs6JYrjkIo9T1_peEiXSaMg5I";  // Replace with your actual Sheet ID
const apiKey = "AIzaSyC-vs4GAthKrNahNVJ6qwYZ0BFpAPAnad8";  // Replace with your actual API Key
const sheetName = "data";  // Change if your sheet name is different
const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/${sheetName}?key=${apiKey}`;

// 🔵 Function to Convert Name to Title Case
function toTitleCase(str) {
    return str.replace(/\b\w/g, char => char.toUpperCase());
}

// 🔵 Function to Load Members from Google Sheets
async function loadMembers() {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        const rows = data.values;
        if (!rows || rows.length < 2) throw new Error("Google Sheet is empty or formatted incorrectly.");

        const headers = rows[0].map(h => h.trim().toLowerCase());
        const nameIndex = headers.indexOf("name");  // Ensure case-insensitive matching
        const phoneIndex = headers.indexOf("phone");  // Ensure correct column name

        if (nameIndex === -1 || phoneIndex === -1) {
            console.error("Columns 'Name' or 'Phone Number' not found in Google Sheet.");
            return;
        }

        // Convert names to Title Case and keep phone numbers
        const members = rows.slice(1)
            .map(row => ({
                name: toTitleCase(row[nameIndex]?.trim() || ""),
                phone: row[phoneIndex]?.trim() || ""
            }))
            .filter(member => member.name && member.phone)  // Ensure valid data
            .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })); // Sort alphabetically

        displayMembers(members);
    } catch (error) {
        console.error("Error loading members:", error);
    }
}

// 🔵 Display Members & Enable Click for Profile Navigation
function displayMembers(members) {
    const memberList = document.getElementById("memberList");
    memberList.innerHTML = "";

    members.forEach(member => {
        const div = document.createElement("div");
        div.classList.add("member-item");
        div.textContent = `${member.name}`;  // Show phone number next to name
        div.addEventListener("click", () => {
            window.location.href = `profile.html?name=${encodeURIComponent(member.name)}&phone=${encodeURIComponent(member.phone)}`;
        });
        memberList.appendChild(div);
    });

    window.allMembers = members; // Store sorted members for searching
}

// 🔵 Search Function
function filterNames() {
    const searchInput = document.getElementById("searchBar").value.toLowerCase();
    const memberList = document.getElementById("memberList");
    memberList.innerHTML = "";

    window.allMembers.forEach(member => {
        if (member.name.toLowerCase().includes(searchInput) || member.phone.includes(searchInput)) {
            const div = document.createElement("div");
            div.classList.add("member-item");
            div.textContent = `${member.name}`;  // Show phone number next to name
            div.addEventListener("click", () => {
                window.location.href = `profile.html?name=${encodeURIComponent(member.name)}&phone=${encodeURIComponent(member.phone)}`;
            });
            memberList.appendChild(div);
        }
    });
}

// Load Members on Page Load
document.addEventListener("DOMContentLoaded", loadMembers);
