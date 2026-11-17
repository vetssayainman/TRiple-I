
// Get existing attendance records
let attendance = JSON.parse(localStorage.getItem("attendance")) || [];

function onScanSuccess(decodedText) {

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
    const time = new Date().toLocaleTimeString();

    // Save attendance
    attendance.push({
        choices: choices.trim(),
        name: name.trim(),
        time: time,
        status: "Present"
    });

    // Store in localStorage
    localStorage.setItem("attendance", JSON.stringify(attendance));

    alert("Attendance recorded for " + name);
}

function onScanError(errorMessage) {
    // Scanner continuously checks for QR codes.
    // No need to display every scanning error.
}

// Initialize QR Scanner
const html5QrScanner = new Html5QrcodeScanner(
    "reader",
    {
        fps: 10,
        qrbox: 250
    },
    false
);

html5QrScanner.render(onScanSuccess, onScanError);

const togglebutton = document.getElementById('toggle_btn')
const sidebar =  document.getElementById('sidebar')

function toggleSidebar(){
    sidebar.classList.toggle('close')
    togglebutton.classList.toggle('rotate')

    Array.from(sidebar.getElementsByClassName("show")).forEach(ul=> {
        ul.classList.remove("show")
        ul.previousElementSibling.classList.remove("rotate")
    })
}

function toggleSection(button){
    button.nextElementSibling.classList.toggle("show")
    button.classList.toggle('rotate')

    if(sidebar.classList.contains("close")){
        sidebar.classList.toggle("close")
        togglebutton.classList.toggle("rotate")
    }
}
