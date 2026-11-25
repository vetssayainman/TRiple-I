
const attendanceBody = document.getElementById("attendance-body");
const totalStudents = document.getElementById("total-students");

// Display attendance records
function displayAttendance() {

    if (!attendanceBody || !totalStudents) {
        console.error("Attendance table elements not found!");
        return;
    }

    const attendance =
        JSON.parse(localStorage.getItem("attendance")) || [];

    attendanceBody.innerHTML = "";

    // Get Mark students only
    const markStudents = attendance.filter(student =>
        student.choices?.trim().toLowerCase() === "mark"
    );

    markStudents.forEach(student => {

        const row = document.createElement("tr");

        const scanTime = new Date(student.time);

        const deadline = new Date(scanTime);
        deadline.setHours(7, 0, 0, 0);

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

    totalStudents.textContent = "Total: " + markStudents.length;
}

// Run the function
displayAttendance();

// Update when another page saves attendance
window.addEventListener("storage", function(event) {
    if (event.key === "attendance") {
        displayAttendance();
    }
});

// Refresh every 2 seconds
setInterval(displayAttendance, 2000);


// Download Mark attendance
function saveBtn() {

    const attendance =
        JSON.parse(localStorage.getItem("attendance")) || [];

    const markStudents = attendance.filter(student =>
        student.choices?.trim().toLowerCase() === "mark"
    );

    if (markStudents.length === 0) {
        alert("No Mark attendance records to download!");
        return;
    }

    let csv = "Name,Section,Time In,Status\n";

    markStudents.forEach(student => {

        const scanTime = new Date(student.time);

        const deadline = new Date(scanTime);
        deadline.setHours(7, 0, 0, 0);

        const status = scanTime <= deadline ? "Present" : "Late";

        csv += `"${student.name}","${student.choices}","${student.time}","${status}"\n`;
    });

    const blob = new Blob([csv], {
        type: "text/csv;charset=utf-8;"
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "Mark_Attendance.csv";

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    alert("Mark attendance downloaded successfully!");
}


// Reset Mark attendance
function resetBtn() {

    const confirmReset = confirm(
        "Are you sure you want to reset Mark attendance?"
    );

    if (!confirmReset) {
        return;
    }

    let attendance =
        JSON.parse(localStorage.getItem("attendance")) || [];

    // Keep other sections' attendance
    attendance = attendance.filter(student =>
        student.choices?.trim().toLowerCase() !== "mark"
    );

    localStorage.setItem("attendance", JSON.stringify(attendance));

    displayAttendance();

    alert("Mark attendance has been reset!");
}
