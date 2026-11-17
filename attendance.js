
// Get the HTML elements
const attendanceBody = document.getElementById("attendance-body");
const totalStudents = document.getElementById("total-students");

// Display attendance records
function displayAttendance() {

    // Check if the table elements exist
    if (!attendanceBody || !totalStudents) {
        console.error("Attendance table elements not found!");
        return;
    }

    // Get saved attendance
    const attendance =
        JSON.parse(localStorage.getItem("attendance")) || [];

    console.log("All attendance records:", attendance);

    // Clear existing table rows
    attendanceBody.innerHTML = "";

    // Get Hebrews students only
    const hebrews = attendance.filter(student =>
        student.choices?.trim().toLowerCase() === "hebrews"
    );

    // Display each student
    hebrews.forEach(student => {

        const row = document.createElement("tr");

        // Get the student's scan time
        const scanTime = new Date(student.time);

        // Set the attendance deadline (7:00 AM)
        const deadline = new Date(scanTime);
        deadline.setHours(7, 0, 0, 0);

        // Determine attendance status
        const status = scanTime <= deadline ? "Present" : "Late";

        const values = [
            student.name,
            student.choices,
            student.time,
            status
        ];

        values.forEach(value => {
            const cell = document.createElement("td");
            cell.textContent = value || "";
            row.appendChild(cell);
        });

        attendanceBody.appendChild(row);
    });

    // Update total students
    totalStudents.textContent = "Total: " + hebrews.length;

    console.log("Hebrews attendance:", hebrews);
}

// Run the function
displayAttendance();

// Update when another page saves attendance
window.addEventListener("storage", function(event) {
    if (event.key === "attendance") {
        displayAttendance();
    }
});

// Check every 2 seconds
setInterval(displayAttendance, 2000);



// save and risit


// Download attendance records
function saveBtn() {

    // Get saved attendance
    const attendance =
        JSON.parse(localStorage.getItem("attendance")) || [];

    // Get Hebrews students only
    const hebrews = attendance.filter(student =>
        student.choices?.trim().toLowerCase() === "hebrews"
    );

    // Check if there are attendance records
    if (hebrews.length === 0) {
        alert("No attendance records to download!");
        return;
    }

    // Create CSV headings
    let csv = "Name,Section,Time In,Status\n";

    // Add student information
    hebrews.forEach(student => {

        const scanTime = new Date(student.time);

        const deadline = new Date(scanTime);
        deadline.setHours(7, 0, 0, 0);

        const status = scanTime <= deadline ? "Present" : "Late";

        csv += `"${student.name}","${student.choices}","${student.time}","${status}"\n`;
    });

    // Create downloadable file
    const blob = new Blob([csv], {
        type: "text/csv;charset=utf-8;"
    });

    const url = URL.createObjectURL(blob);

    // Create download link
    const link = document.createElement("a");

    link.href = url;
    link.download = "Hebrews_Attendance.csv";

    document.body.appendChild(link);
    link.click();

    // Remove temporary link
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    alert("Attendance downloaded successfully!");
}


// Reset attendance records
function resetBtn() {

    // Ask for confirmation
    const confirmReset = confirm(
        "Are you sure you want to reset Hebrews attendance?"
    );

    if (!confirmReset) {
        return;
    }

    // Get all attendance records
    let attendance =
        JSON.parse(localStorage.getItem("attendance")) || [];

    // Keep other sections' attendance
    attendance = attendance.filter(student =>
        student.choices?.trim().toLowerCase() !== "hebrews"
    );

    // Save remaining attendance
    localStorage.setItem("attendance", JSON.stringify(attendance));

    // Refresh attendance table
    displayAttendance();

    alert("Hebrews attendance has been reset!");
}

