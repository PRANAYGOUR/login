// 🛠️ Google Sheets API Details
const sheetID = "1qf9dzQUAgSateFjpU9fs6JYrjkIo9T1_peEiXSaMg5I";  // Replace with your actual Sheet ID
const apiKey = "AIzaSyC-vs4GAthKrNahNVJ6qwYZ0BFpAPAnad8";  // Replace with your actual API Key
const sheetName = "data";  // Change if your sheet name is different
const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/${sheetName}?key=${apiKey}`;


// 🔵 Function to Load Members from Google Sheets
async function loadMembers() {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        const rows = data.values;
        if (!rows || rows.length < 2) throw new Error("Google Sheet is empty or formatted incorrectly.");

        const headers = rows[0].map(h => h.trim().toLowerCase());
        const nameIndex = headers.indexOf("Name".toLowerCase());

        if (nameIndex === -1) {
            console.error("Column 'Name' not found in Google Sheet.");
            return;
        }

        const members = rows.slice(1).map(row => row[nameIndex]?.trim()).filter(name => name);

        displayMembers(members);
    } catch (error) {
        console.error("Error loading members:", error);
    }
}

// 🔵 Display Members & Enable Click for Profile Navigation
function displayMembers(members) {
    const memberList = document.getElementById("memberList");
    memberList.innerHTML = "";

    members.forEach(name => {
        const div = document.createElement("div");
        div.classList.add("member-item");
        div.textContent = name;
        div.addEventListener("click", () => {
            window.location.href = `profile.html?name=${encodeURIComponent(name)}`;
        });
        memberList.appendChild(div);
    });

    window.allMembers = members;
}

// 🔵 Search Function
function filterNames() {
    const searchInput = document.getElementById("searchBar").value.toLowerCase();
    const memberList = document.getElementById("memberList");
    memberList.innerHTML = "";

    window.allMembers.forEach(name => {
        if (name.toLowerCase().includes(searchInput)) {
            const div = document.createElement("div");
            div.classList.add("member-item");
            div.textContent = name;
            div.addEventListener("click", () => {
                window.location.href = `profile.html?name=${encodeURIComponent(name)}`;
            });
            memberList.appendChild(div);
        }
    });
}

// Load Members on Page Load
document.addEventListener("DOMContentLoaded", loadMembers);
