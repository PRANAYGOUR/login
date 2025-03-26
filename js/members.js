async function loadCSV() {
    try {
        const response = await fetch("./assets/filtered_members.csv"); // Fetch CSV file
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.text();
        const rows = data.split("\n").map(row => row.split(",").map(cell => cell.trim().replace(/['"]+/g, ''))); // Split & clean CSV

        const headerIndex = rows[0].indexOf("Name/नाम"); // Find column index for "Name/नाम"
        if (headerIndex === -1) {
            console.error("Column 'Name/नाम' not found in CSV.");
            return;
        }

        const members = rows.slice(1) // Skip header row
            .map(row => row[headerIndex]) // Get the name column
            .filter(name => name && name !== "undefined" && name !== "null"); // Remove empty values

        displayMembers(members); // Display names in UI
    } catch (error) {
        console.error("Error loading CSV:", error);
    }
}

function displayMembers(members) {
    const memberList = document.getElementById("memberList");
    memberList.innerHTML = "";

    members.forEach(name => {
        const div = document.createElement("div");
        div.classList.add("member-item");
        div.textContent = name;
        memberList.appendChild(div);
    });

    // Save members for search filtering
    window.allMembers = members;
}

function filterNames() {
    const searchInput = document.getElementById("searchBar").value.toLowerCase();
    const memberList = document.getElementById("memberList");
    memberList.innerHTML = "";

    window.allMembers.forEach(name => {
        if (name.toLowerCase().includes(searchInput)) {
            const div = document.createElement("div");
            div.classList.add("member-item");
            div.textContent = name;
            memberList.appendChild(div);
        }
    });
}

function goBack() {
    console.log("Back button clicked");  // Debugging log

    if (document.referrer) {
        console.log("Going back to previous page...");
        window.history.back();  // Works only if there’s a previous page
    } else {
        console.log("No previous page found. Redirecting to dashboard...");
        window.location.href = "dashboard.html"; // Change this to your actual dashboard page
    }
}


// Load CSV on page load
document.addEventListener("DOMContentLoaded", loadCSV);
