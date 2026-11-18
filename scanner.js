
// Get existing attendance records
let attendance = JSON.parse(localStorage.getItem("attendance")) || [];

function onScanSuccess(decodedText) {

    console.log("QR DETECTED:", decodedText);

    // Separate the QR data
    const [choices, name] = decodedText.split("|");

    // Validate QR data
    if (!choices || !name) {
        alert("Wrong QR Code");
        return;
    }

    // Prevent duplicate attendance
    const alreadyRecorded = attendance.some(
        student => student.name === name.trim()
        && student.choices === choices.trim()
    );

    if (alreadyRecorded) {
        alert("Attendance already recorded!");
        return;
    }

    // Get current time
    const now = new Date();
    const time = now.toLocaleTimeString();

    // Determine attendance status
    const deadline = new Date();
    deadline.setHours(7, 0, 0, 0);

    const status = now <= deadline ? "Present" : "Late";

    // Save attendance
    attendance.push({
        choices: choices.trim(),
        name: name.trim(),
        time: time,
        status: status
    });

    // Store in localStorage
    localStorage.setItem("attendance", JSON.stringify(attendance));

    // Activate glowing scanner corners
    const reader = document.getElementById("reader");

    reader.classList.add("scanned");

    // Remove glow after 1.5 seconds
    setTimeout(() => {
        reader.classList.remove("scanned");
    }, 1500);

    alert("Attendance recorded for " + name);
    }

function onScanError(errorMessage) {
    // Scanner continuously checks for QR codes.
    // No need to display every scanning error.
}

// Check scanner library
console.log("Scanner library:", typeof Html5QrcodeScanner);
console.log("Reader element:", document.getElementById("reader"));

// Initialize QR Scanner (Camera only)
const html5QrScanner = new Html5QrcodeScanner(
    "reader",
    {
        fps: 15,
        qrbox: {
            width: 250,
            height: 250
        },
        aspectRatio: 1.0,
        rememberLastUsedCamera: true,

        // Remove image file scanning
        supportedScanTypes: [
            Html5QrcodeScanType.SCAN_TYPE_CAMERA
        ]
    },
    false
);

// Render scanner
html5QrScanner.render(onScanSuccess, onScanError);


// Sidebar functions
const togglebutton = document.getElementById('toggle_btn');
const sidebar = document.getElementById('sidebar');

function toggleSidebar(){
    sidebar.classList.toggle('close');
    togglebutton.classList.toggle('rotate');

    Array.from(sidebar.getElementsByClassName("show")).forEach(ul=> {
        ul.classList.remove("show");
        ul.previousElementSibling.classList.remove("rotate");
    });
}

function toggleSection(button){
    button.nextElementSibling.classList.toggle("show");
    button.classList.toggle('rotate');

    if(sidebar.classList.contains("close")){
        sidebar.classList.toggle("close");
        togglebutton.classList.toggle("rotate");
    }
}
